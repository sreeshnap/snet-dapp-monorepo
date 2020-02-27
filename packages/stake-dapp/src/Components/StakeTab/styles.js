export const useStyles = MUITheme => ({
  mainSection: {
    padding: "32px 0 60px",
    "& div": {
      "@media(max-width: 1024px)": { maxWidth: "100%" },
    },
    "@media(max-width: 1280px)": { paddingBottom: 30 },
    "@media(max-width: 1024px)": { flexDirection: "column" },
  },
  tabsContainer: {
    "@media(max-width: 1280px)": { paddingLeft: 0 },
  },
  header: {
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#e2e2e2",
    marginBottom: 46,
    position: "relative",
    backgroundColor: "transparent",
    boxShadow: "none",
    "& button": {
      color: MUITheme.palette.text.lightGrey,
      fontFamily: MUITheme.typography.fontFamily,
      fontSize: 20,
      textTransform: "capitalize",
      lineHeight: "25px",
    },
    "& .MuiTab-textColorPrimary.Mui-selected": { fontWeight: 600 },
    "& .PrivateTabIndicator-colorPrimary-289": {
      backgroundColor: MUITheme.palette.text.primary,
    },
  },
  tabDetailsContainer: {
    minHeight: 200,
    position: "relative",
    "& .MuiExpansionPanel-root": { marginBottom: 10 },
    "& .MuiPaper-elevation1": { boxShadow: "none" },
  },
});