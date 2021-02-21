import React from "react";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Typography } from "@material-ui/core";
import CommentIcon from "@material-ui/icons/QuestionAnswerRounded";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import SkeletonIssue from "./SkeletonIssue";
import Avatar from "./Avatar";

const projectDetailsLeftRight = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};

const IssueItem = (props) => {
  const fullScreen = useMediaQuery("(max-width: 900px)");
  const isMobile = useMediaQuery("(max-width: 700px)");

  const projectDetails = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: isMobile ? "flex-start" : "space-between",
  };

  const [status, setStatus] = React.useState();

  React.useEffect(() => {
    setStatus({
      text: props.statusText,
      type: props.statusType,
      color: props.statusColor,
      id: props.statusId,
    });
  }, [props.id]);

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
    <Link
      to={
        props.projectSlug
          ? `/projects/${props.projectSlug}/issues/${props.id}`
          : `/issues/${props.id}`
      }
    >
      <div>
        {props.reporterDetails.name == undefined && <SkeletonIssue />}
        <div
          className="project-issue-details"
          style={{
            ...props.bgClass,
            ...projectDetails,
            textTransform: "none",
            overflow: "auto",
            margin: isMobile ? "0 2px" : "0 5px",
          }}
        >
          <div
            className="project-issue-details-left"
            style={projectDetailsLeftRight}
          >
            <div
              className="project-issue-status"
              onClick="event.stopPropagation()"
            >
              <Button
                variant="outlined"
                style={{
                  backgroundColor: status && status.color,
                }}
                className="project-issue-status-button"
              >
                {status &&
                  (!fullScreen
                    ? status.text
                    : status.text.length < 9
                    ? status.text
                    : status.text.slice(0, 8) + "...")}
              </Button>
            </div>
            <Typography
              className="project-issue"
              style={{ whiteSpace: "nowrap", fontWeight: "600" }}
              title={props.title}
            >
              {!fullScreen
                ? props.title.length < 80
                  ? props.title
                  : props.title.slice(0, 80) + "..."
                : props.title.length < 15
                ? props.title
                : props.title.slice(0, 14) + "..."}
            </Typography>
            {props.showProjectNameOnCard ? (
              <>
                <Typography style={{ margin: "0 5px" }}>•</Typography>
                <Typography className="project-issue">
                  {props.projectname &&
                    (props.projectname.length < 15
                      ? props.projectname
                      : props.projectname.match(/\b([a-zA-Z])/g).join(""))}
                </Typography>
              </>
            ) : (
              <>
                <Typography style={{ margin: "0 5px" }}>•</Typography>
                <Typography
                  className="project-issue-date"
                  style={{ fontSize: "15px", whiteSpace: "nowrap" }}
                >
                  {monthList[new Date(props.date).getMonth()] +
                    " " +
                    new Date(props.date).getDate()}
                </Typography>
              </>
            )}
          </div>
          {isMobile && <br />}
          <div
            className="project-issue-details-right"
            style={!isMobile ? projectDetailsLeftRight : null}
          >
            <div
              className="project-issue-tags"
              style={{ justifyContent: !isMobile && "flex-end" }}
            >
              {props.tags.map((tag) => (
                <Button
                  onClick="event.stopPropagation()"
                  className="project-issue-tag issue-button-filled-outline"
                  style={{
                    borderRadius: "10px",
                    textTransform: "none",
                    margin: "2px 5px 2px 0",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor:
                        props.tagNameColorList &&
                        props.tagNameColorList[tag] &&
                        props.tagNameColorList[tag].tagColor,
                    }}
                    className="tag-color"
                  ></div>
                  <span className="issue-tag-text">
                    {props.tagNameColorList &&
                      props.tagNameColorList[tag] &&
                      props.tagNameColorList[tag].tagText}
                  </span>
                </Button>
              ))}
            </div>
            <div
              className="project-issue-tags"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Link to={"/users/" + props.reporterDetails.enrollment_number}>
                <Button
                  onClick="event.stopPropagation()"
                  variant="outlined"
                  className="project-issue-reporter issue-button-filled-outline"
                  style={{
                    borderRadius: "10px",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    marginTop: isMobile && "5px",
                  }}
                >
                  {props.reporterDetails.display_picture ? (
                    <Avatar
                      src={props.reporterDetails.display_picture}
                      className="project-issue-reported-by-image"
                      type="image"
                      alt={props.reporterDetails.name}
                    />
                  ) : (
                    <Avatar
                      className="project-issue-reported-by-image"
                      name={props.reporterDetails.name}
                      type="name"
                    ></Avatar>
                  )}
                  {props.reporterDetails.name != undefined &&
                    props.reporterDetails.name}
                </Button>
              </Link>
            </div>
            <div
              className="issue-item-comments"
              style={{ margin: isMobile ? "10px 5px 0" : "0 6px" }}
            >
              <CommentIcon style={{ marginRight: "5px" }} />
              <div>{props.commentsLength}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const mapStateToProps = (state) => {
  return {
    bgClass: ((theme) => {
      switch (theme) {
        case "default":
          return { backgroundColor: "#ffffff" };
        case "dark":
          return { backgroundColor: "#1f2022" };
        case "solarizedLight":
          return { backgroundColor: "#f8f2db" };
        case "solarizedDark":
          return { backgroundColor: "#0d2832" };
        case "palpatine":
          return { backgroundColor: "#171717" };
        case "dracula":
          return { backgroundColor: "#242630" };
        default:
          return { backgroundColor: "ffffff" };
      }
    })(state.theme.theme),
  };
};

export default withRouter(connect(mapStateToProps, null)(IssueItem));
