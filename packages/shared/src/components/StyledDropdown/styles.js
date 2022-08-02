import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(MUITheme => ({
  iconTooltipContainer: {
    width: "auto !important",
    position: "relative",
    "& > svg": {
      paddingRight: 8,
      color: MUITheme.palette.text.disabled,
      cursor: "pointer",
      fontSize: 18,
      verticalAlign: "middle",
    },
    "& p": {
      width: 377,
      padding: 16,
      borderRadius: 4,
      display: "none",
      position: "absolute",
      bottom: 9,
      background: MUITheme.palette.text.lightGrey,
      boxShadow: "0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)",
      color: MUITheme.palette.text.white,
      fontSize: 16,
      lineHeight: "20px",
      zIndex: 999,
    },
    "&:hover": {
      "& svg": { color: MUITheme.palette.primary.main },
      "& p": { display: "block" },
    },
  },
  formControl: {
    width: 364,
    paddingLeft: 23,
    "& label": {
      padding: "0 20px 0 10px",
      left: 20,
      background: "#fff",
      color: MUITheme.palette.text.darkGrey,
      fontSize: 12,
      letterSpacing: 0.4,
      transform: `${"translate(14px, -6px) scale(0.90)"} !important`,
    },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: MUITheme.palette.border.inputBorder },
  },
  selectEmpty: {
    color: `${MUITheme.palette.text.darkGrey} !important`,
    "& .MuiSelect-root": {
      padding: "15.5px 15px !important",
      fontSize: 16,
      letterSpacing: 0.15,
      lineHeight: "24px",
    },
    "&:before": { display: "none" },
    "& select": {
      "&:hover": {
        backgroundColor: "rgba(0,90,203,0.05)",
      },
    },
    "& .MuiSelect-select": {
      "&:focus": { backgroundColor: "transparent" },
    },
  },
  defaultMenuItem: {
    color: MUITheme.palette.text.lightGrey,
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: "28px",
  },
  menuItem: {
    color: MUITheme.palette.text.darkGrey,
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: "28px",
    "&:hover": {
      background: MUITheme.palette.background.mainContent,
      color: MUITheme.palette.primary.main,
    },
  },
}));
