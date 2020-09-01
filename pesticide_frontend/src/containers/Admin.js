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

  React.useEffect(() => {
    fetchTags();
    fetchStatuses();
    setFormDialog({ open: false });
    fetchUsers();
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
    colorSwatchesType
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
    });
  };

  const closeFormDialog = () => {
    setFormDialog(() => ({
      open: false,
    }));
  };

  const confirmFormDialog = (action, choice, data, fields) => {
    switch (action) {
      case "edit_tag":
        choice && editTag(data, fields);
        break;
      case "add_tag":
        choice && addTag(fields);
        break;
      case "edit_status":
        choice && editStatus(data, fields);
        break;
      case "add_status":
        choice && addStatus(fields);
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
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  const editStatus = (data, fields) => {
    let id = data.id;
    let status_text_index = fields.findIndex(
      (field) => field.name == "status_text"
    );
    let color_index = fields.findIndex((field) => field.name == "color");
    let status_text = fields[status_text_index].value;
    let color = fields[color_index].value;
    let status = {
      status_text: status_text,
      color: color,
    };
    console.log(status);
    axios
      .patch(api_links.API_ROOT + `issuestatus/${id}/`, status)
      .then((res) => {
        fetchStatuses();
        console.log(res.data);
      })
      .catch((err) => console.log(err));
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
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  const addStatus = (fields) => {
    let status_text_index = fields.findIndex(
      (field) => field.name == "status_text"
    );
    let color_index = fields.findIndex((field) => field.name == "color");
    let status_text = fields[status_text_index].value;
    let color = fields[color_index].value;
    let status = {
      status_text: status_text,
      color: color,
    };
    console.log(status);
    axios
      .post(api_links.API_ROOT + "issuestatus/", status)
      .then((res) => {
        fetchStatuses();
        console.log(res.data);
      })
      .catch((err) => console.log(err));
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
        console.log(res);
        fetchUsers();
      })
      .catch((err) => console.log(err));
  };

  const confirmAlert = (action, choice, data) => {
    choice && handleUserUpdate(data.id, data.field, data.bool);
  };

  return (
    <>
      <UtilityComponent onlyAdmins title={HEADER_NAV_TITLES.ADMIN} page="ADMIN" />

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
              label={props.theme == "palpatine" ? "Jedi" : "Users"}
              {...a11yProps(2)}
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
                        },
                        {
                          title: "Tag color",
                          name: "color",
                          value: " ",
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
                        color: tag.color,
                        textTransform: "none",
                        fontWeight: "900",
                        fontSize: "17px",
                        width: "fit-content",
                        margin: "10px auto",
                      }}
                      className="project-issue-tag issue-button-filled"
                      onClick={() => {
                        openFormDialog(
                          "edit_tag",
                          `Edit ${tag.tag_text} Tag`,
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
                            },
                            {
                              title: "Tag color",
                              name: "color",
                              value: tag.color,
                            },
                          ],
                          true,
                          "tag_colors"
                        );
                      }}
                    >
                      {tag.tag_text}
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
                      "Status text has to be unique, color can be any valid CSS color.",
                      "Cancel",
                      "Save",
                      {},
                      [
                        {
                          title: "Status",
                          name: "status_text",
                          value: " ",
                        },
                        {
                          title: "Status color",
                          name: "color",
                          value: " ",
                        },
                      ],
                      true,
                      "issue_status_colors"
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
                        color: status.color,
                        textTransform: "none",
                        fontWeight: "900",
                        fontSize: "17px",
                        width: "fit-content",
                        margin: "10px auto",
                      }}
                      className="project-issue-tag issue-button-filled"
                      onClick={() => {
                        openFormDialog(
                          "edit_status",
                          `Edit ${status.status_text} status`,
                          "You can change the status text and color. Status text has to be unique, color can be any valid CSS color.",
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
                            },
                            {
                              title: "Status color",
                              name: "color",
                              value: status.color,
                            },
                          ],
                          true,
                          "issue_status_colors"
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

export default withRouter(connect(mapStateToProps, null)(Admin));
