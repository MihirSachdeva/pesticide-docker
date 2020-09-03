import React from "react";
import { makeStyles } from "@material-ui/core/styles";
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
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import EditProjectWithModal from "./EditProjectWithModal";
import * as api_links from "../APILinks";
import MemberButton from "./MemberButton";

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

const memberCardContainer = {
  display: "flex",
  flexDirection: "row",
  padding: "17px",
  alignItems: "center",
  overflowY: "auto",
};

const ProjectInfo = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [wiki, setWiki] = React.useState("");
  const [project, setProject] = React.useState({});
  const [projecticon, setProjecticon] = React.useState();
  const [currentUserIsMember, setCurrentUserIsMember] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  async function fetchCurrentUserInfo() {
    axios
      .get(`${api_links.API_ROOT}current_user/`)
      .then((res) => {
        setCurrentUser(res.data[0]);
      })
      .catch((err) => console.log(err));
  }

  React.useEffect(() => {
    fetchCurrentUserInfo();
    axios
      .get(api_links.API_ROOT + `projects/${props.projectID}/`)
      .then((res) => {
        setProject(res.data);
        setCurrentUserIsMember(() => {
          return res.data.members
            .map((member) => member.toString())
            .includes(currentUser.id);
        });
        setProjecticon(
          res.data.icon
            ? api_links.ROOT + res.data.icon
            : props.currentTheme == "palpatine"
            ? "../icon/project/appicon_red.svg"
            : "../icon/project/appicon.svg"
        );
        setWiki(res.data.wiki);
      })
      .catch((err) => console.log(err));
  }, [props.projectID]);

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
                {projecticon ? (
                  <Link to={"/projects/" + props.projectslug}>
                    <div
                      style={{
                        width: isMobile ? "90px" : "120px",
                        height: isMobile ? "90px" : "120px",
                        borderRadius: "20px",
                        padding: "4px",
                        backgroundImage: `url(${projecticon})`,
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
                )}
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
                  {new Date(project.timestamp).getDate() +
                    "/" +
                    new Date(project.timestamp).getMonth() +
                    "/" +
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
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    currentTheme: state.theme.theme,
  };
};

export default withRouter(connect(mapStateToProps, null)(ProjectInfo));
