import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";

import axios from "axios";

import ImageWithModal from "./ImageWithModal";
import * as api_links from "../APILinks";

const EditProjectForm = (props) => {
  const [formData, setFormData] = React.useState({});
  const [editedFormData, setEditedFormData] = React.useState({});
  const [status, setStatus] = React.useState("");
  const [oldStatus, setOldStatus] = React.useState("");
  const [statusChoices, setStatusChoices] = React.useState([]);
  const [personsID, setPersonsID] = React.useState([]);
  const [editedPersonsList, setEditedPersonsList] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  const [projectImage, setProjectImage] = React.useState(null);
  const [projectDescription, setProjectDescription] = React.useState("");

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
    setEditedFormData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleMembersChange = (event) => {
    setPersonsID(event.target.value);
    setEditedPersonsList(event.target.value);
  };

  async function fetchUserListFromAPI() {
    axios
      .get(api_links.API_ROOT + "users/")
      .then((res) => {
        setUserList(res.data);
      })
      .catch((err) => console.log(err));
  }

  const handleImageChange = (event) => {
    setProjectImage(event.target.files[0]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const token = props.token;
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Token  " + token,
    };
    axios
      .patch(api_links.API_ROOT + `projects/${props.projectID}/`, {
        ...editedFormData,
        wiki: projectDescription,
      })
      .then((res) => {
        let audio = new Audio(
          "../sounds/navigation_selection-complete-celebration.wav"
        );
        audio.play();

        editedPersonsList.length &&
          axios
            .patch(api_links.UPDATE_PROJECT_MEMBERS(props.projectID), {
              members: editedPersonsList,
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
              let audio = new Audio("../sounds/alert_error-03.wav");
              audio.play();
            });

        status != oldStatus &&
          axios
            .patch(api_links.UPDATE_PROJECT_STATUS(props.projectID), {
              status: status,
            })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
              let audio = new Audio("../sounds/alert_error-03.wav");
              audio.play();
            });

        if (
          projectImage !== null &&
          (res.status == 200 || res.status == 202 || res.status == 204)
        ) {
          let project_id = res.data.id;
          let data = new FormData();
          data.append("project", project_id);
          data.append("image", projectImage, projectImage.name);
          axios.defaults.headers = {
            "Content-Type": "multipart/form-data",
            Authorization: "Token  " + token,
          };
          if (res.data.icon) {
            axios
              .patch(
                api_links.API_ROOT + `projecticons/${res.data.icon_id}/`,
                data
              )
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
                let audio = new Audio("../sounds/alert_error-03.wav");
                audio.play();
              });
          } else {
            axios
              .post(api_links.API_ROOT + `projecticons/`, data)
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
                let audio = new Audio("../sounds/alert_error-03.wav");
                audio.play();
              });
          }
        }
        setTimeout(() => {
          window.location.href = "/projects";
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        let audio = new Audio("../sounds/alert_error-03.wav");
        audio.play();
      });
  };

  const handleEditorChange = (content, editor) => {
    setProjectDescription(content);
  };

  async function fetchProjectInfoFromAPI() {
    axios
      .get(api_links.API_ROOT + `projects/${props.projectID}/`)
      .then((res) => {
        setFormData({
          name: res.data.name,
          link: res.data.link,
          creator: res.data.creator,
          icon:
            res.data.icon != undefined ? api_links.ROOT + res.data.icon : null,
        });
        setStatus(res.data.status);
        setOldStatus(res.data.status);
        setProjectDescription(res.data.wiki);
        setPersonsID(res.data.members);
      })
      .catch((err) => console.log(err));
  }

  async function fetchStatusChoicesFromAPI() {
    axios
      .options(api_links.API_ROOT + `projects/`)
      .then((res) => {
        setStatusChoices(
          res.data.actions.POST.status.choices.map(
            (choice) => choice.display_name
          )
        );
      })
      .catch((err) => console.log(err));
  }

  React.useEffect(() => {
    fetchUserListFromAPI();
    fetchProjectInfoFromAPI();
    fetchStatusChoicesFromAPI();
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <div style={{ margin: "20px 5px" }}>
        <form noValidate onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Typography className="form-label">Project Name</Typography>
            <Grid
              item
              xs={12}
              className="custom-form-outline"
              style={props.borderClass}
            >
              <TextField
                name="name"
                fullWidth
                id="projectname"
                label=""
                value={formData.name}
                onChange={handleFormChange}
              />
            </Grid>

            <Typography className="form-label">Wiki</Typography>
            <Grid
              item
              xs={12}
              style={{
                ...props.borderClass,
                padding: "0",
                borderRadius: "4px",
                margin: "10px",
              }}
            >
              {!props.darkTheme ? (
                <Editor
                  value={projectDescription}
                  init={{
                    skin: "material-classic",
                    content_css: "material-classic",
                    icons: "thin",
                    height: 250,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount table",
                    ],
                    toolbar: [
                      "undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | table | code | help",
                    ],
                  }}
                  onEditorChange={handleEditorChange}
                />
              ) : (
                <Editor
                  value={projectDescription}
                  init={{
                    skin: "oxide-dark",
                    content_css: "dark",
                    icons: "thin",
                    height: 250,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount table",
                    ],
                    toolbar: [
                      "undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | table | code | help",
                    ],
                  }}
                  onEditorChange={handleEditorChange}
                />
              )}
            </Grid>

            <Typography className="form-label">Project Logo</Typography>
            <Grid
              item
              xs={12}
              className="custom-form-outline"
              style={props.borderClass}
            >
              <div className="project-edit-image">
                {formData.icon ? (
                  <ImageWithModal src={formData.icon} alt="Project Icon" />
                ) : (
                  <Typography>No logo set for this project.</Typography>
                )}
              </div>
              <Typography className="form-label-inner">
                Select New Logo
              </Typography>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Grid>

            <Typography className="form-label">Select Members</Typography>
            <Grid item xs={12}>
              {userList !== [] && (
                <Select
                  labelId="mutiple-chip-label"
                  id="mutiple-chip"
                  className="custom-form-selection-outline"
                  style={props.borderClass}
                  multiple
                  value={personsID}
                  onChange={handleMembersChange}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <div>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={
                            userList.filter(
                              (user, index) => user.id == value
                            )[0] !== undefined &&
                            userList.filter(
                              (user, index) => user.id == value
                            )[0].name
                          }
                          style={{ margin: "5px", borderRadius: "10px" }}
                        />
                      ))}
                    </div>
                  )}
                >
                  {userList.map((user) => (
                    <MenuItem key={user.name} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Grid>

            <Typography className="form-label">
              Change Status (current Status is {oldStatus})
            </Typography>
            <Grid item xs={12}>
              <Select
                labelId="single-select-outlined-label"
                id="single-select-outlined"
                className="custom-form-selection-outline"
                style={props.borderClass}
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                label="Status"
                name="status"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {statusChoices.map((option) => (
                  <MenuItem value={option}>{option}</MenuItem>
                ))}
              </Select>
            </Grid>

            <Typography className="form-label">Link</Typography>
            <Grid
              item
              xs={12}
              className="custom-form-outline"
              style={props.borderClass}
            >
              <TextField
                name="link"
                fullWidth
                id="projectlink"
                label=""
                value={formData.link}
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
              Save
            </Button>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    darkTheme: ["dark", "solarizedDark", "palpatine"].includes(
      state.theme.theme
    ),
    borderClass: ["dark", "solarizedDark", "palpatine"].includes(
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

export default withRouter(connect(mapStateToProps, null)(EditProjectForm));
