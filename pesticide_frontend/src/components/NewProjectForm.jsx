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
import * as sidepanelActions from "../store/actions/sidepanel";

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
    const data = new FormData();
    data.append("name", formData.name);
    data.append("wiki", wiki);
    data.append("link", formData.link);
    data.append("status", formData.status);
    data.append("members", personsID);
    projectImage && data.append("image", projectImage, projectImage.name);
    axios
      .post(api_links.API_ROOT + "projects/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        let audio = new Audio(
          "../sounds/navigation_selection-complete-celebration.wav"
        );
        audio.play();
        props.updateSidebar();
        window.location.href = "/projects/";
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
            <Typography className="form-label">Project Name*</Typography>
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
                      "insertdatetime media table paste code help wordcount table codesample",
                    ],
                    toolbar: [
                      "undo redo | formatselect | bold italic backcolor | \
                      alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | table | code | help codesample",
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

const mapDispatchToProps = (dispatch) => {
  return {
    updateSidebar: () => dispatch(sidepanelActions.fetchSidepanel()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewProjectForm)
);
