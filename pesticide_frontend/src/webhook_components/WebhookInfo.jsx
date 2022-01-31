import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import { Typography } from "@material-ui/core";
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
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import GitHubIcon from "@material-ui/icons/GitHub";
import EditWebhookWithModal from "./EditWebhookWithModal";
import * as api_links from "../APILinks";
import MemberButton from "../components/MemberButton";

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

const WebhookInfo = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const webhook = props.webhookDetails
  const project = props.projectInfo
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const WebhookDetailContainer = {
    padding: "17px",
    alignItems: "center",
    overflowY: "auto",
    flexFlow: !isMobile ? "wrap" : "row",
  };

  Prism.highlightAll();

  React.useEffect(() => {

  }, []);

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
                    <GitHubIcon/>
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
                            {!webhook.name ? (
                              <Skeleton width={100} height={50} animation="wave" />
                            ) : (
                              <>
                                {webhook.name}
                                &nbsp;&nbsp;
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <div style={{ fontSize: 25, fontWeight: "600" }}>
                          {!webhook.name ? (
                            <Skeleton width={100} height={50} animation="wave" />
                          ) : (
                            webhook.name
                          )}
                        </div>
                      </div>
                    )
                  }
            />
            {!isMobile&&(
                <div style={WebhookDetailContainer}>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                       <strong> Repository Name : </strong> {webhook.repository_name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                       <strong> SSH URL : </strong> {webhook.ssh_url}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                       <strong> Branch : </strong> {webhook.branch}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        <strong> Identifier : </strong> {webhook.identifier}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        <strong> Path : </strong> {webhook.path}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        <strong> Created by : </strong> <MemberButton user={webhook.creator} />
                        • {getDate(webhook.timestamp)}
                    </Typography>
                </div>
            )}
            {isMobile && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
                    <div style={{ display: "flex" }}>
                      <EditWebhookWithModal
                        webhookName={webhook.name}
                        projectID={props.projectID}
                        webhookID={webhook.id}
                        webhookDetails = {webhook}
                        // fetchData={fetchProjectData}
                      />
                      <Button
                        className="btn-filled-small btn-filled-small-error"
                        onClick={() => {
                          props.openAlert(
                            "delete_webhook",
                            "Delete Webhook " + webhook.name + "?",
                            "This webhook will be deleted permanently.",
                            "Cancel",
                            "Delete",
                            webhook.id
                          );
                        }}
                      >
                        <DeleteOutlineOutlinedIcon color="error" />
                      </Button>
                    </div>
                  
                </div>
              )}
            </div>
            )}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                <div className="issue-content">
                    {isMobile&&(
                        <div style={WebhookDetailContainer}>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                            <strong> Repository Name : </strong> {webhook.repository_name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                            <strong> SSH URL : </strong> {webhook.ssh_url}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                            <strong> Branch : </strong> {webhook.branch}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                <strong> Identifier : </strong> {webhook.identifier}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                <strong> Path : </strong> {webhook.path}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                <strong> Created by : </strong> <MemberButton user={webhook.creator} />
                                • {getDate(webhook.timestamp)}
                            </Typography>
                        </div>
                    )}
                   
                </div>
                </CardContent>
            </Collapse>
        </div>
            {!isMobile && (
            
            <Card className="project-info-large-actions" variant="outlined">
                <EditWebhookWithModal
                  webhookName={webhook.name}
                  projectID={props.projectID}
                  webhookID={webhook.id}
                  large
                  webhookDetails = {webhook}
                />
                <Button
                    className="btn-filled btn-filled-error"
                    onClick={() => {
                      props.openAlert(
                        "delete_webhook",
                        "Delete Webhook " + webhook.name + "?",
                        "This webhook will be deleted permanently.",
                        "Cancel",
                        "Delete",
                        webhook.id
                      );
                    }}
                >
                    <DeleteOutlineOutlinedIcon
                      color="error"
                      style={{ marginRight: "7px" }}
                    />
                    Delete
                </Button>
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

export default withRouter(connect(mapStateToProps, null)(WebhookInfo));
