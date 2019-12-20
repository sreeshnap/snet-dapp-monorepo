import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import InfoIcon from "@material-ui/icons/Info";

import { useStyles } from "./styles";
import StyledTextField from "shared/dist/components/StyledTextField";

const SNETTextarea = ({ classes, label, rowCount, colCount, name, value, onChange, content, minCount, maxCount }) => {
  return (
    <div className={classes.textareaIconContainer}>
      <div className={classes.infoIconContainer}>
        <InfoIcon />
      </div>
      <div className={classes.textareaContainer}>
        <span className={classes.label}>{label}</span>
        <textarea rows={rowCount} cols={colCount} name={name} value={value} onChange={onChange}>
          {content}
        </textarea>
        <span className={classes.charLength}>
          {minCount}/{maxCount} char
        </span>
      </div>
    </div>
  );
};

SNETTextarea.propTypes = {
  label: PropTypes.string,
  rowCount: PropTypes.number,
  colCount: PropTypes.number,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  content: PropTypes.string,
  mainCount: PropTypes.number,
  maxCount: PropTypes.number,
};

export default withStyles(useStyles)(SNETTextarea);