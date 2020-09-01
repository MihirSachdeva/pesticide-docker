import React from "react";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import SkeletonIssue from "./SkeletonIssue";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

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
    <Link to={"/issues/" + props.id}>
      <div>
        {props.reporterDetails.name == undefined && <SkeletonIssue />}
        <div
          className="project-issue-details"
          style={{
            ...props.bgClass,
            ...projectDetails,
            textTransform: "none",
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
                  borderRadius: "10px",
                  textTransform: "none",
                  marginRight: "5px",
                  color: status && status.color,
                  fontWeight: "700",
                }}
                className="issue-button-filled"
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
            >
              {!fullScreen
                ? props.title
                : props.title.length < 15
                ? props.title
                : props.title.slice(0, 14) + "..."}
            </Typography>
            {props.showProjectNameOnCard ? (
              <>
                <Typography style={{ margin: "0 5px", fontSize: "27px" }}>
                  •
                </Typography>
                <Typography className="project-issue">
                  {props.projectname}
                </Typography>
              </>
            ) : (
              <>
                <Typography style={{ margin: "0 5px", fontSize: "27px" }}>
                  •
                </Typography>
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
            <div className="project-issue-tags">
              {props.tags.map((tag) => (
                <Button
                  onClick="event.stopPropagation()"
                  className="project-issue-tag issue-button-filled"
                  variant="outlined"
                  style={{
                    borderRadius: "10px",
                    textTransform: "none",
                    marginRight: "5px",
                    color:
                      props.tagNameColorList &&
                      props.tagNameColorList[tag] &&
                      props.tagNameColorList[tag].tagColor,
                    fontWeight: "900",
                    marginBottom: "5px",
                  }}
                >
                  <div>
                    #
                    <span className="issue-tag-text">
                      {props.tagNameColorList &&
                        props.tagNameColorList[tag] &&
                        props.tagNameColorList[tag].tagText}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
            <div className="project-issue-tags">
              {
                <Link to={"/users/" + props.reporterDetails.enrollment_number}>
                  <Button
                    onClick="event.stopPropagation()"
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
                          props.reporterDetails.display_picture
                            ? props.reporterDetails.display_picture
                            : "../sunglasses.svg"
                        }
                        alt="Issue Reporter"
                      />
                    </div>
                    {props.reporterDetails.name != undefined &&
                      props.reporterDetails.name}
                  </Button>
                </Link>
              }
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
        default:
          return { backgroundColor: "ffffff" };
      }
    })(state.theme.theme),
  };
};

export default withRouter(connect(mapStateToProps, null)(IssueItem));
