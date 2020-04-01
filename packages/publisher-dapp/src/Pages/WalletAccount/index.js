import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import isEmpty from "lodash/isEmpty";
import BigNumber from "bignumber.js";
import RefreshIcon from "@material-ui/icons/Refresh";

import SNETButton from "shared/dist/components/SNETButton";
import { useStyles } from "./styles";
import { ControlServiceRequest } from "../../Utils/Daemon/ControlService";
import { checkIfKnownError } from "shared/dist/utils/error";
import { aiServiceListActions, loaderActions } from "../../Services/Redux/actionCreators";
import UnclaimedPayments from "./UnclaimedPayments";
import MPEContract from "../../Utils/PlatformContracts/MPEContract";
import { blockChainEvents } from "../../Utils/Blockchain";
import { blocksToDays, signatureHexToVRS, toBNString } from "../../Utils/Grpc";
import { initSDK } from "shared/src/utils/snetSdk";
import { itemsPerPageOptions } from "./content";
import MmAuthorization from "./MMAuthorization";
import AccountDetails from "./AccountDetails";
import ClaimsAggregate from "./ClaimsAggregate";
import { alertTypes } from "shared/dist/components/AlertBox";
import { LoaderContent } from "../../Utils/Loader";
import AlertBox from "shared/dist/components/AlertBox";
import { MetamaskError } from "shared/dist/utils/error";
import ClaimsSuccessPopup from "./ClaimsSuccessPopup";
import { cogsToAgi } from "shared/src/utils/Pricing";

const controlServiceRequest = new ControlServiceRequest();
const defaultPaymentAggregate = {
  count: 0,
  amount: new BigNumber(0),
  expiry: { d7: { count: 0, amount: new BigNumber(0) } },
};

const defaultPagination = {
  limit: 0,
  offset: 0,
  totalCount: 0,
  itemsPerPage: itemsPerPageOptions[0].value,
};

class WalletAccount extends React.Component {
  state = {
    mmAuthorized: false,
    unclaimedPayments: [],
    pendingPayments: [],
    mmAccDetails: { escrowBalance: "", tokenBalance: "" },
    aggregatePaymentDetails: defaultPaymentAggregate,
    pagination: defaultPagination,
    selectedChannels: {},
    getPaymentsListAlert: {},
    claimChannelsAlert: {},
    showClaimsSuccessPopup: false,
    transactionDetails: {
      latest: { channelsClaimed: [], amountClaimed: "" },
      session: { channelsClaimed: [], amountClaimed: "" },
    },
  };

  async componentDidMount() {
    const { orgUuid, getServices } = this.props;
    this.initEscrow();
    const serviceList = await getServices(orgUuid);
    this.findServiceHost(serviceList);
  }

  async componentDidUpdate(prevProps) {
    const { orgUuid, getServices } = this.props;
    if (prevProps.orgUuid !== orgUuid) {
      const serviceList = await getServices(orgUuid);
      this.findServiceHost(serviceList);
    }
  }

  initEscrow = async () => {
    const sdk = await initSDK();
    const escrowBalance = await sdk.account.escrowBalance();
    const tokenBalance = await sdk.account.balance();
    this.setState({
      mmAccDetails: { tokenBalance: toBNString(tokenBalance), escrowBalance: escrowBalance.toString() },
    });
  };

  findServiceHost = serviceList => {
    const endpoints = serviceList
      .map(el => {
        if (isEmpty(el.groups)) {
          return undefined;
        }
        return el.groups[0].endpoints;
      })
      .filter(el => Boolean(el));

    const validEndpoints = endpoints.map(endpoint => {
      return Object.entries(endpoint)
        .map(([key, value]) => {
          if (value.valid) {
            return key;
          }
          return undefined;
        })
        .filter(el => Boolean(el));
    });

    // TODO select endpoint that is valid
    const serviceHost = validEndpoints[0];
    controlServiceRequest.serviceHost = serviceHost[0];
  };

  getUnclaimedPaymentsFromDaemon = async () => {
    const unclaimedPayments = await controlServiceRequest.getListUnclaimed();
    return unclaimedPayments;
  };

  getPendingPaymentsFromDaemon = async () => {
    const pendingPayments = await controlServiceRequest.getListInProgress();
    return pendingPayments;
  };

