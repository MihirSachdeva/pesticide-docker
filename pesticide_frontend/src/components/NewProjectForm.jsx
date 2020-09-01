import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import * as api_links from "../APILinks";

const NewProjectForm = (props) => {
  const [formData, setFormData] = React.useState({
    name: "",
    status: "",
    link: "",
  });
  const [personsID, setPersonsID] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  const [projectImage, setProjectImage] = React.useState(null);
  const [wiki, setWiki] = React.useState("");

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleMembersChange = (event) => {
    setPersonsID(event.target.value);
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
    let data = {
      name: formData.name,
      wiki: wiki,
      timestamp: new Date(),
      link: formData.link,
      status: formData.status,
      members: personsID,
    };
    const token = localStorage.getItem("token");
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Token  " + token,
    };
    axios
      .post(api_links.API_ROOT + "projects/", data)
      .then((res) => {
        let audio = new Audio(
          "../sounds/navigation_selection-complete-celebration.wav"
        );
        audio.play();
        if (projectImage !== null && res.status == 201) {
          let project_id = res.data.id;
          data = new FormData();
          data.append("project", project_id);
          data.append("image", projectImage, projectImage.name);
          axios.defaults.headers = {
            "Content-Type": "multipart/form-data",
            Authorization: "Token  " + token,
          };
          axios
            .post(api_links.API_ROOT + "projecticons/", data)
            .then((res) => {
              console.log(res);
              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
              let audio = new Audio("../sounds/alert_error-03.wav");
              audio.play();
            });
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

  React.useEffect(() => {
    fetchUserListFromAPI();
  }, []);

  const handleEditorChange = (content, editor) => {
    setWiki(content);
  };

  const statusOptions = [
    "Testing",
    "Deployed",
    "Production",
    "Development",
    "Scrapped",
    "Finished",
  ];

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
                  value={wiki}
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
                  value={wiki}
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

            <Typography className="form-label">Logo</Typography>
            <Grid
              item
              xs={12}
              className="custom-form-outline"
              style={props.borderClass}
            >
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Grid>

            <Typography className="form-label">Members</Typography>
            <Grid item xs={12}>
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
                          userList.filter((user, index) => user.id == value)[0]
                            .name
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
            </Grid>

            <Typography className="form-label">Status</Typography>
            <Grid item xs={12}>
              <Select
                labelId="single-select-outlined-label"
                id="single-select-outlined"
                className="custom-form-selection-outline"
                style={props.borderClass}
                value={formData.status}
                onChange={handleFormChange}
                label="Status"
                name="status"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {statusOptions.map((option) => (
                  <MenuItem value={option}>{option}</MenuItem>
                ))}
              </Select>
            </Grid>

            <Typography className="form-label">Project Link</Typography>
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
              Create Project
            </Button>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
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

export default withRouter(connect(mapStateToProps, null)(NewProjectForm));
