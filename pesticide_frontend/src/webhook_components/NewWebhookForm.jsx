import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as api_links from "../APILinks";
import * as sidepanelActions from "../store/actions/sidepanel";

const NewWebhookForm = (props) => {
  const [formData, setFormData] = React.useState({
    name: "",
    repoName: "",
    sshurl: "",
    branch: "",
    path: "",
    identifier: "",
    secret: "",
    project: props.projectID,
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("repository_name", formData.repoName);
    data.append("ssh_url", formData.sshurl);
    data.append("path", formData.path);
    data.append("branch", formData.branch);
    data.append("identifier", formData.identifier);
    data.append("secret", formData.secret);
    data.append("project", formData.project);
    data.append("creator", 1);
    axios
      .post(api_links.API_ROOT + "webhook/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        let audio = new Audio(
          "../sounds/navigation_selection-complete-celebration.wav"
        );
        audio.play();
        window.location.href = `/webhooks/${props.projectID}`;
      })
      .catch((err) => {
        console.log(err);
        let audio = new Audio("../sounds/alert_error-03.wav");
        audio.play();
      });
  };

  React.useEffect(() => {

  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <div style={{ margin: "20px 5px" }}>
        <form noValidate onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>

            <Typography className="form-label">Webhook Name*</Typography>
            <Grid
              item
              xs={12}
              className="custom-form-outline"
              style={props.borderClass}
            >
              <TextField
                name="name"
                fullWidth
                id="webhookname"
                value={formData.name}
                onChange={handleFormChange}
              />
            </Grid>

            <Typography className="form-label">Repository Name*</Typography>
            <Grid
              item
              xs={12}
              className="custom-form-outline"
              style={props.borderClass}
            >
              <TextField
                name="repoName"
                fullWidth
                id="repositoryname"
                value={formData.repoName}
                onChange={handleFormChange}
              />
            </Grid>

            <Typography className="form-label">SSH URL*</Typography>
            <Grid
              item
              xs={12}
              className="custom-form-outline"
              style={props.borderClass}
            >
              <TextField
                name="sshurl"
                fullWidth
                id="sshurl"
                value={formData.sshurl}
                onChange={handleFormChange}
              />
            </Grid>

            <Typography className="form-label">Branch*</Typography>
            <Grid
              item
              xs={12}
              className="custom-form-outline"
              style={props.borderClass}
            >
              <TextField
                name="branch"
                fullWidth
                id="branch"
                value={formData.branch}
                onChange={handleFormChange}
              />
            </Grid>

            <Typography className="form-label">Secret*</Typography>
            <Grid
              item
              xs={12}
              className="custom-form-outline"
              style={props.borderClass}
            >
              <TextField
                name="secret"
                fullWidth
                id="secret"
                value={formData.secret}
                onChange={handleFormChange}
              />
            </Grid>

            <Typography className="form-label">Path*</Typography>
            <Grid
              item
              xs={12}
              className="custom-form-outline"
              style={props.borderClass}
            >
              <TextField
                name="path"
                fullWidth
                id="path"
                value={formData.path}
                onChange={handleFormChange}
                placeholder="w.r.t. codebase as current folder"
              />
            </Grid>

            <Typography className="form-label">Identifier*</Typography>
            <Grid
              item
              xs={12}
              className="custom-form-outline"
              style={props.borderClass}
            >
              <TextField
                name="identifier"
                fullWidth
                id="identifier"
                value={formData.identifier}
                onChange={handleFormChange}
              />
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              style={{ marginTop: "20px" }}
            >
              Create Webhook
            </Button>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    darkTheme: ["dark", "solarizedDark", "palpatine", "dracula"].includes(
      state.theme.theme
    ),
    borderClass: ["dark", "solarizedDark", "palpatine", "dracula"].includes(
      state.theme.theme
    )
      ? {
        border: "1px solid #ffffff6e",
      }
      : {
        border: "1.5px solid #00000042",
      },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSidebar: () => dispatch(sidepanelActions.fetchSidepanel()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewWebhookForm)
);