  claimMPEChannels = async payments => {
    // payload order:- channelId, actualAmount, plannedAmount, isSendback, v, r, s
    const defaultPayloadAccumulator = [[], [], [], [], [], [], []];
    const payloadForMultiChannelClaim = payments.reduce((acc, cur) => {
      const { channelId, signedAmount, signature } = cur;
      const { v, r, s } = signatureHexToVRS(signature);
      acc[0].push(channelId);
      acc[1].push(signedAmount);
      acc[2].push(signedAmount);
      acc[6].push(false);
      acc[3].push(v);
      acc[4].push(r);
      acc[5].push(s);
      return acc;
    }, defaultPayloadAccumulator);
    const mpe = new MPEContract();
    this.props.startAppLoader(LoaderContent.SIGN_CLAIMS_IN_MM);
    const method = await mpe.multiChannelClaim(...payloadForMultiChannelClaim);
    method.on(blockChainEvents.TRANSACTION_HASH, () => {
      // TODO call daemon start claims
      this.props.startAppLoader(LoaderContent.CLAIMING_CHANNELS_IN_BLOCKCHAIN);
    });
    method.once(blockChainEvents.CONFIRMATION, async () => {
      // TODO stop loader
      // TODO refetch claims list
      const currentTransaction = payments.reduce(
        (acc, cur) => ({
          channelsClaimed: acc.channelsClaimed.push(cur.channelId),
          amountClaimed: BigNumber.sum(acc.amountClaimed, cur.signedAmount),
        }),
        { channelsClaimed: [], amountClaimed: "" }
      );
      this.setState(prevState => ({
        claimChannelsAlert: {
          type: alertTypes.SUCCESS,
          message: `Selected channels have been claimed from the blockchain successfully. 
          Please refresh the list, to fetch the latest payments`,
        },
        showClaimsSuccessPopup: true,
        transactionDetails: {
          latest: {
            channelsClaimed: currentTransaction.channelsClaimed,
            amountClaimed: currentTransaction.amountClaimed,
          },
          session: {
            channelsClaimed: [
              ...prevState.transactionDetails.session.channelsClaimed,
              ...currentTransaction.channelsClaimed,
            ],
            amountClaimed: BigNumber.sum(
              prevState.transactionDetails.session.amountClaimed,
              currentTransaction.channelsClaimed
            ),
          },
        },
      }));
      this.props.stopAppLoader();
      await method.off();
    });
    method.on(blockChainEvents.ERROR, e => {
      this.props.stopAppLoader();
      throw new MetamaskError(e);
    });
  };

  claimChannelInBlockchain = async () => {
    this.props.startAppLoader(LoaderContent.START_CHANNEL_CLAIMS);
    this.setState({ claimChannelsAlert: {} });
    const { selectedChannels } = this.state;
    let pendingPayments = [],
      unclaimedPayments = [];

    Object.entries(selectedChannels).forEach(([channelId, checked]) => {
      if (checked) {
        const pendingPaymentSelected = this.state.pendingPayments.find(el => el.channelId === channelId);
        const unclaimedPaymentSelected = this.state.unclaimedPayments.find(el => el.channelId === channelId);
        if (pendingPaymentSelected) {
          pendingPayments.push(pendingPaymentSelected);
        } else if (unclaimedPaymentSelected) {
          unclaimedPayments.push(unclaimedPaymentSelected);
        }
      }
    });
    const paymentsToBeClaimedInBlockchain = [...pendingPayments];
    if (!isEmpty(unclaimedPayments)) {
      const channelIdList = unclaimedPayments.map(el => el.channelId);
      const startedPayments = await controlServiceRequest.startClaimForMultipleChannels(channelIdList);
      paymentsToBeClaimedInBlockchain.push(...startedPayments);
    }
    try {
      await this.claimMPEChannels(paymentsToBeClaimedInBlockchain);
    } catch (e) {
      this.props.stopAppLoader();
      this.setState({ claimChannelsAlert: { type: alertTypes.ERROR, message: e.message } });
      // TODO handle error
    }
  };

  calculatePaymentAggregate = payments => {
    return payments.reduce((acc, cur) => {
      const updatedValue = {
        ...acc,
        count: acc.count + 1,
        amount: BigNumber.sum(acc.amount, cur.signedAmount).toFixed(),
      };
      const blocksRemaining = cur.channelExpiry - cur.currentBlock;
      if (blocksRemaining > 0 && blocksToDays(blocksRemaining) <= 7) {
        updatedValue.expiry = {
          ...acc.expiry,
          d7: {
            count: acc.expiry.d7.count + 1,
            amount: BigNumber.sum(acc.expiry.d7.amount, cur.signedAmount),
          },
        };
      }
      return updatedValue;
    }, defaultPaymentAggregate);
  };

