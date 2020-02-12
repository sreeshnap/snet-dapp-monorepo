export const useStyles = MUITheme => ({
  getInTouchContainer: { background: MUITheme.palette.background.mainContent },
  getInTouch: {
    maxWidth: 870,
    padding: "97px 30px 91px !important",
    margin: "0 auto",
    textAlign: "center",
    "& p": { textAlign: "initial" },
    "& form": {
      marginTop: 32,
      display: "flex",
      justifyContent: "center",
      alignItems: "baseline",
      "& > div": {
        width: 370,
        marginRight: 24,
        "& > div": {
          maxWidth: "100%",
          "& .MuiFormControl-root": { background: MUITheme.palette.border.mainContent },
        },
      },
      "& a": { marginTop: "0 !important" },
    },
    "& input": {
      width: 411,
      display: "block",
      [MUITheme.breakpoints.down("xs")]: { width: 300 },
    },
    "& button": {
      padding: "16px 28px 16px",
      marginTop: "0 !important",
    },
    [MUITheme.breakpoints.down("sm")]: {
      maxWidth: "100%",
      padding: "40px 20px !important",
    },
    "& a": {
      display: "inherit",
      textDecoration: "none",
    },
  },
});
