import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grow from "@material-ui/core/Grow";

export default function AlertDialog(props) {
  const handleClose = (choice = false) => {
    props.confirmAlert(props.action, choice, props.data);
    props.closeAlert();
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => {
          handleClose(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="alert-dialog"
        TransitionComponent={Grow}
        transitionDuration={{
          enter: 50,
          exit: 50,
        }}
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.description}
          </DialogContentText>
        </DialogContent>
        <hr className="divider2 divider-thin" />
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false);
            }}
            color="secondary"
            className="alert-action-button"
          >
            {props.cancel}
          </Button>
          <div className="divider-vertical"></div>
          <Button
            onClick={() => {
              handleClose(true);
            }}
            color="secondary"
            className="alert-action-button"
          >
            {props.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
