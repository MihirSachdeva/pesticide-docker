import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import * as api_links from "../APILinks";
import FormDialog from "../components/FormDialog";
import UserCard from "../components/UserCard";
import AlertDialog from "../components/AlertDialog";
import UtilityComponent from "../components/UtilityComponent";
import TitleCard from "../components/TitleCard";
import HEADER_NAV_TITLES from "../header_nav_titles";
import * as snackbarActions from "../store/actions/snackbar";
import allEmoticons, { getEmoji } from "../constants/emoticons";

import axios from "axios";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Admin = (props) => {
  const [tags, setTags] = React.useState([]);
  const [statuses, setStatuses] = React.useState([]);
  const [emoticons, setEmoticons] = React.useState({
    added: [],
    more: []
  });
  const [statusTypes, setStatusTypes] = React.useState([]);
  const [formDialog, setFormDialog] = React.useState({
    open: false,
  });
  const [users, setUsers] = React.useState([]);
  const [alert, setAlert] = React.useState({
    open: false,
  });

  async function fetchTags() {
    axios
      .get(api_links.API_ROOT + "tags/")
      .then((res) => {
        setTags(res.data);
      })
      .catch((err) => console.log(err));
  }

  async function fetchStatuses() {
    axios
      .get(api_links.API_ROOT + "issuestatus/")
      .then((res) => {
        setStatuses(res.data);
      })
      .catch((err) => console.log(err));
  }

  async function fetchUsers() {
    axios
      .get(api_links.API_ROOT + "users/")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }

  async function fetchIssueStatusTypes() {
    axios
      .options(api_links.API_ROOT + "issuestatus/")
      .then((res) => {
        setStatusTypes(res.data.actions.POST.type.choices);
      })
      .catch((err) => console.log(err));
  }

  async function fetchEmoticons() {
    axios
      .get(api_links.API_ROOT + "emoticons/")
      .then((res) => {
        let addedEmoticons = [];
        let moreEmoticons = [];
        allEmoticons.forEach((emoticon) => {
          let extraEmoji = res.data.find(
            added_emoticon => added_emoticon.aria_label == emoticon.aria_label
          )
          if (extraEmoji) {
            addedEmoticons.push({ ...extraEmoji, emoji: getEmoji(extraEmoji.aria_label) })
          } else {
            moreEmoticons.push(emoticon)
          }
        });
        setEmoticons({
          added: addedEmoticons,
          more: moreEmoticons
        });
      })
      .catch((err) => console.log(err));
  }

  React.useEffect(() => {
    fetchTags();
    fetchStatuses();
    setFormDialog({ open: false });
    fetchUsers();
    fetchIssueStatusTypes();
    fetchEmoticons();
  }, []);

  const openFormDialog = (
    action,
    title,
    description,
    cancel,
    confirm,
    data,
    fields,
    showColorSwatches,
    colorSwatchesType,
    options = []
  ) => {
    setFormDialog({
      open: true,
      title,
      description,
      cancel,
      confirm,
      action,
      data,
      fields,
      showColorSwatches,
      colorSwatchesType,
      options,
    });
  };

  const closeFormDialog = () => {
    setFormDialog(() => ({
      open: false,
    }));
  };

  const confirmFormDialog = (action, choice, data, fields, options) => {
    switch (action) {
      case "edit_tag":
        choice && editTag(data, fields);
        break;
      case "add_tag":
        choice && addTag(fields);
        break;
      case "edit_status":
        choice && editStatus(data, fields, options);
        break;
      case "add_status":
        choice && addStatus(fields, options);
        break;
      case "add_emoticon":
        choice && addEmoticon(data);
        break;
      case "delete_emoticon":
        choice && removeEmoticon(data);
        break;
    }
  };

  const editTag = (data, fields) => {
    let id = data.id;
    let tag_text_index = fields.findIndex((field) => field.name == "tag_text");
    let color_index = fields.findIndex((field) => field.name == "color");
    let tag_text = fields[tag_text_index].value;
    let color = fields[color_index].value;
    let tag = {
      tag_text: tag_text,
      color: color,
    };
    console.log(tag);
    axios
      .patch(api_links.API_ROOT + `tags/${id}/`, tag)
      .then((res) => {
        fetchTags();
        props.showSnackbar("success", `Tag '${tag_text}' updated.`, 6000);
      })
      .catch((err) => {
        console.log(err);
        props.showSnackbar(
          "error",
          "Couldn't update tag. Try again later.",
          6000
        );
      });
  };

  const editStatus = (data, fields, options) => {
    let id = data.id;
    let status_text_index = fields.findIndex(
      (field) => field.name == "status_text"
    );
    let color_index = fields.findIndex((field) => field.name == "color");
    let status_text = fields[status_text_index].value;
    let color = fields[color_index].value;
    let type = options[0].value;
    let status = {
      status_text: status_text,
      color: color,
      type: type,
    };
    console.log(status);
    axios
      .patch(api_links.API_ROOT + `issuestatus/${id}/`, status)
      .then((res) => {
        fetchStatuses();
        props.showSnackbar(
          "success",
          `Issue status '${status_text}' updated.`,
          6000
        );
      })
      .catch((err) => {
        console.log(err);
        props.showSnackbar(
          "error",
          "Couldn't update issue status. Try again later.",
          6000
        );
      });
  };

  const addTag = (fields) => {
    let tag_text_index = fields.findIndex((field) => field.name == "tag_text");
    let color_index = fields.findIndex((field) => field.name == "color");
    let tag_text = fields[tag_text_index].value;
    let color = fields[color_index].value;
    let tag = {
      tag_text: tag_text,
      color: color,
    };
    console.log(tag);
    axios
      .post(api_links.API_ROOT + "tags/", tag)
      .then((res) => {
        fetchTags();
        props.showSnackbar("success", `New tag '${tag_text}' added.`, 6000);
      })
      .catch((err) => {
        console.log(err);
        props.showSnackbar(
          "error",
          "Couldn't add new tag. Try again later.",
          6000
        );
      });
  };

  const addStatus = (fields, options) => {
    let status_text_index = fields.findIndex(
      (field) => field.name == "status_text"
    );
    let color_index = fields.findIndex((field) => field.name == "color");
    let status_text = fields[status_text_index].value;
    let color = fields[color_index].value;
    let type = options[0].value;
    let status = {
      status_text: status_text,
      color: color,
      type: type,
    };
    axios
      .post(api_links.API_ROOT + "issuestatus/", status)
      .then((res) => {
        fetchStatuses();
        props.showSnackbar(
          "success",
          `New status '${status_text}' added.`,
          6000
        );
      })
      .catch((err) => {
        console.log(err);
        props.showSnackbar(
          "error",
          "Couldn't add new issue status. Try again later.",
          6000
        );
      });
  };

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  const handleUserUpdate = (id, field, bool) => {
    let data = {
      [field]: bool,
    };
    axios
      .patch(api_links.API_ROOT + `user_status/${id}/`, data)
      .then((res) => {
        fetchUsers();
        props.showSnackbar("success", `User permissions updated.`, 6000);
      })
      .catch((err) => {
        console.log(err);
        props.showSnackbar(
          "error",
          "Couldn't update user permissions. Try again later.",
          6000
        );
      });
  };

  const addEmoticon = (data) => {
    const fields = {
      emoji: data.aria_label,
      aria_label: data.aria_label
    }
    axios.post(api_links.API_ROOT + "emoticons/", fields)
      .then((res) => {
        fetchEmoticons();
        props.showSnackbar(
          "success",
          "New emoticon added.",
          6000
        );
      })
      .catch((err) => {
        console.log(err);
        props.showSnackbar(
          "error",
          "Couldn't add new emoticon. Try again later.",
          6000
        );
      });
  }

  const removeEmoticon = (data) => {
    axios.delete(api_links.API_ROOT + `emoticons/${data.id}/`)
      .then((res) => {
        fetchEmoticons();
        props.showSnackbar(
          "success",
          "Emoticon deleted.",
          6000
        );
      })
      .catch((err) => {
        console.log(err);
        props.showSnackbar(
          "error",
          "Couldn't delete emoticon. Try again later.",
          6000
        );
      })
  }

  const confirmAlert = (action, choice, data) => {
    choice && handleUserUpdate(data.id, data.field, data.bool);
  };

  return (
    <>
      <UtilityComponent
        onlyAdmins
        title={HEADER_NAV_TITLES.ADMIN}
        page="ADMIN"
      />

      <div>
        <TitleCard title="Admin" />

        <AppBar position="sticky">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab
              style={{ textTransform: "none" }}
              label="Issue Tags"
              {...a11yProps(0)}
            />
            <Tab
              style={{ textTransform: "none" }}
              label="Issue Status"
              {...a11yProps(1)}
            />
            <Tab
              style={{ textTransform: "none" }}
              label="Comment Reactions"
              {...a11yProps(2)}
            />
            <Tab
              style={{ textTransform: "none" }}
              label={props.theme == "palpatine" ? "Jedi" : "Users"}
              {...a11yProps(3)}
            />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <>
            <div style={{ margin: "10px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "centet",
                  justifyContent: "center",
                }}
              >
                <Button
                  style={{
                    textTransform: "none",
                    fontWeight: "900",
                    fontSize: "20px",
                    width: "fit-content",
                    padding: "5ps 10px",
                    margin: "20px",
                  }}
                  className="project-issue-tag issue-button-filled"
                  onClick={() => {
                    openFormDialog(
                      "add_tag",
                      "Create a new Tag",
                      "Tag text has to be unique, color can be any valid CSS color.",
                      "Cancel",
                      "Save",
                      {},
                      [
                        {
                          title: "Tag",
                          name: "tag_text",
                          value: " ",
                          is_required: true,
                        },
                        {
                          title: "Tag color",
                          name: "color",
                          value: " ",
                          is_required: true,
                        },
                      ],
                      true,
                      "tag_colors"
                    );
                  }}
                >
                  + Create a new Tag
                </Button>
              </div>
              <div className="admin-tags-container">
                {tags != [] &&
                  tags.map((tag) => (
                    <Button
                      style={{
                        textTransform: "none",
                        fontSize: "14px",
                        width: "fit-content",
                        margin: "10px auto",
                      }}
                      className="project-issue-tag issue-button-filled-outline"
                      onClick={() => {
                        openFormDialog(
                          "edit_tag",
                          `Edit tag '${tag.tag_text}'`,
                          "You can change the tag text and color. Color can be any valid CSS color.",
                          "Cancel",
                          "Save",
                          {
                            id: tag.id,
                          },
                          [
                            {
                              title: "Tag",
                              name: "tag_text",
                              value: tag.tag_text,
                              is_required: true,
                            },
                            {
                              title: "Tag color",
                              name: "color",
                              value: tag.color,
                              is_required: true,
                            },
                          ],
                          true,
                          "tag_colors"
                        );
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: tag.color,
                        }}
                        className="tag-color"
                      ></div>
                      <span>{tag.tag_text}</span>
                    </Button>
                  ))}
              </div>
            </div>
          </>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <>
            <div style={{ margin: "10px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "centet",
                  justifyContent: "center",
                }}
              >
                <Button
                  style={{
                    textTransform: "none",
                    fontWeight: "900",
                    fontSize: "20px",
                    width: "fit-content",
                    padding: "5ps 10px",
                    margin: "20px",
                  }}
                  className="project-issue-tag issue-button-filled"
                  onClick={() => {
                    openFormDialog(
                      "add_status",
                      "Create a New Issue Status",
                      "Status text has to be unique and color can be any valid CSS color. Choose a status type from the dropdown.",
                      "Cancel",
                      "Save",
                      {},
                      [
                        {
                          title: "Status",
                          name: "status_text",
                          value: " ",
                          is_required: true,
                        },
                        {
                          title: "Status color",
                          name: "color",
                          value: " ",
                          is_required: true,
                        },
                      ],
                      true,
                      "issue_status_colors",
                      [
                        {
                          title: "Status type",
                          name: "status_type",
                          choices: statusTypes,
                          value: "",
                          is_required: true,
                        },
                      ]
                    );
                  }}
                >
                  + Create a new Status
                </Button>
              </div>
              <div className="admin-tags-container">
                {statuses != [] &&
                  statuses.map((status, index) => (
                    <Button
                      style={{
                        backgroundColor: status && status.color,
                        textTransform: "none",
                        fontWeight: "900",
                        width: "fit-content",
                        margin: "10px auto",
                      }}
                      className="project-issue-status-button"
                      onClick={() => {
                        openFormDialog(
                          "edit_status",
                          `Edit status '${status.status_text}'`,
                          "Status text has to be unique and color can be any valid CSS color. Status type can be selected from the dropdown.",
                          "Cancel",
                          "Save",
                          {
                            id: status.id,
                          },
                          [
                            {
                              title: "Status",
                              name: "status_text",
                              value: status.status_text,
                              is_required: true,
                            },
                            {
                              title: "Status color",
                              name: "color",
                              value: status.color,
                              is_required: true,
                            },
                          ],
                          true,
                          "issue_status_colors",
                          [
                            {
                              title: "Status type",
                              name: "status_type",
                              choices: statusTypes,
                              value: status.type,
                              is_required: true,
                            },
                          ]
                        );
                      }}
                    >
                      {status.status_text}
                    </Button>
                  ))}
              </div>
            </div>
          </>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <>
            <div style={{ margin: "10px" }}>
              <h3 style={{ textAlign: 'center' }}>Added emoticons:</h3>
              <div className="admin-tags-container">
                {emoticons && emoticons.added &&
                  emoticons.added.map((emoticon) => (
                    <Button
                      style={{
                        textTransform: "none",
                        fontSize: "14px",
                        width: "fit-content",
                        margin: "10px auto",
                      }}
                      className="project-issue-tag issue-button-filled-outline"
                      onClick={() => {
                        openFormDialog(
                          "delete_emoticon",
                          `Reaction: ${emoticon.emoji} - ${emoticon.aria_label}`,
                          "This emoticon is already added.",
                          "Cancel",
                          "Delete",
                          {
                            id: emoticon.id,
                          },
                          [],
                          false,
                        );
                      }}
                    >
                      <span>{emoticon.emoji + " " + emoticon.aria_label}</span>
                    </Button>
                  ))}
              </div>
              <h3 style={{ textAlign: 'center' }}>More emoticons:</h3>
              <div className="admin-tags-container">
                {emoticons && emoticons.more &&
                  emoticons.more.map((emoticon) => (
                    <Button
                      style={{
                        textTransform: "none",
                        fontSize: "14px",
                        width: "fit-content",
                        margin: "10px auto",
                      }}
                      className="project-issue-tag issue-button-filled-outline"
                      onClick={() => {
                        openFormDialog(
                          "add_emoticon",
                          `Reaction: ${emoticon.emoji} - ${emoticon.aria_label}`,
                          "This emoticon can be added. Click on 'Add' to add this emoticon.",
                          "Cancel",
                          "Add",
                          {
                            aria_label: emoticon.aria_label,
                            emoji: emoticon.aria_label,
                          },
                          [],
                          false,
                        );
                      }}
                    >
                      <span>{emoticon.emoji + " " + emoticon.aria_label}</span>
                    </Button>
                  ))}
              </div>
            </div>
          </>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <div className="user-card-container">
            <div className="user-card-grid">
              {users.map((user) => (
                <UserCard
                  id={user.id}
                  name={user.name}
                  is_admin={user.is_admin}
                  enrollment_number={user.enrollment_number}
                  degree={user.degree}
                  branch={user.branch}
                  current_year={user.current_year}
                  is_active={user.is_active}
                  user={user.user}
                  display_photo={user.display_picture}
                  isActive={user.is_active}
                  isAdmin={user.is_master}
                  fromAdminPage
                  openAlert={openAlert}
                />
              ))}
            </div>
          </div>
        </TabPanel>
        <FormDialog
          open={formDialog.open}
          title={formDialog.title}
          description={formDialog.description}
          cancel={formDialog.cancel}
          confirm={formDialog.confirm}
          action={formDialog.action}
          data={formDialog.data}
          closeFormDialog={closeFormDialog}
          confirmFormDialog={confirmFormDialog}
          fields={formDialog.fields}
          showColorSwatches={formDialog.showColorSwatches}
          colorSwatchesType={formDialog.colorSwatchesType}
          options={formDialog.options}
        />
        <AlertDialog
          open={alert.open}
          action={alert.action}
          title={alert.title || ""}
          description={alert.description || ""}
          cancel={alert.cancel || ""}
          confirm={alert.confirm || ""}
          confirmAlert={confirmAlert}
          data={alert.data || {}}
          closeAlert={closeAlert}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    theme: state.theme.theme,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSnackbar: (style, text, duration) =>
      dispatch(snackbarActions.changeSnackbar(true, style, text, duration)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Admin));
