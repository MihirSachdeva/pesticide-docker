import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as snackbarActions from "../store/actions/snackbar";

const CustomSnackbar = (props) => {
  const handleClose = (event, reason) => {
    reason !== "clickaway" && props.hideSnackbar();
  };

  return (
    <div>
      <Snackbar
        className="snackbar"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={props.open}
        autoHideDuration={props.duration}
        onClose={handleClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert onClose={handleClose} severity={props.style || "info"}>
          {props.text}
        </Alert>
      </Snackbar>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    open: state.snackbar.open,
    style: state.snackbar.style || "info",
    text: state.snackbar.text || "",
    duration: state.snackbar.duration || 60000,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideSnackbar: () => dispatch(snackbarActions.changeSnackbar(false)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CustomSnackbar)
);
