import React, { Fragment, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import BasicDetails from "./BasicDetails";
import CompanyAddress from "./CompanyAddress";
import SNETButton from "shared/dist/components/SNETButton";
import { useStyles } from "./styles";
import { OnboardingRoutes } from "../../OnboardingRouter/Routes";
import { organizationActions } from "../../../../Services/Redux/actionCreators";
import validator from "shared/dist/utils/validator";
import { orgOnboardingConstraints } from "./validationConstraints";
import AlertBox, { alertTypes } from "shared/dist/components/AlertBox";
import { GlobalRoutes } from "../../../../GlobalRouter/Routes";
import { organizationSetupStatuses, organizationTypes } from "../../../../Utils/organizationSetup";
import { generateDetailedErrorMessageFromValidation } from "../../../../Utils/validation";
import { userEntities } from "../../../../Utils/user";
import ConfirmationPopup from "./ConfirmationPopup";

const selectState = state => {
  return {
    userEntity: state.user.entity,
    organization: state.organization,
    email: state.user.email,
  };
};

const Organization = props => {
  const classes = useStyles();
  const { history } = props;
  const [alert, setAlert] = useState({});
  const { organization, email, userEntity, individualStatus } = useSelector(selectState);
  const [allowDuns, setAllowDuns] = useState(false);
  const [showConfimationPopup, setShowConfimationPopup] = useState(false);

  const dispatch = useDispatch();
  const [invalidFieldsFlag, setInvalidFieldsFlag] = useState();
  let orgValidationConstraints = orgOnboardingConstraints;

  if (userEntity === userEntities.INDIVIDUAL) {
    delete orgValidationConstraints.id;
  }
  const invalidFields = validator(organization, orgValidationConstraints, { format: "grouped" });

  useEffect(() => {
    setAllowDuns(organization.uuid ? (organization.duns ? true : false) : true);
  }, [organization.duns, organization.uuid, setAllowDuns]);

  useEffect(() => {
    if (organization.state.state === organizationSetupStatuses.ONBOARDING_REJECTED && !Boolean(alert.type)) {
      setAlert({
        type: alertTypes.ERROR,
        message: "Your organization has been rejected.",
      });
    } else if (organization.state.state === organizationSetupStatuses.CHANGE_REQUESTED && !Boolean(alert.type)) {
      setAlert({
        type: alertTypes.ERROR,
        message: "Please validate the details provided and submit again for approval",
      });
    }
  }, [organization.state.state, setAlert, alert, individualStatus]);

  const handleNavigateBack = () => {
    history.push(OnboardingRoutes.SINGULARITY_ACCOUNT.path);
  };

  const handleFinish = () => {
    setShowConfimationPopup(true);
  };

  const handleClosePopup = () => {
    setShowConfimationPopup(false);
  };

  const handleContinue = async () => {
    setShowConfimationPopup(false);
    setAlert({});
    try {
      if (invalidFields) {
        const isNotValid = Object.values(invalidFields);
        if (isNotValid) {
          const errorMessage = generateDetailedErrorMessageFromValidation(isNotValid);
          setInvalidFieldsFlag(true);
          return setAlert({ type: alertTypes.ERROR, children: errorMessage });
        }
      }
      let orgUuid;
      const orgData = { ...organization, duns: allowDuns ? organization.duns : "" };
      if (userEntity === userEntities.INDIVIDUAL) {
        orgData.type = organizationTypes.INDIVIDUAL;
      }
      const data = await dispatch(organizationActions.createOrganization(orgData, email));
      orgUuid = data.org_uuid;
      if (data.state.state === organizationSetupStatuses.ONBOARDING_APPROVED) {
        history.push(GlobalRoutes.ORGANIZATION_SETUP.path.replace(":orgUuid", orgUuid));
      }
    } catch (error) {
      return setAlert({
        type: alertTypes.ERROR,
        message: "Unable to finish organization authentication. Please try later",
      });
    }
  };

  const handleCancel = () => {
    dispatch(organizationActions.resetOrganizationData());
    history.push(OnboardingRoutes.SINGULARITY_ACCOUNT.path);
  };

  return (
    <Fragment>
      <div className={classes.box}>
        <Typography variant="h6">Organization Verification Required</Typography>
        <div className={classes.wrapper}>
          {userEntity === userEntities.INDIVIDUAL || organization.type === organizationTypes.INDIVIDUAL ? (
            <Typography>
              Please provide your company organization details and individual identity for the verification process.
            </Typography>
          ) : (
            <Typography>
              Please provide your company organization details and your DUNS number for the verification process.
            </Typography>
          )}

          <BasicDetails
            allowDuns={allowDuns}
            setAllowDuns={setAllowDuns}
            invalidFields={typeof invalidFieldsFlag !== "undefined" ? invalidFields : {}}
          />
          <CompanyAddress />
          <div className={classes.alertBoxContainer}>
            <AlertBox type={alert.type} message={alert.message} children={alert.children} />
          </div>
        </div>
      </div>
      <div className={classes.buttonsContainer}>
        <SNETButton color="primary" children="cancel" onClick={handleCancel} />
        <SNETButton color="primary" children="back" onClick={handleNavigateBack} />
        <SNETButton
          color="primary"
          variant="contained"
          children="finish"
          onClick={handleFinish}
          disabled={organization.state.state === organizationSetupStatuses.ONBOARDING_REJECTED}
        />
      </div>
      {showConfimationPopup ? (
        <ConfirmationPopup open={true} handleClose={handleClosePopup} handleContinue={handleContinue} />
      ) : null}
    </Fragment>
  );
};

export default withRouter(Organization);
