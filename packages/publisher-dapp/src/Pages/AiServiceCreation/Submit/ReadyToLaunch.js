import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { useStyles } from "./styles";

import SNETStatusBanner, { statusTitleType } from "shared/dist/components/SNETStatusBanner";
import AlertBox, { alertTypes } from "shared/dist/components/AlertBox";
import VerificationApprovedImage from "shared/dist/assets/images/VerificationApproved.png";

const ReadyToLaunch = ({ classes, handlePublish, handleBackToDashboard, alert, openDaemonConfigModal }) => {
  const handleOpenDaemonConfigModal = e => {
    e.preventDefault();
    openDaemonConfigModal();
  };
  return (
    <div className={classes.statusBannerContainer}>
      <SNETStatusBanner
        title="Ready to Launch"
        img={VerificationApprovedImage}
        description={
          <Fragment>
            <Typography> Please proceed to launch to complete the final step.</Typography>
            <ul>
              <li>
                <Typography>
                  The final launch will require you to be logged into your Metamask with some ETH available to activate
                  the service.
                </Typography>
              </li>
              <li>
                <Typography>Only the owner of the organization can launch an update.</Typography>
              </li>
              <li>
                <Typography>
                  Once you launch the update, it will take some for your changes to be reflected on AI Marketplace.
                </Typography>
              </li>
              <li>
                <Typography>
                  Click <a onClick={handleOpenDaemonConfigModal}>here</a> to open daemon config modal
                </Typography>
              </li>
            </ul>
            <AlertBox type={alertTypes.WARNING}>
              We have temporarily disabled this action as we are hard forking the AGI token to make it cross chain
              compatible. We will enable it as soon as the hard fork is completed. Read more{" "}
              <a
                href="https://blog.singularitynet.io/singularitynet-phase-ii-launch-sequence-activated-agi-token-to-be-hard-forked-to-10ede4b6c89"
                target="_blank"
                rel="noreferrer noopener"
              >
                here
              </a>
            </AlertBox>
          </Fragment>
        }
        actions={[
          {
            children: "Launch Service",
            variant: "contained",
            color: "primary",
            onClick: handlePublish,
            disabled: true,
          },
          { children: "back to dashboard", variant: "outlined", color: "primary", onClick: handleBackToDashboard },
        ]}
        type={statusTitleType.PENDING}
      />
      <AlertBox type={alert.type} message={alert.message} />
    </div>
  );
};

export default withStyles(useStyles)(ReadyToLaunch);
