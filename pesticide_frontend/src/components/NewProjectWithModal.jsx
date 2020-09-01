import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import CreateNewFolderRoundedIcon from "@material-ui/icons/CreateNewFolderRounded";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DefaultTooltip from "@material-ui/core/Tooltip";
import Grow from "@material-ui/core/Grow";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import NewProjectForm from "./NewProjectForm";

const isMobile = window.innerWidth < 850;

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

const NewProjectWithModal = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const magic = {
    color: props.currentTheme == "palpatine" && "red",
  };

  const Tooltip = withStyles({
    tooltip: {
      backgroundColor: ["dark", "solarizedDark", "palpatine"].includes(
        props.currentTheme
      )
        ? "#353535"
        : "#ffffff",
      color: ["dark", "solarizedDark", "palpatine"].includes(props.currentTheme)
        ? "#ffffff"
        : "#353535",
      backgroundFilter: "blur(20px)",
      fontSize: "17px",
      fontWeight: "900",
      padding: "5px",
      border: "1px solid #808080b3",
      borderRadius: "10px",
    },
  })(DefaultTooltip);

  return (
    <div>
      {props.floating && (
        <Fab
          onClick={handleClickOpen}
          color="secondary"
          style={{
            position: "absolute",
            bottom: "30px",
            right: "30px",
            zIndex: 1200,
          }}
        >
          <AddIcon />
        </Fab>
      )}
      <Tooltip
        title={!props.open ? "Create project" : ""}
        placement="right"
        className="drawer-btn-filled"
      >
        <ListItem button onClick={handleClickOpen}>
          <ListItemIcon style={magic}>
            <div className="drawer-project-icon-container">
              <CreateNewFolderRoundedIcon />
            </div>
          </ListItemIcon>
          <ListItemText primary="Create project" />
        </ListItem>
      </Tooltip>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Grow}
        transitionDuration={{
          enter: 100,
          exit: 100,
        }}
        className={!isMobile ? "modal-rounded" : null}
        maxWidth="xl"
      >
        <DialogTitle id="responsive-dialog-title" className="modal-title">
          <Button
            className="btn-filled-small btn-filled-bg-transparent btn-round"
            onClick={handleClose}
          >
            <CloseRoundedIcon />
          </Button>
          Create New Project
        </DialogTitle>

        <DialogContent style={{ padding: "5px 10px" }}>
          <NewProjectForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentTheme: state.theme.theme,
  };
};

export default withRouter(connect(mapStateToProps, null)(NewProjectWithModal));
