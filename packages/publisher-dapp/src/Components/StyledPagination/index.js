import React, { useState } from "react";
import Pagination from "material-ui-flat-pagination";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";

import { useStyles } from "./styles";

const StyledPaginationPublisher = ({ limit, offset, total_count, handleChange }) => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const classes = useStyles();

  const handleItemsPerPagePublisher = event => {
    const pagination = {
      offset: 0,
      limit: event.target.value,
    };
    setItemsPerPage(event.target.value);
    handleChange(pagination);
  };

  const handlePageChangePublisher = selectedOffset=> {
    if (selectedOffset === parseFloat(offset)) {
      return;
    }
    const pagination = { offset: selectedOffset };
    handleChange(pagination);
  };

  const currentFirstItem = offset;
  const currentLastItem = parseFloat(limit) + parseFloat(offset);
  const currentLastItemExceed = total_count - currentFirstItem + currentFirstItem;

  return (
    <Grid container spacing={24} className={classes.paginationContainerPublisher}>
      <Grid item xs={6} sm={6} md={6} lg={6} className={classes.pagination}>
        <Pagination
          limit={limit}
          offset={offset}
          total={total_count}
          reduced={true}
          onClick={(_e,offset_value) => handlePageChangePublisher(offset_value)}
          className={classes.styledPaginationPublisher}
        />
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6} className={classes.pageCountSectionPublisher}>
        <span className={classes.itemPerPageTxt}>Items per page</span>
        <FormControl variant="outlined" className={classes.pageListformControlPublisher}>
          <Select
            value={itemsPerPage}
            input={<OutlinedInput labelWidth={75} name="age" id="outlined-age-simple" onChange={handleItemsPerPagePublisher} />}
            className={classes.selectBox}
          >
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={24}>24</MenuItem>
            <MenuItem value={36}>36</MenuItem>
          </Select>
        </FormControl>
        {currentLastItem < total_count ? (
          <span>
            {currentFirstItem}-{currentLastItem} of {total_count}
          </span>
        ) : (
          <span>
            {currentFirstItem}-{currentLastItemExceed} of {total_count}
          </span>
        )}
      </Grid>
    </Grid>
  );
};

export default StyledPaginationPublisher;
