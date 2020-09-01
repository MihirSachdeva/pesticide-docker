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
import { Editor } from "@tinymce/tinymce-react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import axios from "axios";
import * as api_links from "../APILinks";

const NewIssueForm = (props) => {
  const [tags, setTags] = React.useState([]);
  const [tagsID, setTagsID] = React.useState([]);
  const [formData, setFormData] = React.useState({
    title: "",
  });
  const [issueImage, setIssueImage] = React.useState(null);
  const [issueDescription, setIssueDescription] = React.useState("");

  async function fetchTagListFromAPI() {
    axios
      .get(api_links.API_ROOT + "tags/")
      .then((res) => {
        setTags(res.data);
      })
      .catch((err) => console.log(err));
  }

  const handleTagsChange = (event) => {
    setTagsID(event.target.value);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    setIssueImage(event.target.files[0]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let data = {
      title: formData.title,
      description: issueDescription,
      timestamp: new Date(),
      project: props.project,
      tags: tagsID,
    };

    axios
      .post(api_links.API_ROOT + "issues/", data)
      .then((res) => {
        let audio = new Audio(
          "../sounds/navigation_selection-complete-celebration.wav"
        );
        audio.play();
        setTimeout(() => {
          if (issueImage !== null && res.status == 201) {
            let issue_id = res.data.id;
            data = new FormData();
            data.append("issue", issue_id);
            data.append("image", issueImage, issueImage.name);
            axios
              .post(api_links.API_ROOT + "issueimages/", data)
              .then((res) => console.log(res))
              .catch((err) => {
                console.log(err);
                let audio = new Audio("../sounds/alert_error-03.wav");
                audio.play();
              });
          }
          props.getIssues();
          props.handleClose();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        let audio = new Audio("../sounds/alert_error-03.wav");
        audio.play();
      });
  };

  React.useEffect(() => {
    fetchTagListFromAPI();
  }, []);

  const handleEditorChange = (content, editor) => {
    setIssueDescription(content);
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <div style={{ margin: "20px 5px" }}>
          <form noValidate onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Typography className="form-label">Title</Typography>
              <Grid
                item
                xs={12}
                className="custom-form-outline"
                style={props.borderClass}
              >
                <TextField
                  name="title"
                  fullWidth
                  id="issuetitle"
                  onChange={handleFormChange}
                />
              </Grid>

              <Typography className="form-label">Description</Typography>
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
                    value={issueDescription}
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
                    value={issueDescription}
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

              <Typography className="form-label">Image</Typography>
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

              <Typography className="form-label">Tags</Typography>
              <Grid item xs={12}>
                <Select
                  className="custom-form-outline-padding-none"
                  labelId="mutiple-chip-label"
                  id="mutiple-chip"
                  className="custom-form-selection-outline"
                  style={props.borderClass}
                  multiple
                  value={tagsID}
                  onChange={handleTagsChange}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected) => {
                    let o = {};
                    tags.map((obj) => {
                      o[obj.id] = obj.tag_text;
                    });
                    return (
                      <div>
                        {selected.map((value) => (
                          <Chip
                            label={o[value]}
                            key={value}
                            style={{ margin: "5px", borderRadius: "10px" }}
                          />
                        ))}
                      </div>
                    );
                  }}
                >
                  {tags.map((tag) => (
                    <MenuItem key={tag.tag_text} value={tag.id}>
                      <div
                        style={{
                          color: tag.color,
                          fontWeight: "900",
                        }}
                      >
                        <span className="issue-tag-text">
                          {"#" + tag.tag_text}
                        </span>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                style={{ marginTop: "20px" }}
              >
                Add Issue
              </Button>
            </Grid>
          </form>
        </div>
      </Container>
    </>
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

export default withRouter(connect(mapStateToProps, null)(NewIssueForm));
