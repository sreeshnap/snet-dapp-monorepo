import React from "react";
import { withStyles } from "@material-ui/styles";
import StyledPaginationPublisher from "../../../Components/StyledPagination";
import CardGroup from "./CardGroup";
import { useStyles } from "./styles";

const ServiceCollection = ({ classes, pagination, totalCount, handlePageChangePublisher }) => {
  return (
    <div className={classes.serviceCollection}>
      <CardGroup />
      <StyledPaginationPublisher
        limit={pagination.limit}
        offset={pagination.offset}
        total_count={totalCount}
        handleChange={handlePageChangePublisher}
      />
    </div>
  );
};
export default withStyles(useStyles)(ServiceCollection);
