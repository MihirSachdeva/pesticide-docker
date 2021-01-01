import React from "react";
import {
  MenuItem,
  Typography,
  Button,
  IconButton,
  Menu,
  Tooltip,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import DefaultTooltip from "@material-ui/core/Tooltip";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import CommentIcon from "@material-ui/icons/QuestionAnswerRounded";
import ArrowDownwardRoundedIcon from "@material-ui/icons/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@material-ui/icons/ArrowUpwardRounded";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { connect } from "react-redux";
import { Link, withRouter, Redirect } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import AlertDialog from "../components/AlertDialog";
import UtilityComponent from "../components/UtilityComponent";
import ImageWithModal from "../components/ImageWithModal";
import CommentReactions from "../components/CommentReactions";
import emoticons from "../constants/emoticons";
import HEADER_NAV_TITLES from "../header_nav_titles";
import * as api_links from "../APILinks";
import * as snackbarActions from "../store/actions/snackbar";
import WebSocketInstance from "../websocket";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import axios from "axios";

const CommentBox = (props) => {
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const [alert, setAlert] = React.useState({
    open: false,
  });

  const commentThemeColors = (theme) => {
    switch (theme) {
      case "default":
        return {
          sent: "#008eff4d",
          sentColor: "#008eff1a",
          recieved: "#c5c5c5",
          recievedColor: "#e3e3e3",
          after: "#f0f2f5",
        };
      case "dark":
        return {
          sent: "#3c5aa45e",
          sentColor: "#3c5aa45e",
          recieved: "#3c3c3ca1",
          recievedColor: "#3c3c3ca1",
          after: "#18191a",
        };
      case "palpatine":
        return {
          sent: "#4a1111",
          sentColor: "#4a1111",
          recieved: "#3c3c3ca1",
          recievedColor: "#3c3c3ca1",
          after: "#101010",
        };
      case "solarizedLight":
        return {
          sent: "#183d4957",
          sentColor: "#183d4940",
          recieved: "#ccc7b8a6",
          recievedColor: "#ccc7b8a6",
          after: "#eee8d5",
        };
      case "solarizedDark":
        return {
          sent: "#183d49b8",
          sentColor: "#00000052",
          recieved: "#183d49b8",
          recievedColor: "#183d49b8",
          after: "#092129",
        };
      default:
        return {
          sent: "#008eff4d",
          sentColor: "#008eff1a",
          recieved: "#e3e3e3",
          recievedColor: "#e3e3e3",
          after: "#f0f2f5",
        };
    }
  };

  const monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getDate = (timestamp) => {
    let date;
    if (new Date(timestamp).getMinutes() > 9) {
      date =
        new Date(timestamp).getHours() +
        ":" +
        new Date(timestamp).getMinutes() +
        " • " +
        monthList[new Date(timestamp).getMonth()] +
        " " +
        new Date(timestamp).getDate() +
        ", " +
        new Date(timestamp).getFullYear();
    } else {
      date =
        new Date(timestamp).getHours() +
        ":" +
        "0" +
        new Date(timestamp).getMinutes() +
        " • " +
        monthList[new Date(timestamp).getMonth()] +
        " " +
        new Date(timestamp).getDate() +
        ", " +
        new Date(timestamp).getFullYear();
    }
    return date;
  };

  const openAlert = (action, title, description, cancel, confirm, data) => {
    setAlert({
      open: true,
      title,
      description,
      cancel,
      confirm,
      action,
      data,
    });
  };

  const closeAlert = () => {
    setAlert((prevAlertState) => ({
      open: false,
    }));
  };

  const confirmAlert = (action, choice, data) => {
    switch (action) {
      case "delete_comment":
        choice && props.handleCommentDelete(data);
        break;
    }
  };

  const [anchorEmoticonButtonEl, setAnchorEmoticonButtonEl] = React.useState(
    null
  );

  const handleEmoticonButtonClick = (event) => {
    setAnchorEmoticonButtonEl(event.currentTarget);
  };

  const handleEmoticonButtonClose = () => {
    setAnchorEmoticonButtonEl(null);
  };

  const [anchorMenuEl, setAnchorMenuEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorMenuEl(null);
  };

  return (
    <>
      <div
        className={props.commentClass}
        style={{
          border: props.isSentByCurrentUser
            ? `1px solid ${commentThemeColors(props.theme).sent}`
            : `1px solid ${commentThemeColors(props.theme).recieved}`,
        }}
      >
        {" "}
        <div
          className="comment-header"
          style={{
            backgroundColor: props.isSentByCurrentUser
              ? commentThemeColors(props.theme).sentColor
              : commentThemeColors(props.theme).recievedColor,
          }}
        >
          <div className="comment-sender">
            <div className="comment-sender-image">
              <img
                src={
                  props.comment.commentor_details.display_picture ||
                  "/sunglasses.svg"
                }
                alt="Commentor"
                className="commentor-img"
              />
            </div>
            <Typography className="commentor-name">
              <Link
                to={`/users/${props.comment.commentor_details.enrollment_number}`}
              >
                {!props.isSentByCurrentUser
                  ? props.comment.commentor_details.name
                  : "You"}
              </Link>
              <div className="commentor-role">
                {props.comment.commentor_details.id == props.issue.reporter
                  ? "(reporter)"
                  : props.issue.assigned_to ==
                    props.comment.commentor_details.id
                  ? "(assignee)"
                  : props.projectMembersIdList.includes(
                      props.comment.commentor_details.id
                    )
                  ? "(project member)"
                  : ""}
              </div>
            </Typography>
          </div>
          <div className="comment-box-buttons">
            {props.isSentByCurrentUser && (
              <>
                <IconButton
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleMenuClick}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorMenuEl}
                  keepMounted
                  open={Boolean(anchorMenuEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={() => {
                      openAlert(
                        "delete_comment",
                        "Delete this comment?",
                        "This comment will be deleted permanently.",
                        "Cancel",
                        "Delete",
                        props.comment.id
                      );
                      handleMenuClose();
                    }}
                    className="btn-filled-error"
                    style={{
                      margin: "0 5px",
                    }}
                  >
                    <DeleteOutlineOutlinedIcon color="error" /> Delete
                  </MenuItem>
                </Menu>
              </>
            )}
          </div>
        </div>
        <div
          className="comment-content"
          dangerouslySetInnerHTML={{ __html: props.comment.text }}
        ></div>
        <div
          className="comment-bottom"
          style={{
            borderTop: props.isSentByCurrentUser
              ? `1px solid ${commentThemeColors(props.theme).sentColor}`
              : `1px solid ${commentThemeColors(props.theme).recievedColor}`,
          }}
        >
          <div className="comment-reactions">
            <Tooltip
              arrow
              interactive
              title={
                <React.Fragment>
                  <List dense={true}>
                    <ListItem>
                      <ListItemText primary="Mihir Sachdeva" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Mihir Sachdeva" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Mihir Sachdeva" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Mihir Sachdeva" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Mihir Sachdeva" />
                    </ListItem>
                    <ListItem>
                      <Button onClick={handleModalOpen}>View all</Button>
                    </ListItem>
                  </List>
                </React.Fragment>
              }
            >
              <Button className="comment-reaction">👍 1</Button>
            </Tooltip>
            <Button className="comment-reaction">😄 1</Button>
            <Button className="comment-reaction">👀 1</Button>
            <Button className="comment-reaction">👍 1</Button>
            <Button className="comment-reaction">😄 1</Button>
            <Button className="comment-reaction">👀 1</Button>
            <Button className="comment-reaction">👍 1</Button>
            <Button className="comment-reaction">😄 1</Button>
            <Button className="comment-reaction">👀 1</Button>
            <Button className="comment-reaction">👍 1</Button>
            <Button className="comment-reaction">😄 1</Button>
            <Button className="comment-reaction">👀 1</Button>
            <Button
              // onClick={() => {
              //   openAlert(
              //     "delete_comment",
              //     "Delete this comment?",
              //     "This comment will be deleted permanently.",
              //     "Cancel",
              //     "Delete",
              //     comment.id
              //   );
              // }}
              aria-controls="emoticons-menu"
              aria-haspopup="true"
              onClick={handleEmoticonButtonClick}
              size="small"
              className="btn-filled-xs btn-round btn-no-margin"
            >
              <InsertEmoticonIcon />
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEmoticonButtonEl}
              keepMounted
              open={Boolean(anchorEmoticonButtonEl)}
              onClose={handleEmoticonButtonClose}
              className="emoji-picker-menu"
            >
              <div
                className="menu-list-section-header"
                style={{ width: "100%" }}
              >
                <div className="menu-list-section-title">Comment reaction</div>
                <div className="menu-list-section-divider"></div>
              </div>

              <br />

              {emoticons.map((emoticon, index) => (
                <MenuItem
                  onClick={handleEmoticonButtonClose}
                  title={emoticon.expression}
                >
                  {emoticon.emoji}
                </MenuItem>
              ))}
            </Menu>
          </div>
          <div
            className="comment-timestamp"
            style={{
              borderLeft: props.isSentByCurrentUser
                ? `1px solid ${commentThemeColors(props.theme).sentColor}`
                : `1px solid ${commentThemeColors(props.theme).recievedColor}`,
            }}
          >
            {getDate(props.comment.timestamp)}
          </div>
        </div>
      </div>
      <div className="comment-between"></div>
      <AlertDialog
        open={alert.open}
        action={alert.action}
        title={alert.title || ""}
        description={alert.description || ""}
        cancel={alert.cancel || ""}
        confirm={alert.confirm || ""}
        confirmAlert={confirmAlert}
        data={alert.data || {}}
        closeAlert={closeAlert}
      />
      <CommentReactions open={modalOpen} handleModalClose={handleModalClose} />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.currentUser,
    theme: state.theme.theme,
    darkTheme: ["dark", "solarizedDark", "palpatine"].includes(
      state.theme.theme
    ),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSnackbar: (style, text, duration) =>
      dispatch(snackbarActions.changeSnackbar(true, style, text, duration)),
    closeSnackbar: () => dispatch(snackbarActions.changeSnackbar(false)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CommentBox)
);
