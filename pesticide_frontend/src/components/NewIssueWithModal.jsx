import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Input from "@material-ui/core/Input";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import { IconButton } from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Grow from "@material-ui/core/Grow";
import NewIssueForm from "./NewIssueForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewIssueWithModal(props) {
  const isMobile = useMediaQuery("(max-width: 700px)");
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {props.floating ? (
        <Fab
          onClick={handleClickOpen}
          color="secondary"
          style={{
            position: "absolute",
            bottom: isMobile ? "75px" : "30px",
            right: "30px",
            zIndex: 1202,
          }}
        >
          <AddIcon />
        </Fab>
      ) : (
        <Button
          startIcon={<AddRoundedIcon />}
          onClick={handleClickOpen}
          className="btn-filled"
        >
          Add
        </Button>
      )}

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
      >
        <DialogTitle id="responsive-dialog-title" className="modal-title">
          <IconButton
            onClick={handleClose}
            className="btn-filled-small btn-filled-bg-transparent btn-round"
          >
            <CloseRoundedIcon />
          </IconButton>
          {props.projectname} • New Issue
        </DialogTitle>

        <DialogContent style={{ padding: "5px 10px" }}>
          <NewIssueForm
            project={props.project}
            handleClose={handleClose}
            getIssues={props.getIssues}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