  handleAuthorizeMM = async () => {
    try {
      this.setState({ getPaymentsListAlert: {} });
      this.props.startAppLoader(LoaderContent.GET_CLAIMS_LIST);
      const [unclaimedPayments, pendingPayments] = await Promise.all([
        this.getUnclaimedPaymentsFromDaemon(),
        this.getPendingPaymentsFromDaemon(),
      ]);
      const aggregatePaymentDetails = this.calculatePaymentAggregate([...unclaimedPayments, ...pendingPayments]);
      const totalCount = unclaimedPayments.length + pendingPayments.length;
      this.setState({
        mmAuthorized: true,
        unclaimedPayments,
        pendingPayments,
        aggregatePaymentDetails,
        pagination: { ...defaultPagination, totalCount, limit: totalCount < 10 ? totalCount : 10 },
      });
      this.props.stopAppLoader();
    } catch (e) {
      this.props.stopAppLoader();
      if (checkIfKnownError(e)) {
        this.setState({ getPaymentsListAlert: { type: alertTypes.ERROR, message: e.message } });

        // TODO set alert error
      }
      return undefined;
    }
  };

  onItemsPerPageChange = itemsPerPage => {
    this.setState(prevState => ({
      pagination: { ...prevState.pagination, itemsPerPage },
    }));
  };

  handlePageChange = offset => {
    this.setState(prevState => ({
      pagination: { ...prevState.pagination, offset },
    }));
  };

  handleSelectChannel = event => {
    const { value: channelId, checked } = event.target;
    this.setState(prevState => ({ selectedChannels: { ...prevState.selectedChannels, [channelId]: checked } }));
  };

  shouldClaimBeEnabled = () => Object.values(this.state.selectedChannels).some(Boolean);

  selectedChannelCount = () => Object.values(this.state.selectedChannels).filter(Boolean).length;

  render() {
    const { classes } = this.props;
    const {
      unclaimedPayments,
      pendingPayments,
      mmAccDetails,
      aggregatePaymentDetails,
      pagination,
      selectedChannels,
      mmAuthorized,
      getPaymentsListAlert,
      claimChannelsAlert,
      showClaimsSuccessPopup,
      transactionDetails,
    } = this.state;
    const paymentsList = [...unclaimedPayments, ...pendingPayments];

    if (!mmAuthorized) {
      return <MmAuthorization handleAuthorizeMM={this.handleAuthorizeMM} alert={getPaymentsListAlert} />;
    }

    return (
      <Grid container className={classes.walletAccContainer}>
        <Grid item xs={12} sm={12} md={12} lg={12} className={classes.topSection}>
          <Typography variant="h3">Wallet Account</Typography>
          <Typography variant="h5">
            Manage your token claims. Tokens can be claimed together or individually from each channel.
          </Typography>
        </Grid>
        <AccountDetails aggregatePaymentDetails={aggregatePaymentDetails} mmAccDetails={mmAccDetails} />
        <Grid item xs={12} sm={12} md={12} lg={12} className={classes.box}>
          <div className={classes.header}>
            <Typography variant="h6">Claims</Typography>
            <SNETButton children="refresh" color="primary" endIcon={<RefreshIcon />} onClick={this.handleAuthorizeMM} />
          </div>
          <Typography className={classes.claimsDesc}>
            To collect pending tokens from individual channels, select the channels and use the claim button. Claims
            that are going to be expired soon are marked with “!” icon. Please note that you cannot select more than
            five claims at a time.
          </Typography>
          <ClaimsAggregate aggregatePaymentDetails={aggregatePaymentDetails} />
          <AlertBox type={claimChannelsAlert.type} message={claimChannelsAlert.message} />
          <ClaimsSuccessPopup
            show={showClaimsSuccessPopup}
            agiClaimed={cogsToAgi(transactionDetails.latest.amountClaimed)}
            channelIdList={transactionDetails.latest.channelsClaimed}
          />
          <div className={classes.claimSelectedSection}>
            <SNETButton
              children="Collect Claims"
              color="primary"
              variant="outlined"
              onClick={this.claimChannelInBlockchain}
              disabled={!this.shouldClaimBeEnabled()}
            />
            <Typography>Selected ({this.selectedChannelCount()})</Typography>
          </div>
          <div>
            <UnclaimedPayments
              payments={paymentsList}
              pagination={pagination}
              onItemsPerPageChange={this.onItemsPerPageChange}
              handlePageChange={this.handlePageChange}
              selectedChannels={selectedChannels}
              onSelectChannel={this.handleSelectChannel}
            />
          </div>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  orgUuid: state.organization.uuid,
  limit: state.aiServiceList.pagination.limit,
  offset: state.aiServiceList.pagination.offset,
  totalCount: state.aiServiceList.totalCount,
  serviceList: state.aiServiceList.data,
});

const mapDispatchToProps = dispatch => ({
  startAppLoader: content => dispatch(loaderActions.startAppLoader(content)),
  stopAppLoader: () => dispatch(loaderActions.stopAppLoader()),
  getServices: orgUuid => dispatch(aiServiceListActions.getAiServiceList(orgUuid)),
});
export default withStyles(useStyles)(connect(mapStateToProps, mapDispatchToProps)(WalletAccount));
