import React from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from "prop-types";

import { useStyles } from "./styles";

const StyledDropdown = ({ labelTxt, list, value, onChange, formControlProps, inputLabel, disabled, icon, infoMsg }) => {
  const classes = useStyles();

  return (
    <>
      {icon ? (
        <Tooltip title={infoMsg ? infoMsg : ""}>
          <InfoIcon className={classes.infoIcon} />
        </Tooltip>
      ) : null}

      <FormControl variant="outlined" className={classes.formControl} {...formControlProps}>
        {inputLabel ? <InputLabel htmlFor="age-simple">{inputLabel}</InputLabel> : null}
        <Select
          value={value}
          onChange={onChange}
          name={labelTxt}
          className={classes.selectEmpty}
          variant="outlined"
          disabled={disabled}
        >
          <MenuItem value="default" className={classes.defaultMenuItem}>
            {labelTxt || "Select a value"}
          </MenuItem>
          {list &&
            list.map(item => (
              <MenuItem key={item.value} value={item.value} className={classes.menuItem}>
                {item.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
};

StyledDropdown.propTypes = {
  inputLabel: PropTypes.string,
  labelTxt: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
};

StyledDropdown.defaultProps = {
  labelTxt: "",
  value: "default",
};

export default StyledDropdown;
