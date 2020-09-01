import React from "react";
import {
  MenuItem,
  Typography,
  Button,
  Input,
  Menu,
  useMediaQuery,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import DefaultTooltip from "@material-ui/core/Tooltip";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import ArrowDownwardRoundedIcon from "@material-ui/icons/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@material-ui/icons/ArrowUpwardRounded";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import AlertDialog from "../components/AlertDialog";
import UtilityComponent from "../components/UtilityComponent";
import ImageWithModal from "../components/ImageWithModal";
import HEADER_NAV_TITLES from "../header_nav_titles";
import * as api_links from "../APILinks";
import WebSocketInstance from "../websocket";

import axios from "axios";

const Issue = (props) => {
  const Tooltip = withStyles({
    tooltip: {
      backgroundColor: props.darkTheme ? "#353535" : "#ffffff",
      color: props.darkTheme ? "#ffffff" : "#353535",
      backgroundFilter: "blur(20px)",
      fontSize: "17px",
      fontWeight: "900",
      padding: "5px",
      border: "1px solid #808080b3",
      borderRadius: "10px",
    },
  })(DefaultTooltip);

  const [issue, setIssue] = React.useState({});
  const [status, setStatus] = React.useState();
  const [description, setDescription] = React.useState("");
  const [assignee, setAssignee] = React.useState();
  const [projectMembersIdList, setProjectMembersIdList] = React.useState([]);
  const [usersForIssueAssign, setUsersForIssueAssign] = React.useState({
    project_members: [],
    other_users: [],
  });
  const [comments, setComments] = React.useState([]);
  const [newComment, setNewComment] = React.useState({
    text: "",
    issue: issue.id,
  });
  const [alert, setAlert] = React.useState({
    open: false,
  });
  const [statusList, setStatusList] = React.useState([]);
  const [tagList, setTagList] = React.useState([]);
  const [tagNameColorList, setTagNameColorList] = React.useState();
  const commentsEndRef = React.useRef(null);
  const topRef = React.useRef(null);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [hoverButtons, showHoverButtons] = React.useState(false);

  const scrollFunc = function () {
    var y = document.getElementById("main-main").scrollTop;
    if (y > 500) {
      showHoverButtons(true);
    } else {
      showHoverButtons(false);
    }
  };

  React.useEffect(() => {
    document.getElementById("main-main").addEventListener("scroll", scrollFunc);
    scrollToTop();
    const issueId = props.match.params.issueId;
    axios
      .get(api_links.API_ROOT + `issues/${issueId}/`)
      .then((res) => {
        setIssue(res.data);
        fetchUsersListForIssueAssign(res.data.project);
        setNewComment({
          text: "",
          issue: res.data.id,
        });
        setStatus({
          text: res.data.status_text,
          type: res.data.status_type,
          color: res.data.status_color,
          id: res.data.status,
        });
        setAssignee(res.data.assignee_details);
        axios
          .get(api_links.API_ROOT + "issuestatus/")
          .then((res) => {
            setStatusList(
              res.data.map((status) => ({
                text: status.status_text,
                color: status.color,
                type: status.type,
                id: status.id,
              }))
            );
          })
          .catch((err) => console.log(err));
        axios
          .get(api_links.API_ROOT + "tags/")
          .then((res2) => {
            let tagList = res2.data;
            setTagList(tagList);
            let tagNameColorList = {};
            res2.data.map((tag) => {
              tagNameColorList[tag.id] = {
                tagText: tag.tag_text,
                tagColor: tag.color,
              };
            });
            setTagNameColorList(tagNameColorList);
          })
          .catch((err) => console.log(err));
        setDescription(res.data.description);
        WebSocketInstance.connect(res.data.id);
        waitForSocketConnection(() => {
          WebSocketInstance.addCallbacks(
            setEmComments,
            addComment,
            removeComment
          );
          WebSocketInstance.fetchComments(res.data.id);
        });
      })
      .catch((err) => console.log(err));

    setAlert({
      open: false,
    });

    return () => {
      WebSocketInstance.sockRef && WebSocketInstance.disconnect();
      document
        .getElementById("main-main")
        .removeEventListener("scroll", scrollFunc);
    };
  }, [props.match.params.issueId]);

  const waitForSocketConnection = (callback) => {
    setTimeout(() => {
      if (WebSocketInstance.state() === 1) {
        console.log("Connection is secure.");
        callback();
        return;
      } else {
        console.log("Waiting for connection...");
        waitForSocketConnection(callback);
      }
    }, 100);
  };

  async function fetchUsersListForIssueAssign(projectId) {
    axios
      .get(`${api_links.API_ROOT}project_members/${projectId}/`)
      .then((res) => {
        setUsersForIssueAssign({
          project_members: res.data.project_members,
          other_users: res.data.other_users,
        });
        setProjectMembersIdList(
          res.data.project_members.map((member) => member.id)
        );
      })
      .catch((err) => console.log(err));
  }

  const handleIssueAssign = (data) => {
    axios
      .patch(api_links.ASSIGN_ISSUE(issue.id), { assigned_to: data.id })
      .then((res) => {
        let audio = new Audio(
          "../sounds/navigation_selection-complete-celebration.wav"
        );
        audio.play();
        setTimeout(() => {
          setAssignee({
            id: data.id,
            name: data.name,
            display_picture: data.display_picture,
            enrollment_number: data.enrollment_number,
          });
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        let audio = new Audio("../sounds/alert_error-03.wav");
        audio.play();
      });
  };

  const setEmComments = (comments) => {
    setComments(comments);
  };

  const addComment = (comment) => {
    setComments((existingComments) => [...existingComments, comment]);
  };

  const removeComment = (commentId) => {
    setComments((existingComments) =>
      existingComments.filter((comment) => comment.id != commentId)
    );
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (newComment.text != "") {
      const commentObject = {
        ...newComment,
        commentor: props.currentUser.id,
      };
      WebSocketInstance.newChatComment(commentObject);
      WebSocketInstance.fetchComments(issue.id);
      setNewComment((prev) => ({
        ...prev,
        text: "",
      }));
      scrollToBottom();
    } else {
      let audio = new Audio("../sounds/alert_error-03.wav");
      audio.play();
    }
  };

  const handleNewComment = (event) => {
    const text = event.target.value;
    setNewComment((prevNewCommentState) => ({
      ...prevNewCommentState,
      text: text,
    }));
  };

  const scrollToBottom = () => {
    commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    document.getElementById("main-main").scrollTo(0, 0);
  };

  const handleCommentDelete = (commentID) => {
    WebSocketInstance.deleteComment(commentID);
  };

  const handleIssueDelete = () => {
    const token = localStorage.getItem("token");
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    };
    axios
      .delete(api_links.API_ROOT + `issues/${issue.id}/`)
      .then((res) => {
        window.location.href = "/issues";
      })
      .catch((err) => console.log(err));
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
        choice && handleCommentDelete(data);
        break;
      case "delete_issue":
        choice && handleIssueDelete();
        break;
      case "assign_issue":
        choice && handleIssueAssign(data);
        break;
      case "update_issue_status":
        choice && handleIssueStatusUpdate(data);
        break;
    }
  };
  const [anchorElStatus, setAnchorElStatus] = React.useState(null);

  const handleClickStatus = (event) => {
    setAnchorElStatus(event.currentTarget);
  };

  const handleCloseStatus = () => {
    setAnchorElStatus(null);
  };

  const handleIssueStatusUpdate = (data) => {
    axios
      .patch(api_links.UPDATE_ISSUE_STATUS(issue.id), { status: data.id })
      .then((res) => {
        let audio = new Audio(
          "../sounds/navigation_selection-complete-celebration.wav"
        );
        audio.play();
        setTimeout(() => {
          setStatus({
            text: data.text,
            color: data.color,
            type: data.type,
            id: data.id,
          });
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        let audio = new Audio("../sounds/alert_error-03.wav");
        audio.play();
      });
  };

  const [anchorElUsers, setAnchorElUsers] = React.useState(null);

  const handleClickUsers = (event) => {
    setAnchorElUsers(event.currentTarget);
  };

  const handleCloseUsers = () => {
    setAnchorElUsers(null);
  };

  const commentThemeColors = (theme) => {
    switch (theme) {
      case "default":
        return {
          sentColor: "#ffffff",
          recievedColor: "#000000",
          sent: "linear-gradient(to bottom, #00a0ea 0%, #006dea 100%)",
          recieved: "linear-gradient(to bottom, #e3e3e3 0%, #c8c8c8 100%)",
          after: "#f0f2f5",
        };
      case "dark":
        return {
          sentColor: "#ffffff",
          recievedColor: "#ffffff",
          sent: "linear-gradient(to bottom, #00a0ea 0%, #006dea 100%)",
          recieved: "#3c3c3c",
          after: "#18191a",
        };
      case "palpatine":
        return {
          sentColor: "#ffffff",
          recievedColor: "#ffffff",
          sent: "#4a1111",
          recieved: "#272727",
          after: "#101010",
        };
      case "solarizedLight":
        return {
          sentColor: "#ffffff",
          recievedColor: "#000000",
          sent: "linear-gradient(#256377 0%, #234b5a 100%)",
          recieved: "#ccc7b8",
          after: "#eee8d5",
        };
      case "solarizedDark":
        return {
          sentColor: "#0a232c",
          recievedColor: "#ece6d6",
          sent: "linear-gradient(to bottom, #eee8d5 0%, #bcb396 100%)",
          recieved: "#183d49",
          after: "#092129",
        };
      default:
        return {
          sentColor: "#ffffff",
          recievedColor: "#000000",
          sent: "linear-gradient(to bottom, #00a0ea 0%, #006dea 100%)",
          recieved: "linear-gradient(to bottom, #e3e3e3 0%, #c8c8c8 100%)",
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

  return (
    <>
      <div ref={topRef}></div>

      <UtilityComponent
        title={HEADER_NAV_TITLES.ISSUE}
        page="ISSUE"
        customRenderScroll
      />
      {issue.reporter_details && (
        <>
          <div className="issue-header">
            <div>
              <Link
                to={"/projects/" + issue.project_details.slug}
                className="issue-reporter-link"
              >
                <Button
                  variant="outlined"
                  className="project-issue-reporter issue-button-filled"
                  style={{
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                    fontSize: "20px",
                  }}
                >
                  <div className="project-issue-reported-by-image">
                    <img
                      src={
                        issue.project_details.icon
                          ? api_links.ROOT + issue.project_details.icon
                          : "../sunglasses.svg"
                      }
                      alt="Issue Reporter"
                      style={{ borderRadius: "6px", width: "30px" }}
                    />
                  </div>
                  &nbsp;
                  {issue.project_details.name}
                </Button>
                &nbsp;&nbsp;
              </Link>

              {"Issue " + issue.id}
            </div>
            {(issue.reporter_details.id == props.currentUser.id ||
              props.currentUser.is_master ||
              projectMembersIdList.includes(props.currentUser.id)) && (
              <div>
                <Button
                  className="btn-filled btn-filled-error btn-no-margin btn-round"
                  onClick={() => {
                    openAlert(
                      "delete_issue",
                      "Delete this Issue?",
                      "This issue, and all it's comments will be deleted permanently.",
                      "Cancel",
                      "Delete",
                      issue.id
                    );
                  }}
                  size="small"
                >
                  <DeleteOutlineOutlinedIcon color="error" />
                </Button>
              </div>
            )}
          </div>

          <div className="issue-container">
            <div className="issue-section">
              <div className="issue-heading">{issue.title}</div>
              <div className="issue-detail">
                <div className="issue-meta">
                  <div>
                    <Typography component="span" className="issue-button-label">
                      Status:{" "}
                    </Typography>
                    <Button
                      variant="outlined"
                      className="project-reporter issue-button-filled"
                      style={{
                        borderRadius: "10px",
                        textTransform: "none",
                        width: "fit-content",
                        alignSelf: "flex-start",
                        color: status && status.color,
                        fontWeight: "700",
                      }}
                      onClick={
                        (issue.reporter_details.id == props.currentUser.id ||
                          props.currentUser.is_master ||
                          projectMembersIdList.includes(
                            props.currentUser.id
                          )) &&
                        handleClickStatus
                      }
                    >
                      {status && status.text}
                    </Button>
                    <Menu
                      anchorEl={anchorElStatus}
                      keepMounted
                      open={Boolean(anchorElStatus)}
                      onClose={handleCloseStatus}
                      style={{ marginTop: "50px" }}
                    >
                      <div className="menu-list-section-header">
                        <div className="menu-list-section-title">
                          Select status
                        </div>
                        <div className="menu-list-section-divider"></div>
                      </div>

                      {statusList.map((statusItem) => (
                        <MenuItem
                          onClick={() => {
                            handleCloseStatus();
                            statusItem.id != status.id &&
                              openAlert(
                                "update_issue_status",
                                `Update issue's status to ${statusItem.text}?`,
                                "All the project members will get an email notification for the same",
                                "Cancel",
                                "Update",
                                {
                                  text: statusItem.text,
                                  type: statusItem.type,
                                  color: statusItem.color,
                                  id: statusItem.id,
                                }
                              );
                          }}
                        >
                          <div
                            style={{
                              color: statusItem.color,
                              fontWeight: "700",
                            }}
                          >
                            {statusItem.text}
                          </div>
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>
                  <div className="issue-buttons">
                    <Typography component="span" className="issue-button-label">
                      Reported by:{" "}
                    </Typography>

                    <Link
                      to={"/users/" + issue.reporter_details.enrollment_number}
                      className="issue-reporter-link"
                    >
                      <Button
                        variant="outlined"
                        className="project-issue-reporter issue-button-filled"
                        style={{
                          borderRadius: "10px",
                          textTransform: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <div className="project-issue-reported-by-image">
                          <img
                            src={
                              issue.reporter_details.display_picture
                                ? issue.reporter_details.display_picture
                                : "../sunglasses.svg"
                            }
                            alt="Issue Reporter"
                          />
                        </div>
                        &nbsp;
                        {issue.reporter_details.name}
                      </Button>
                      &nbsp;&nbsp;
                    </Link>
                  </div>
                  <div
                    className="issue-buttons"
                    style={{ alignItems: "flex-start" }}
                  >
                    <Typography
                      component="span"
                      className="issue-button-label"
                      style={{ marginTop: "5px" }}
                    >
                      Tags:{" "}
                    </Typography>

                    <div className="project-issue-tags issue-tag-text">
                      {issue.tags != [] ? (
                        issue.tags.map((tag) => (
                          <Button
                            className="project-issue-tag issue-button-filled"
                            variant="outlined"
                            style={{
                              borderRadius: "10px",
                              textTransform: "none",
                              marginRight: "5px",
                              color:
                                tagNameColorList &&
                                tagNameColorList[tag].tagColor,
                              fontWeight: "900",
                              marginBottom: "5px",
                            }}
                          >
                            <div>
                              #
                              {tagNameColorList &&
                                tagNameColorList[tag].tagText}
                            </div>
                          </Button>
                        ))
                      ) : (
                        <span style={{ marginRight: "10px" }}>None</span>
                      )}
                    </div>
                  </div>

                  <div className="issue-assigned-to">
                    <Typography
                      className="issue-button-label"
                      style={{
                        marginBottom: "5px",
                      }}
                    >
                      Assigned to:
                    </Typography>
                    {
                      <div className="project-issue-tags issue-tag-text">
                        {assignee ? (
                          <Link to={"/users/" + assignee.enrollment_number}>
                            <Button
                              onClick="event.stopPropagation()"
                              variant="outlined"
                              className="project-issue-reporter issue-button-filled"
                              style={{
                                borderRadius: "10px",
                                textTransform: "none",
                                marginBottom: "5px",
                              }}
                            >
                              <div className="project-issue-reported-by-image">
                                <img
                                  src={
                                    assignee.display_picture ||
                                    "../sunglasses.svg"
                                  }
                                  alt="Issue Reporter"
                                />
                              </div>
                              &nbsp;
                              {assignee.name}
                            </Button>
                          </Link>
                        ) : (
                          <span style={{ marginRight: "10px" }}>None</span>
                        )}
                        {(issue.reporter_details.id == props.currentUser.id ||
                          props.currentUser.is_master ||
                          projectMembersIdList.includes(
                            props.currentUser.id
                          )) && (
                          <>
                            <Button
                              variant="outlined"
                              className="project-reporter issue-button-filled"
                              style={{
                                textTransform: "none",
                                borderRadius: "10px",
                                width: "fit-content",
                                alignSelf: "flex-start",
                                fontWeight: "700",
                                marginBottom: "5px",
                              }}
                              onClick={
                                (issue.reporter_details.id ==
                                  props.currentUser.id ||
                                  props.currentUser.is_master ||
                                  projectMembersIdList.includes(
                                    props.currentUser.id
                                  )) &&
                                handleClickUsers
                              }
                            >
                              <AssignmentIndIcon
                                fontSize="small"
                                style={{ marginRight: "5px" }}
                              />
                              Change
                            </Button>
                            <Menu
                              anchorEl={anchorElUsers}
                              keepMounted
                              open={Boolean(anchorElUsers)}
                              onClose={handleCloseUsers}
                              style={{ marginTop: "50px" }}
                            >
                              <div className="menu-list-section-header">
                                <div className="menu-list-section-title">
                                  Project members
                                </div>
                                <div className="menu-list-section-divider"></div>
                              </div>
                              {usersForIssueAssign.project_members.map(
                                (user) => (
                                  <MenuItem
                                    onClick={() => {
                                      handleCloseUsers();
                                      !(assignee && user.id == assignee.id) &&
                                        openAlert(
                                          "assign_issue",
                                          `Assign this issue to ${user.name}?`,
                                          `${user.name} will get an email notification for the same.`,
                                          "Cancel",
                                          "Assign",
                                          {
                                            id: user.id,
                                            name: user.name,
                                            display_picture:
                                              user.display_picture,
                                            enrollment_number:
                                              user.enrollment_number,
                                          }
                                        );
                                    }}
                                  >
                                    <div style={{ display: "flex" }}>
                                      <div className="project-issue-reported-by-image">
                                        <img
                                          src={
                                            user.display_picture ||
                                            "../sunglasses.svg"
                                          }
                                          alt={user.name}
                                        />
                                      </div>
                                      <Typography
                                        style={{ marginLeft: "10px" }}
                                      >
                                        {user.name}
                                      </Typography>
                                    </div>
                                  </MenuItem>
                                )
                              )}
                              <div className="menu-list-section-header">
                                <div className="menu-list-section-title">
                                  Other users
                                </div>
                                <div className="menu-list-section-divider"></div>
                              </div>
                              {usersForIssueAssign.other_users.map((user) => (
                                <MenuItem
                                  onClick={() => {
                                    handleCloseUsers();
                                    !(assignee && user.id == assignee.id) &&
                                      openAlert(
                                        "assign_issue",
                                        `Assign this issue to ${user.name}?`,
                                        `${user.name} will get an email notification for the same`,
                                        "Cancel",
                                        "Assign",
                                        {
                                          id: user.id,
                                          name: user.name,
                                          display_picture: user.display_picture,
                                          enrollment_number:
                                            user.enrollment_number,
                                        }
                                      );
                                  }}
                                >
                                  <div style={{ display: "flex" }}>
                                    <div className="project-issue-reported-by-image">
                                      <img
                                        src={
                                          user.display_picture ||
                                          "../sunglasses.svg"
                                        }
                                        alt={user.name}
                                      />
                                    </div>
                                    &nbsp;
                                    <Typography style={{ marginLeft: "10px" }}>
                                      {user.name}
                                    </Typography>
                                  </div>
                                </MenuItem>
                              ))}
                            </Menu>
                          </>
                        )}
                      </div>
                    }
                  </div>

                  <div className="issue-date">
                    <Typography className="issue-button-label">
                      Date:
                    </Typography>

                    {monthList[new Date(issue.timestamp).getMonth()] +
                      " " +
                      new Date(issue.timestamp).getDate() +
                      ", " +
                      new Date(issue.timestamp).getFullYear()}
                  </div>
                </div>

                <div className="issue-content">
                  <div
                    dangerouslySetInnerHTML={{ __html: description }}
                    className="issue-description"
                  />
                </div>

                <div className="issue-images-container">
                  <div className="issue-image">
                    {issue.image[0] && (
                      <ImageWithModal src={issue.image[0].image} alt="Issue" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                top: "75px",
                right: "10px",
                display: "flex",
                flexDirection: "column",
                height: "100px",
                zIndex: "100",
                display: hoverButtons ? "flex" : "none",
              }}
            >
              <Button
                style={{
                  textTransform: "none",
                  fontWeight: "600",
                  backdropFilter: "blur(20px)",
                  backgroundColor: props.darkTheme ? "#45454575" : "#cfcfcf6e",
                  borderRadius: "100px",
                  padding: "7px 10px",
                  marginLeft: "auto",
                  marginBottom: "10px",
                  width: "min-content",
                  border: "1px solid #8787874d",
                }}
                onClick={scrollToTop}
              >
                {"Top "}
                <ArrowUpwardRoundedIcon fontSize="small" />
              </Button>

              <Button
                style={{
                  textTransform: "none",
                  fontWeight: "600",
                  backdropFilter: "blur(20px)",
                  backgroundColor: props.darkTheme ? "#45454575" : "#cfcfcf6e",
                  borderRadius: "100px",
                  padding: "7px 10px",
                  marginLeft: "auto",
                  width: "min-content",
                  border: "1px solid #8787874d",
                }}
                onClick={scrollToBottom}
              >
                {"Bottom "}
                <ArrowDownwardRoundedIcon fontSize="small" />
              </Button>
            </div>

            <hr className="divider2" />
            <div className="comments-section">
              <div className="comments-header">
                <div>Comments</div>
              </div>
              <div className="comments-container">
                {comments &&
                  comments.map((comment) => {
                    let date;
                    if (new Date(comment.timestamp).getMinutes() > 9) {
                      date =
                        new Date(comment.timestamp).getHours() +
                        ":" +
                        new Date(comment.timestamp).getMinutes() +
                        " • " +
                        monthList[new Date(comment.timestamp).getMonth()] +
                        " " +
                        new Date(comment.timestamp).getDate() +
                        ", " +
                        new Date(comment.timestamp).getFullYear();
                    } else {
                      date =
                        new Date(comment.timestamp).getHours() +
                        ":" +
                        "0" +
                        new Date(comment.timestamp).getMinutes() +
                        " • " +
                        monthList[new Date(comment.timestamp).getMonth()] +
                        " " +
                        new Date(comment.timestamp).getDate() +
                        ", " +
                        new Date(comment.timestamp).getFullYear();
                    }
                    let isSentByCurrentUser =
                      comment.commentor_details.id == props.currentUser.id;
                    let commentClass = isSentByCurrentUser
                      ? "comment comment-sent"
                      : "comment comment-recieved";
                    let commentAfterClass = isSentByCurrentUser
                      ? "comment comment-sent-after"
                      : "comment comment-recieved-after";
                    return (
                      <div
                        className={commentClass}
                        style={{
                          background: isSentByCurrentUser
                            ? commentThemeColors(props.theme).sent
                            : commentThemeColors(props.theme).recieved,
                          color: isSentByCurrentUser
                            ? commentThemeColors(props.theme).sentColor
                            : commentThemeColors(props.theme).recievedColor,
                          maxWidth: isMobile ? "80vw" : "40vw",
                        }}
                      >
                        <div className="comment-sender">
                          <div className="comment-sender-image">
                            <img
                              src={
                                comment.commentor_details.display_picture ||
                                "../sunglasses.svg"
                              }
                              alt="Commentor"
                              className="commentor-img"
                            />
                          </div>
                          <Link
                            to={`/users/${comment.commentor_details.enrollment_number}`}
                          >
                            <Typography className="commentor-name">
                              {comment.commentor_details.name}
                            </Typography>
                          </Link>
                        </div>
                        <div className="comment-content">{comment.text}</div>
                        <div className="comment-bottom">
                          {isSentByCurrentUser ? (
                            <div>
                              <Button
                                onClick={() => {
                                  openAlert(
                                    "delete_comment",
                                    "Delete this comment?",
                                    "This comment will be deleted permanently.",
                                    "Cancel",
                                    "Delete",
                                    comment.id
                                  );
                                }}
                                size="small"
                                style={{
                                  marginLeft: "5px",
                                }}
                                className="btn-filled-xs btn-filled-xs-error btn-round"
                              >
                                <DeleteOutlineOutlinedIcon color="error" />
                              </Button>
                            </div>
                          ) : (
                            <div></div>
                          )}
                          <div>{date}</div>
                          <div
                            className={commentAfterClass}
                            style={{
                              background: commentThemeColors(props.theme).after,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}

                <div ref={commentsEndRef}></div>
              </div>

              <div
                className="comment-write-form"
                style={{ textAlign: "center" }}
              >
                <form
                  onSubmit={handleCommentSubmit}
                  autoComplete="off"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Input
                    type="text"
                    value={newComment.text}
                    name="text"
                    onChange={handleNewComment}
                    placeholder="Type a comment..."
                    className="comment-send-input"
                  ></Input>
                  <Tooltip title="Send" placement="bottom">
                    <Button
                      type="submit"
                      onClick={handleCommentSubmit}
                      name="commentSendButton"
                      style={{
                        borderRadius: "4px",
                        height: "38px",
                        marginLeft: "20px",
                      }}
                    >
                      <SendRoundedIcon style={{ fontSize: "30px" }} />
                    </Button>
                  </Tooltip>
                </form>
              </div>
            </div>
          </div>

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
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    currentUser: state.auth.currentUser,
    theme: state.theme.theme,
    darkTheme: ["dark", "solarizedDark", "palpatine"].includes(
      state.theme.theme
    ),
  };
};

export default withRouter(connect(mapStateToProps, null)(Issue));
