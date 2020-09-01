import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import Slide from "@material-ui/core/Slide";
import Grow from "@material-ui/core/Grow";
import EditRoundedIcon from "@material-ui/icons/EditRounded";

import EditProjectForm from "./EditProjectForm";

const isMobile = window.innerWidth < 850;

const projectDetails = {
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  justifyContent: isMobile ? "flex-start" : "space-between",
  minWidth: "500px",
};

const projectDetailsLeftRight = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};

const issueContainer = {
  display: "flex",
  flexDirection: "column",
};

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

const statusList = ["❌ Closed", "🔵 Open", "✔️ Fixed"];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditProjectWithModal(props) {
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

  const newProjectBtnStyle = {
    margin: "10px",
    border: "1.5px dashed #6e6e6eb5",
    width: "auto",
    borderRadius: "10px",
  };

  return (
    <div>
      {props.large ? (
        <Button onClick={handleClickOpen} className="btn-filled">
          <EditRoundedIcon style={{ marginRight: "7px" }} />
          Edit
        </Button>
      ) : (
        <Button onClick={handleClickOpen} className="btn-filled-small">
          <EditRoundedIcon />
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
        maxWidth="xl"
      >
        <DialogTitle id="responsive-dialog-title" className="modal-title">
          <Button
            className="btn-filled-small btn-filled-bg-transparent btn-round"
            onClick={handleClose}
          >
            <CloseRoundedIcon />
          </Button>
          Edit Project • {props.projectName}
        </DialogTitle>

        <DialogContent style={{ padding: "5px 10px" }}>
          <EditProjectForm projectID={props.projectID} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
