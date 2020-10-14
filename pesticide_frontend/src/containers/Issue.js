import React from "react";
import {
  MenuItem,
  Typography,
  Button,
  Menu,
  useMediaQuery,
  Card,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import DefaultTooltip from "@material-ui/core/Tooltip";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import CommentIcon from "@material-ui/icons/QuestionAnswerRounded";
import ArrowDownwardRoundedIcon from "@material-ui/icons/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@material-ui/icons/ArrowUpwardRounded";
import { connect } from "react-redux";
import { Link, withRouter, Redirect } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import AlertDialog from "../components/AlertDialog";
import UtilityComponent from "../components/UtilityComponent";
import ImageWithModal from "../components/ImageWithModal";
import HEADER_NAV_TITLES from "../header_nav_titles";
import * as api_links from "../APILinks";
import * as snackbarActions from "../store/actions/snackbar";
import WebSocketInstance from "../websocket";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
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
  const [error, setError] = React.useState(null);
  const [numComments, setNumComments] = React.useState(0);

  const scrollFunc = function () {
    var y = document.getElementById("main-main").scrollTop;
    if (y > 300) {
      showHoverButtons(true);
    } else {
      showHoverButtons(false);
    }
  };

  Prism.highlightAll();

  React.useEffect(() => {
    document.getElementById("main-main").addEventListener("scroll", scrollFunc);
    scrollToTop();
    const issueId = props.match.params.issueId;
    const projectSlug = props.match.params.projectslug;
    axios
      .get(api_links.API_ROOT + `issues/${issueId}/`)
      .then((res) => {
        setIssue(res.data);
        setNumComments(res.data.comments.length)
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
      .catch((err) => {
        console.log(err);
        setError("true");
      });

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

  let counter = 0;

  const waitForSocketConnection = (callback) => {
    setTimeout(() => {
      if (WebSocketInstance.state() === 1) {
        // console.log("Connection is secure.");
        callback();
        props.closeSnackbar();
        return;
      } else {
        counter++;
        // console.log(counter);
        // console.log("Waiting for connection...");
        waitForSocketConnection(callback);
        counter == 10 &&
          props.showSnackbar(
            "error",
            "Couldn't fetch comments. Check your connection.",
            600000
          );
      }
    }, 500);
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
          props.showSnackbar("success", "Issue assigned successfully!", 6000);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        let audio = new Audio("../sounds/alert_error-03.wav");
        audio.play();
        props.showSnackbar(
          "error",
          "Couldn't assign issue. Try again later.",
          6000
        );
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
      setNewComment((prev) => ({
        ...prev,
        text: "",
      }));
      setNumComments(prevNumComments => prevNumComments + 1);
      scrollToBottom();
    } else {
      let audio = new Audio("../sounds/alert_error-03.wav");
      audio.play();
    }
  };

  const handleNewComment = (content, editor) => {
    setNewComment((prevNewCommentState) => ({
      ...prevNewCommentState,
      text: content,
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
    setNumComments(prevNumComments => prevNumComments - 1);
    props.showSnackbar("success", "Comment deleted.", 6000);
  };

  const handleIssueDelete = () => {
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
          props.showSnackbar("success", "Issue status updated!", 6000);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        let audio = new Audio("../sounds/alert_error-03.wav");
        audio.play();
        props.showSnackbar(
          "error",
          "Couldn't update issue status. Try again later.",
          6000
        );
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
          sent: "#ccc7b8a6",
          sentColor: "#ccc7b8a6",
          recieved: "#ccc7b8a6",
          recievedColor: "#ccc7b8a6",
          after: "#eee8d5",
        };
      case "solarizedDark":
        return {
          sent: "#183d49b8",
          sentColor: "#183d49b8",
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

  return (
    <>
      <div ref={topRef} style={{ display: "none" }}></div>
      {error && <Redirect to="/404" />}

      <UtilityComponent
        title={HEADER_NAV_TITLES.ISSUE}
        page="ISSUE"
        customRenderScroll
      />
      {issue.reporter_details && (
        <>
          <Card
            className="issue-scroll-header"
            style={{
              display: !hoverButtons && "none",
              top: !isMobile ? "65px" : "57px",
              width: !isMobile ? "calc(100% - 340px)" : "100%",
            }}
          >
            <div className="issue-scroll-left">
              <div className="issue-scroll-status">
                <Button
                  variant="outlined"
                  className="project-issue-status-button"
                  style={{
                    backgroundColor: status && status.color,
                  }}
                >
                  {status && status.text}
                </Button>
              </div>
              <div className="issue-scroll-details">
                <div className="issue-scroll-details-heading">
                  <div className="issue-scroll-title">
                    {issue.title && (
                      issue.title.length < 20
                        ? issue.title
                        : `${issue.title.slice(0, 20)}...`
                    )}
                  </div>
                  <div>•</div>
                  <div className="issue-scroll-project">
                    {isMobile
                      ? issue.project_details.name && (
                        issue.project_details.name.length < 15
                          ? issue.project_details.name
                          : issue.project_details.name.match(/\b([a-zA-Z])/g).join("")
                      )
                      : issue.project_details.name
                    }
                  </div>
                  <div>•</div>
                  <div className="issue-scroll-comments">
                    <CommentIcon
                      style={{ marginRight: "5px", fontSize: "15px" }}
                    />
                    <div>{numComments}</div>
                  </div>
                </div>

                <div className="issue-scroll-meta">
                  <div className="issue-scroll-reporter">
                    {issue.reporter_details.name}
                  </div>
                  <div style={{ margin: "0 4px" }}>added this issue on</div>
                  <div className="issue-scroll-date">
                    {getDate(issue.timestamp)}
                  </div>
                </div>
              </div>
            </div>
            <div className="issue-scroll-right">
              {issue.tags &&
                issue.tags.length != 0 &&
                issue.tags.map((tag) => (
                  <Button
                    className="project-issue-tag issue-button-filled-outline"
                    variant="outlined"
                    style={{
                      borderRadius: "10px",
                      textTransform: "none",
                      marginRight: "5px",
                      fontWeight: "500",
                      marginBottom: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor:
                          tagNameColorList &&
                          tagNameColorList[tag] &&
                          tagNameColorList[tag].tagColor,
                      }}
                      className="tag-color"
                    ></div>
                    <span>
                      {tagNameColorList && tagNameColorList[tag].tagText}
                    </span>
                  </Button>
                ))}
            </div>
          </Card>
          <div className="issue-header">
            <div>
              <Link
                to={"/projects/" + issue.project_details.slug}
                className="issue-reporter-link"
              >
                <Button
                  variant="outlined"
                  className="project-issue-reporter issue-button-filled-bg-transparent"
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
                          : props.theme == "palpatine"
                            ? "/icon/project/appicon_red.svg"
                            : "/icon/project/appicon.svg"
                      }
                      alt="Issue Reporter"
                      style={{ borderRadius: "6px", width: "30px" }}
                    />
                  </div>
                  {isMobile
                    ? issue.project_details.name && (
                      issue.project_details.name.length < 15
                        ? issue.project_details.name
                        : issue.project_details.name.match(/\b([a-zA-Z])/g).join("")
                    )
                    : issue.project_details.name
                  }
                </Button>
              </Link>
              {"• Issue " + issue.id}
            </div>
            {(issue.reporter_details.id == props.currentUser.id ||
              props.currentUser.is_master ||
              projectMembersIdList.includes(props.currentUser.id)) && (
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
                  <DeleteOutlineOutlinedIcon color="error" />{" "}
                  {!isMobile && "Delete"}
                </Button>
              )}
          </div>

          <hr className="divider2" style={{ margin: "0 10px" }} />

          <div className="issue-container">
            <div className="issue-section">
              <div className="issue-heading">{issue.title}</div>
              <div className="issue-detail">
                <div className="issue-meta">
                  <div>
                    <Typography component="span" className="issue-button-label">
                      {"Status: "}
                    </Typography>
                    <Button
                      variant="outlined"
                      className="project-issue-status-button"
                      style={{
                        backgroundColor: status && status.color,
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
                        className="project-issue-reporter issue-button-filled-outline"
                        style={{
                          borderRadius: "100px",
                          textTransform: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <div className="project-issue-reported-by-image">
                          <img
                            src={
                              issue.reporter_details.display_picture
                                ? issue.reporter_details.display_picture
                                : "/sunglasses.svg"
                            }
                            alt="Issue Reporter"
                          />
                        </div>
                        {issue.reporter_details.name}
                      </Button>
                    </Link>
                  </div>
                  <div
                    className="issue-buttons"
                    style={{ alignItems: "flex-start" }}
                  >
                    <Typography component="span" className="issue-button-label">
                      {"Tags: "}
                    </Typography>

                    <div className="project-issue-tags issue-tag-text">
                      {issue.tags && issue.tags.length != 0 ? (
                        issue.tags.map((tag) => (
                          <Button
                            className="project-issue-tag issue-button-filled-outline"
                            variant="outlined"
                            style={{
                              borderRadius: "10px",
                              textTransform: "none",
                              marginRight: "5px",
                              fontWeight: "500",
                              marginBottom: "5px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor:
                                  tagNameColorList &&
                                  tagNameColorList[tag] &&
                                  tagNameColorList[tag].tagColor,
                              }}
                              className="tag-color"
                            ></div>
                            <span>
                              {tagNameColorList &&
                                tagNameColorList[tag].tagText}
                            </span>
                          </Button>
                        ))
                      ) : (
                          <span style={{ marginRight: "10px" }}>None</span>
                        )}
                    </div>
                  </div>

                  <div className="issue-assigned-to">
                    <Typography className="issue-button-label">
                      Assigned to:
                    </Typography>
                    {
                      <>
                        {assignee ? (
                          <Link
                            to={"/users/" + assignee.enrollment_number}
                            style={{ marginRight: "5px" }}
                          >
                            <Button
                              onClick="event.stopPropagation()"
                              variant="outlined"
                              className="project-issue-reporter issue-button-filled-outline"
                              style={{
                                textTransform: "none",
                              }}
                            >
                              <div className="project-issue-reported-by-image">
                                <img
                                  src={
                                    assignee.display_picture ||
                                    "/sunglasses.svg"
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
                                className="project-reporter issue-button-filled-outline"
                                style={{
                                  textTransform: "none",
                                  borderRadius: "10px",
                                  width: "fit-content",
                                  alignSelf: "flex-start",
                                  fontWeight: "500",
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
                                  style={{ marginRight: !isMobile && "4px" }}
                                />
                                {!isMobile && "Change"}
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
                                              "/sunglasses.svg"
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
                                            "/sunglasses.svg"
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
                      </>
                    }
                  </div>

                  <div className="issue-date">
                    <Typography className="issue-button-label">
                      Timestamp:
                    </Typography>

                    {getDate(issue.timestamp)}
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
                top: "140px",
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
                  padding: "10px",
                  marginLeft: "auto",
                  marginBottom: "10px",
                  width: "min-content",
                  border: "1px solid #8787874d",
                }}
                onClick={scrollToTop}
              >
                <ArrowUpwardRoundedIcon fontSize="small" />
              </Button>

              <Button
                style={{
                  textTransform: "none",
                  fontWeight: "600",
                  backdropFilter: "blur(20px)",
                  backgroundColor: props.darkTheme ? "#45454575" : "#cfcfcf6e",
                  borderRadius: "100px",
                  padding: "10px",
                  marginLeft: "auto",
                  width: "min-content",
                  border: "1px solid #8787874d",
                }}
                onClick={scrollToBottom}
              >
                <ArrowDownwardRoundedIcon fontSize="small" />
              </Button>
            </div>

            <div className="comments-header">
              <div>{numComments != 1 ? `${numComments} Comments` : `${numComments} Comment`}</div>
            </div>

            <hr className="divider2" style={{ marginBottom: "0" }} />
            <div className="comment-between"></div>
            <div className="comments-section">
              <div className="comments-container">
                {comments &&
                  comments.map((comment) => {
                    let isSentByCurrentUser =
                      comment.commentor_details.id == props.currentUser.id;
                    let commentClass = isSentByCurrentUser
                      ? "comment comment-sent"
                      : "comment comment-recieved";
                    return (
                      <>
                        <div
                          className={commentClass}
                          style={{
                            border: isSentByCurrentUser
                              ? `1px solid ${
                              commentThemeColors(props.theme).sent
                              }`
                              : `1px solid ${
                              commentThemeColors(props.theme).recieved
                              }`,
                          }}
                        >
                          {" "}
                          <div
                            className="comment-header"
                            style={{
                              backgroundColor: isSentByCurrentUser
                                ? commentThemeColors(props.theme).sentColor
                                : commentThemeColors(props.theme).recievedColor,
                            }}
                          >
                            <div className="comment-sender">
                              <div className="comment-sender-image">
                                <img
                                  src={
                                    comment.commentor_details.display_picture ||
                                    "/sunglasses.svg"
                                  }
                                  alt="Commentor"
                                  className="commentor-img"
                                />
                              </div>
                              <Typography className="commentor-name">
                                <Link
                                  to={`/users/${comment.commentor_details.enrollment_number}`}
                                >
                                  {!isSentByCurrentUser
                                    ? comment.commentor_details.name
                                    : "You"}
                                </Link>
                                <div className="commentor-role">
                                  {comment.commentor_details.id ==
                                    issue.reporter
                                    ? "(reporter)"
                                    : issue.assigned_to ==
                                      comment.commentor_details.id
                                      ? "(assignee)"
                                      : projectMembersIdList.includes(
                                        comment.commentor_details.id
                                      )
                                        ? "(project member)"
                                        : ""}
                                </div>
                              </Typography>
                            </div>
                            {isSentByCurrentUser && (
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
                                  margin: "0",
                                }}
                                className="btn-filled-xs btn-filled-xs-error btn-round btn-no-margin"
                              >
                                <DeleteOutlineOutlinedIcon color="error" />
                              </Button>
                            )}
                          </div>
                          <div
                            className="comment-content"
                            dangerouslySetInnerHTML={{ __html: comment.text }}
                          ></div>
                          <div className="comment-bottom">
                            <div>{getDate(comment.timestamp)}</div>
                          </div>
                        </div>
                        <div className="comment-between"></div>
                      </>
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
                  className="comment-input-form"
                >
                  {!props.darkTheme ? (
                    <Editor
                      value={newComment.text}
                      init={{
                        skin: "material-classic",
                        content_css: "material-classic",
                        placeholder: "Type a comment...",
                        icons: "thin",
                        height: 250,
                        menubar: false,
                        plugins: [
                          "advlist autolink lists link image charmap print preview anchor",
                          "searchreplace visualblocks code fullscreen",
                          "insertdatetime media table code help wordcount table codesample",
                        ],
                        toolbar: [
                          "undo redo | formatselect | bold italic backcolor | codesample \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | table | code | help",
                        ],
                        codesample_global_prismjs: true,
                      }}
                      onEditorChange={handleNewComment}
                    />
                  ) : (
                      <Editor
                        value={newComment.text}
                        init={{
                          skin: "oxide-dark",
                          content_css: "dark",
                          placeholder: "Type a comment...",
                          icons: "thin",
                          height: 250,
                          menubar: false,
                          plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table code help wordcount table codesample",
                          ],
                          toolbar: [
                            "undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | codesample \
                            bullist numlist outdent indent | removeformat | table | code | help",
                          ],
                        }}
                        onEditorChange={handleNewComment}
                      />
                    )}
                  <Tooltip title="Send" placement="bottom">
                    <Button
                      type="submit"
                      onClick={handleCommentSubmit}
                      name="commentSendButton"
                      style={{
                        borderRadius: "4px",
                        height: "38px",
                        margin: "10px",
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Issue));
