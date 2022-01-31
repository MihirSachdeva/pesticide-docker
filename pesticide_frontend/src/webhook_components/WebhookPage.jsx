import React from "react";
import {
  MenuItem,
  Typography,
  Button,
  IconButton,
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
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { connect } from "react-redux";
import { Link, withRouter, Redirect } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import axios from "axios";
import { useParams } from 'react-router-dom';

import ProjectLogo from "../components/ProjectLogo";
import AlertDialog from "../components/AlertDialog";
import UtilityComponent from "../components/UtilityComponent";
import ImageWithModal from "../components/ImageWithModal";
import CommentBox from "../components/CommentBox";
import { getEmoji } from "../constants/emoticons";
import HEADER_NAV_TITLES from "../header_nav_titles";
import * as api_links from "../APILinks";
import * as snackbarActions from "../store/actions/snackbar";
import WebSocketInstance from "../websocket";
import Avatar from "../components/Avatar";
import WebhookInfo from "./WebhookInfo";
import NewWebhookWithModal from "./NewWebhookWithModal";

const Webhook = (props) => {
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

    const params = useParams();
    const projectID = params.projectID;
    const [webhooks, setWebhooks] = React.useState([]);
    const [project, setProject] = React.useState({});
    const [alert, setAlert] = React.useState({
        open: false,
    });
   
    const topRef = React.useRef(null);
    const isMobile = useMediaQuery("(max-width: 900px)");
    const [hoverButtons, showHoverButtons] = React.useState(false);
    const [error, setError] = React.useState(null);

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
        fetchProjectDetails();
        document.getElementById("main-main").addEventListener("scroll", scrollFunc);
        scrollToTop();     
        setAlert({
        open: false,
        });

        return () => {
        document
            .getElementById("main-main")
            .removeEventListener("scroll", scrollFunc);
        };
    }, []);

    async function fetchProjectDetails() {
        var current_user_id;
        axios
        .get(`${api_links.API_ROOT}projects/${projectID}/`)
        .then((res) => {
            setProject(res.data);
            fetchWebhooksForTheProject();
            axios
            .get(`${api_links.API_ROOT}current_user/`)
            .then((response) => {
              current_user_id = response.data[0].id;
              (res.data.members.includes(current_user_id )||res.data.creator==current_user_id||response.data[0].is_master)?(""):(setError(true))
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }

    async function fetchWebhooksForTheProject() {
        axios
        .get(`${api_links.API_ROOT}webhook_details/${projectID}/`)
        .then((res) => {
            setWebhooks(res.data)
            fetchCurrentUser();
        })
        .catch((err) => console.log(err));
    }

    const scrollToTop = () => {
        document.getElementById("main-main").scrollTo(0, 0);
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
        case "delete_webhook":
            choice && handleWebhookDelete(data);
            break;
        }
    };

    const handleWebhookDelete = (webhookID) => {
      axios
        .delete(api_links.API_ROOT + `webhook/${webhookID}/`)
        .then((res) => {
          let audio = new Audio(
            "../sounds/navigation_selection-complete-celebration.wav"
          );
          audio.play();
          setTimeout(() => {
            window.location.href = `/webhooks/${projectID}`;
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          let audio = new Audio("../sounds/alert_error-03.wav");
          audio.play();
        });
    };
    
  return (
    <>
      <div ref={topRef} style={{ display: "none" }}></div>
      {error && <Redirect to="/404" />}

      <UtilityComponent
        title={HEADER_NAV_TITLES.WEBHOOK}
        page="PROJECT"
        customRenderScroll
      />
      {project.name && (
          <>
          <div className="issue-header">
            <div>
              <Link
                to={"/projects/" + project.projectslug}
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
                    {project.icon ? (
                      <img
                        src={api_links.ROOT + project.icon}
                        alt="Issue Reporter"
                        style={{ borderRadius: "6px", width: "30px" }}
                      />
                    ) : (
                        <ProjectLogo
                          name={project.name}
                          style={{ width: "30px", height: "30px" }}
                        />
                      )}
                  </div>
                  {isMobile
                    ? project.name && (
                        project.name.length < 15
                        ?project.name
                        : project.name.match(/\b([a-zA-Z])/g).join("")
                    )
                    : project.name
                  }
                </Button>
              </Link>
            </div>
            <NewWebhookWithModal
              projectID={project.id}
              projectName={project.name}
              projectslug={project.projectslug}
              large
            />
          </div>
                  
          <hr className="divider2" style={{ margin: "0 10px" }} />
          {(webhooks.length==0)?(
            <Typography variant="subtitle1" style={{ margin: "10px" }} color="text.secondary" component="div">
              No webhooks added yet.
            </Typography>
          ):("")}
          {webhooks.map((webhook) => (
              <div>
                  <WebhookInfo 
                    webhookDetails={webhook}
                    projectInfo = {project}
                    projectID={project.id}
                    openAlert={openAlert}
                  />
              </div>
          ))}
           <AlertDialog
            open={alert.open}
            action={alert.action}
            title={alert.title || ""}
            description={alert.description || ""}
            cancel={alert.cancel || ""}
            confirm={alert.confirm || ""}
            confirmAlert={confirmAlert}
            data={alert.data || ""}
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
    darkTheme: ["dark", "solarizedDark", "palpatine", "dracula"].includes(
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Webhook));
