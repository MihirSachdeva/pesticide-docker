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
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import AlertDialog from "../components/AlertDialog";
import Avatar from "./Avatar";
import CommentReactions from "../components/CommentReactions";
import { getEmoji } from "../constants/emoticons";
import * as snackbarActions from "../store/actions/snackbar";
import "prismjs/themes/prism-tomorrow.css";

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

  const myRxnTypesFn = () => {
    let myRxnTypes = [];

    props.comment &&
      props.comment.reactions &&
      props.comment.reactions.forEach((reactionType) => {
        let index = reactionType.reacters.findIndex(
          (r) => r.id == props.currentUser.id
        );
        if (index > -1) {
          myRxnTypes.push(reactionType.aria_label);
        }
      });

    return myRxnTypes;
  };

  const [myReactionTypes, setMyReactionTypes] = React.useState([]);

  React.useEffect(() => {
    setMyReactionTypes(myRxnTypesFn());
  }, [props.comment, props.comment.reactions]);

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
              {props.comment.commentor_details.display_picture ? (
                <Avatar
                  src={props.comment.commentor_details.display_picture}
                  alt={props.comment.commentor_details.name}
                  className="commentor-img"
                  type="image"
                />
              ) : (
                <Avatar
                  className="commentor-img"
                  name={props.comment.commentor_details.name}
                  type="name"
                ></Avatar>
              )}
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
              ? `1px solid ${commentThemeColors(props.theme).sent}`
              : `1px solid ${commentThemeColors(props.theme).recieved}`,
          }}
        >
          <div className="comment-reactions">
            {props.comment.reactions.map((reaction) => {
              let reactedByMe = Boolean(
                reaction.reacters.find(
                  (reactr) => reactr.id == props.currentUser.id
                )
              );
              return (
                <Tooltip
                  arrow
                  interactive
                  title={
                    <React.Fragment>
                      <List dense={true}>
                        {reaction.reacters.map((reacter) => (
                          <ListItem>
                            <ListItemText primary={reacter.name} />
                          </ListItem>
                        ))}
                      </List>
                    </React.Fragment>
                  }
                >
                  <Button
                    className={
                      reactedByMe
                        ? "comment-reaction btn-filled-xs"
                        : "comment-reaction"
                    }
                    style={
                      reactedByMe
                        ? {
                            border: `1px solid ${
                              commentThemeColors(props.theme).recieved
                            }`,
                          }
                        : null
                    }
                    onClick={() => {
                      reactedByMe
                        ? props.handleReactionDelete(
                            props.comment.id,
                            reaction.aria_label
                          )
                        : props.handleNewReaction(
                            props.comment.id,
                            reaction.aria_label
                          );
                    }}
                  >
                    {getEmoji(reaction.emoticon) + " " + reaction.count}
                  </Button>
                </Tooltip>
              );
            })}
            <Button
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

              {props.emoticons != [] &&
                props.emoticons.map((emoticon, index) => {
                  let reactedByMe = myReactionTypes.includes(
                    emoticon.aria_label
                  );
                  return (
                    <MenuItem
                      onClick={() => {
                        reactedByMe
                          ? props.handleReactionDelete(
                              props.comment.id,
                              emoticon.aria_label
                            )
                          : props.handleNewReaction(
                              props.comment.id,
                              emoticon.aria_label
                            );
                        handleEmoticonButtonClose();
                      }}
                      title={emoticon.aria_label}
                      style={
                        reactedByMe
                          ? {
                              border: "1px solid #80808042",
                              backgroundColor: "#85858524",
                            }
                          : null
                      }
                    >
                      {emoticon.emoji}
                    </MenuItem>
                  );
                })}
            </Menu>
          </div>
          <div
            className="comment-timestamp"
            style={{
              borderLeft: props.isSentByCurrentUser
                ? `1px solid ${commentThemeColors(props.theme).sent}`
                : `1px solid ${commentThemeColors(props.theme).recieved}`,
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
