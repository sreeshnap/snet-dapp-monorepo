import React from "react";
import { withStyles } from "@material-ui/styles";

import StyledPagination from "../../../Components/StyledPagination";

// import { useSelector, useDispatch } from "react-redux";

// import ToolBar from "./ToolBar";
import CardGroup from "./CardGroup";
// import { itemsPerPageOptions } from "./content";
// import SNETPagination from "shared/dist/components/SNETPagination";
import { useStyles } from "./styles";

// import { setAiServiceListPagination } from "../../../Services/Redux/actionCreators/aiServiceListActions";

// TODO uncomment pagination and toolbox once it is ready
const ServiceCollection = ({ classes, pagination, totalCount, handlePageChange }) => {
  // const { limit, offset, totalCount } = useSelector(state => ({
  //   limit: state.aiServiceList.pagination.limit,
  //   offset: state.aiServiceList.pagination.offset,
  //   totalCount: state.aiServiceList.totalCount,
  // }));
  // const dispatch = useDispatch();

  // const onItemsPerPageChange = itemsPerPage => {
  //   dispatch(setAiServiceListPagination({ limit: itemsPerPage }));
  // };
  //
  // const handlePageChange = offset => {
  //   dispatch(setAiServiceListPagination({ offset }));
  // };

  // if (isEmpty(serviceList)) {
  //   return <CardGroup />;
  // }

  return (
    <div className={classes.serviceCollection}>
      {/*<ToolBar />*/}
      <CardGroup />
      <StyledPagination
        limit={pagination.limit}
        offset={pagination.offset}
        total_count={totalCount}
        handleChange={handlePageChange}
      />
      {/* <SNETPagination
        itemsPerPageOptions={itemsPerPageOptions}
        itemsPerPage={limit}
        onItemsPerPageChange={onItemsPerPageChange}
        limit={limit}
        offset={offset}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />*/}
    </div>
  );
};
export default withStyles(useStyles)(ServiceCollection);
