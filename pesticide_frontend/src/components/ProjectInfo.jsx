import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Skeleton from "@material-ui/lab/Skeleton";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import DefaultTooltip from "@material-ui/core/Tooltip";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import EditProjectWithModal from "./EditProjectWithModal";
import ProjectLogo from "./ProjectLogo";
import * as api_links from "../APILinks";
import MemberButton from "./MemberButton";

const RedTooltip = withStyles({
  tooltip: {
    backgroundColor: "#e40000c0",
    color: "#ffffff",
    fontSize: "15px",
    padding: "5px",
    border: "1px solid #808080",
    borderRadius: "7px",
  },
})(DefaultTooltip);

const BlueTooltip = withStyles({
  tooltip: {
    backgroundColor: "#196df5c0",
    color: "#ffffff",
    fontSize: "15px",
    padding: "5px",
    border: "1px solid #808080",
    borderRadius: "7px",
  },
})(DefaultTooltip);

const GreenTooltip = withStyles({
  tooltip: {
    backgroundColor: "#00b81fc0",
    color: "#ffffff",
    fontSize: "15px",
    padding: "5px",
    border: "1px solid #808080",
    borderRadius: "7px",
  },
})(DefaultTooltip);

const useStyles = makeStyles((theme) => ({
  root: {},
  media: {
    height: 0,
    paddingTop: "56.25%",
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}));

const ProjectInfo = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [wiki, setWiki] = React.useState("");
  const [project, setProject] = React.useState({});
  const [projectIssueStatus, setProjectIssueStatus] = React.useState();
  const [projecticon, setProjecticon] = React.useState();
  const [currentUserIsMember, setCurrentUserIsMember] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const memberCardContainer = {
    display: "flex",
    flexDirection: "row",
    padding: "17px",
    alignItems: "center",
    overflowY: "auto",
    flexFlow: !isMobile ? "wrap" : "row",
  };

  function fetchCurrentUserAndProjectInfo() {
    var current_user_id;
    axios
      .get(`${api_links.API_ROOT}current_user/`)
      .then((res) => {
        setCurrentUser(res.data[0]);
        current_user_id = res.data[0].id;
        fetchProjectData(current_user_id);
      })
      .catch((err) => console.log(err));
  }

  function fetchProjectData(currentUserId) {
    axios
      .get(api_links.API_ROOT + `projects/${props.projectID}/`)
      .then((res) => {
        setProject(res.data);
        setCurrentUserIsMember(() => {
          return res.data.members.includes(currentUserId);
        });
        setProjecticon(res.data.icon ? api_links.ROOT + res.data.icon : null);
        setWiki(res.data.wiki);
      })
      .catch((err) => console.log(err));
  }

  function fetchProjectIssueStatusTally() {
    axios
      .get(api_links.API_ROOT + `project_issue_status/${props.projectID}/`)
      .then((res) => {
        let resolved = 0,
          pending = 0,
          closed = 0;
        res.data.issue_status_list.forEach((status) => {
          switch (status.type) {
            case "Pending":
              pending += status.number_of_issues;
              break;
            case "Resolved":
              resolved += status.number_of_issues;
              break;
            case "Closed":
              closed += status.number_of_issues;
              break;
          }
          let total = pending + resolved + closed;
          let issuesData = {
            total: total,
            pending: (100 * pending) / total,
            resolved: (100 * resolved) / total,
            closed: (100 * closed) / total,
          };
          setProjectIssueStatus(issuesData);
        });
      })
      .catch((err) => console.log(err));
  }

  Prism.highlightAll();

  React.useEffect(() => {
    fetchCurrentUserAndProjectInfo();
    fetchProjectIssueStatusTally();
  }, [props.projectID]);

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
    <Card className="project-info-card">
      <div className={!isMobile ? "project-info-large-container" : ""}>
        <div
          style={{
            margin: "10px",
            width: !isMobile ? "100%" : "unset",
            borderRadius: "10px",
          }}
        >
          <CardHeader
            avatar={
              <div>
                {/* {projecticon ? (
                  <Link to={"/projects/" + props.projectslug}>
                    <div
                      style={{
                        width: isMobile ? "90px" : "120px",
                        height: isMobile ? "90px" : "120px",
                        borderRadius: "20px",
                        padding: "4px",
                        backgroundImage: `url(${projecticon})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                      className="image-shadow"
                    ></div>
                  </Link>
                ) : (
                  <Skeleton
                    width={132}
                    height={200}
                    animation="wave"
                    style={{
                      borderRadius: "20%",
                    }}
                  />
                )} */}
                <Link to={"/projects/" + props.projectslug}>
                  {projecticon ? (
                    <div
                      style={{
                        width: isMobile ? "90px" : "120px",
                        height: isMobile ? "90px" : "120px",
                        borderRadius: "20px",
                        padding: "4px",
                        backgroundImage: `url(${projecticon})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                      className="image-shadow"
                    ></div>
                  ) : (
                    <ProjectLogo
                      name={project.name}
                      style={{
                        width: isMobile ? "90px" : "120px",
                        height: isMobile ? "90px" : "120px",
                        borderRadius: "20px",
                        padding: "4px",
                      }}
                      className="image-shadow"
                    />
                  )}
                </Link>
              </div>
            }
            title={
              !isMobile ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: 25, fontWeight: "600" }}>
                      {!project.name ? (
                        <Skeleton width={100} height={50} animation="wave" />
                      ) : (
                        <>
                          <Link to={"/projects/" + props.projectslug}>
                            {project.name}
                          </Link>
                          &nbsp;&nbsp;
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div style={{ fontSize: 25, fontWeight: "600" }}>
                    {!project.name ? (
                      <Skeleton width={100} height={50} animation="wave" />
                    ) : (
                      <Link to={"/projects/" + props.projectslug}>
                        {project.name}
                      </Link>
                    )}
                  </div>
                </div>
              )
            }
            subheader={
              !project.timestamp ? (
                <Skeleton width={180} animation="wave" />
              ) : (
                <div style={{ fontWeight: "400" }}>
                  {monthList[new Date(project.timestamp).getMonth()] +
                    " " +
                    new Date(project.timestamp).getDate() +
                    ", " +
                    new Date(project.timestamp).getFullYear()}
                  <br />
                  <span style={{ fontWeight: "500" }}>{project.status}</span>
                </div>
              )
            }
          />
          {isMobile && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {project.link && (
                <a href={project.link} target="_blank">
                  <Button className="btn-filled-small">
                    <OpenInNewIcon />
                  </Button>
                </a>
              )}
              <Button
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                className="btn-filled-small"
              >
                {
                  <ExpandMoreIcon
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                  />
                }
              </Button>
              {project.members && (
                <div>
                  {(currentUserIsMember ||
                    project.creator == currentUser.id ||
                    currentUser.is_master) && (
                    <div style={{ display: "flex" }}>
                      <EditProjectWithModal
                        projectID={props.projectID}
                        projectName={project.name}
                        fetchData={fetchProjectData}
                      />
                      <Button
                        className="btn-filled-small btn-filled-small-error"
                        onClick={() => {
                          props.openAlert(
                            "delete_project",
                            "Delete project " + project.name + "?",
                            "This project, its issues their comments will be deleted permanently.",
                            "Cancel",
                            "Delete",
                            props.projectID
                          );
                        }}
                      >
                        <DeleteOutlineOutlinedIcon color="error" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div style={memberCardContainer}>
            {!project.id ? (
              <>
                <Skeleton
                  height={70}
                  width={200}
                  animation="wave"
                  style={{ marginRight: "10px" }}
                />
                <Skeleton
                  height={70}
                  width={200}
                  animation="wave"
                  style={{ marginRight: "10px" }}
                />
                <Skeleton
                  height={70}
                  width={200}
                  animation="wave"
                  style={{ marginRight: "10px" }}
                />
              </>
            ) : (
              project.members.map((member) => <MemberButton user={member} />)
            )}
          </div>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <div className="issue-content">
                <div
                  dangerouslySetInnerHTML={{ __html: wiki }}
                  className="issue-description"
                />{" "}
              </div>
            </CardContent>
          </Collapse>
        </div>
        {!isMobile && (
          <Card className="project-info-large-actions" variant="outlined">
            {project.link && (
              <a href={project.link} target="_blank">
                <Button className="btn-filled">
                  <OpenInNewIcon style={{ marginRight: "7px" }} />
                  Checkout App
                </Button>
              </a>
            )}
            <Button
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              className="btn-filled"
            >
              <ExpandMoreIcon
                style={{ marginRight: "4px" }}
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
              />
              Details
            </Button>
            <div>
              {(currentUserIsMember ||
                project.creator == currentUser.id ||
                currentUser.is_master) && (
                <div>
                  <EditProjectWithModal
                    projectID={props.projectID}
                    projectName={project.name}
                    large
                    fetchData={fetchProjectData}
                  />

                  <Button
                    className="btn-filled btn-filled-error"
                    onClick={() => {
                      props.openAlert(
                        "delete_project",
                        "Delete project " + project.name + "?",
                        "This project, its issues and their comments will be deleted permanently.",
                        "Cancel",
                        "Delete",
                        props.projectID
                      );
                    }}
                  >
                    <DeleteOutlineOutlinedIcon
                      color="error"
                      style={{ marginRight: "7px" }}
                    />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
      <div className="project-info-issue-status-bar">
        {projectIssueStatus && (
          <>
            <BlueTooltip
              title={
                "Pending Issues - " +
                (projectIssueStatus["pending"] * projectIssueStatus["total"]) /
                  100
              }
              placement="bottom"
              arrow
            >
              <div
                className="project-info-issue-status-bar-blue"
                style={{ width: `${projectIssueStatus["pending"]}%` }}
              ></div>
            </BlueTooltip>
            <RedTooltip
              title={
                "Closed Issues - " +
                (projectIssueStatus["closed"] * projectIssueStatus["total"]) /
                  100
              }
              placement="bottom"
              arrow
            >
              <div
                className="project-info-issue-status-bar-red"
                style={{ width: `${projectIssueStatus["closed"]}%` }}
              ></div>
            </RedTooltip>
            <GreenTooltip
              title={
                "Fixed Issues - " +
                (projectIssueStatus["resolved"] * projectIssueStatus["total"]) /
                  100
              }
              placement="bottom"
              arrow
            >
              <div
                className="project-info-issue-status-bar-green"
                style={{ width: `${projectIssueStatus["resolved"]}%` }}
              ></div>
            </GreenTooltip>
          </>
        )}
      </div>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    currentTheme: state.theme.theme,
  };
};

export default withRouter(connect(mapStateToProps, null)(ProjectInfo));
