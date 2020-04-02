import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { GlobalRoutes } from "../../GlobalRouter/Routes";
import VerificationFailed from "shared/dist/assets/images/VerificationFailed.png";
import SNETStatusBanner, { statusTitleType } from "shared/dist/components/SNETStatusBanner";

const selectState = state => ({
  status: state.organization.state.state,
  rejectReason: state.organization.rejectReason,
  uuid: state.organization.uuid,
});

const VerificationChangeRequested = () => {
  const { rejectReason } = useSelector(selectState);
  const history = useHistory();
  const { orgUuid } = useParams();

  const handleEditOrgDetails = () => {
    history.push(GlobalRoutes.ORGANIZATION_SETUP.path.replace(":orgUuid", orgUuid));
  };

  return (
    <SNETStatusBanner
      title="Your organization needs changes."
      img={VerificationFailed}
      description={`There have been some comments/changes on your organization .Please review the changes requested in the comments below.
      Comments: ${rejectReason}.
      Please check your inbox for mail from singularitynet team with detailed explanation for the changes to be made for your organization.`}
      actions={[
        {
          children: "EDIT DETAILS",
          variant: "contained",
          color: "primary",
          onClick: handleEditOrgDetails,
        },
        { children: "contact support", variant: "outlined", color: "primary", disabled: true },
      ]}
      type={statusTitleType.CHANGE_REQUESTED}
    />
  );
};

export default VerificationChangeRequested;