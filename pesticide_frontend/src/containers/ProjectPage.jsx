import React from "react";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import FilterListIcon from "@material-ui/icons/FilterList";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from "@material-ui/core/Chip";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import IssueItem from "../components/IssueItem";
import SkeletonIssue from "../components/SkeletonIssue";
import ProjectInfo from "../components/ProjectInfo";
import NewIssueWithModal from "../components/NewIssueWithModal";
import AlertDialog from "../components/AlertDialog";
import * as api_links from "../APILinks";
import UtilityComponent from "../components/UtilityComponent";
import HEADER_NAV_TITLES from "../header_nav_titles";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    padding: 0,
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
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

const projectsList = {
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
};

const ProjectPage = (props) => {
  const Theme = useTheme();
  const classes = useStyles();
  const isMobile = useMediaQuery(Theme.breakpoints.down("sm"));
  const searchClass = {
    position: "relative",
    borderRadius: "7px",
    backgroundColor: props.darkTheme
      ? "rgba(141, 141, 141, 0.096)"
      : "rgba(0,0,0,0.10)",
    width: !isMobile ? "15vw" : "100%",
    display: "flex",
    alignItems: "center",
    padding: "10px 5px",
    height: "45px",
    marginLeft: "3px",
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [project, setProject] = React.useState({});
  const [issues, setIssues] = React.useState([]);
  const [tagNameColorList, setTagNameColorList] = React.useState();
  const [tagList, setTagList] = React.useState();
  const [statusList, setStatusList] = React.useState([]);
  const [pid, setPid] = React.useState();
  const [totalPages, setTotalPages] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [statusTypes, setStatusTypes] = React.useState();
  const [statusType, setStatusType] = React.useState("All");
  const [search, setSearch] = React.useState("");
  const [alert, setAlert] = React.useState({
    open: false,
  });

  const openAlert = (action, title, description, cancel, confirm, data) => {
    setAlert({
      open: true,
      title: title,
      description: description,
      cancel: cancel,
      confirm: confirm,
      action: action,
      data: data,
    });
  };

  const closeAlert = () => {
    setAlert((prevAlertState) => ({
      open: false,
    }));
  };

  const confirmAlert = (event, choice, id) => {
    switch (event) {
      case "delete_project":
        choice && handleProjectDelete(id);
        break;
    }
  };

  const handleProjectDelete = (projectID) => {
    axios
      .delete(api_links.API_ROOT + `projects/${projectID}/`)
      .then((res) => {
        let audio = new Audio(
          "../sounds/navigation_selection-complete-celebration.wav"
        );
        audio.play();
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

  async function getDemIssues(projectId, pageNumber = 1) {
    const token = localStorage.getItem("token");
    let config = {
      headers: { Authorization: "Token " + token },
      params: {
        page: pageNumber,
        project: projectId,
      },
    };
    axios
      .get(api_links.API_ROOT + "issues/", config)
      .then((res) => {
        setIssues(res.data.results);
        setTotalPages(res.data.total_pages);
      })
      .catch((err) => console.log(err));
  }

  const [currentUser, setCurrentUser] = React.useState({});

  async function fetchCurrentUserInfo() {
    axios
      .get(`${api_links.API_ROOT}current_user/`)
      .then((res) => {
        setCurrentUser(res.data[0]);
      })
      .catch((err) => console.log(err));
  }

  React.useEffect(() => {
    document.getElementById("main-main").scrollTo(0, 0);
    fetchCurrentUserInfo();

    setAlert({
      open: false,
    });

    axios
      .get(api_links.API_ROOT + "projectnameslug/")
      .then((res) => {
        const projectslug = props.match.params.projectslug;
        const requiredProject = res.data.filter(
          (project) => project.projectslug == projectslug
        )[0];
        setPid(requiredProject.id);
        setProject(requiredProject);
        getDemIssues(requiredProject.id);
        setFilterTags([]);

        axios
          .get(api_links.API_ROOT + "issuestatus/")
          .then((res) => {
            setStatusList(
              res.data.map((status) => ({
                text: status.status_text,
                color: status.color,
                type: status.status_type,
                id: status.id,
              }))
            );
            setStatusTypes({
              open: res.data.filter((status) => status.type == "Pending"),
              fixed_closed: res.data.filter(
                (status) => status.type == "Resolved" || status.type == "Closed"
              ),
            });
          })
          .catch((err) => {
            console.log(err);
          });

        axios
          .get(api_links.API_ROOT + "tags/")
          .then((res2) => {
            let tagList = res2.data;
            setTagList(tagList);
            let tagNameColorList = {};
            res2.data.map((tag) => {
              tagNameColorList[tag.id] = {
                tagText: tag.tag_text,
                tagColor: tag.color,
              };
            });
            setTagNameColorList(tagNameColorList);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        window.location.href = "/404";
      });
  }, [props.match.params.projectslug]);

  const getIssues = () => {
    getFilteredIssues(page, filterTags, search, statusType);
  };

  const [anchorElTag, setAnchorElTag] = React.useState(null);

  const handleClickTag = (event) => {
    setAnchorElTag(event.currentTarget);
  };

  const handleCloseTag = () => {
    setAnchorElTag(null);
  };

  const [filterTags, setFilterTags] = React.useState([]);

  async function getFilteredIssues(
    pageNumber = 1,
    tags,
    searchQuery,
    statusType
  ) {
    const token = localStorage.getItem("token");
    let config = {
      headers: { Authorization: "Token " + token },
      params: {
        page: pageNumber,
        project: pid,
      },
    };
    var url = "issues/";
    if (tags.length != 0) {
      tags.forEach((tag, index) =>
        index != 0 ? (url += `&tags=${tag}`) : (url += `?tags=${tag}`)
      );
      searchQuery && (url += `&search=${searchQuery}`);
      statusType != "All" && (url += `&status__type=${statusType}`);
    } else {
      searchQuery && (url += `?search=${searchQuery}`);
      statusType != "All" &&
        (searchQuery
          ? (url += `&status__type=${statusType}`)
          : (url += `?status__type=${statusType}`));
    }
    axios
      .get(api_links.API_ROOT + url, config)
      .then((res1) => {
        setTotalPages(res1.data.total_pages);
        setIssues(res1.data.results);
      })
      .catch((err) => console.log(err));
  }

  const handleFilterTagAdd = (tagId) => {
    let toUpdate = !filterTags.includes(tagId);
    let newFilterTagList;
    toUpdate && (newFilterTagList = [...filterTags, tagId]);
    toUpdate && setFilterTags(newFilterTagList);
    toUpdate && getFilteredIssues(1, newFilterTagList, search, statusType);
    toUpdate && setPage(1);
  };

  const handleFilterTagRemove = (tagId) => {
    let newFilterTagList = filterTags.filter((tag) => tag != tagId);
    setFilterTags(newFilterTagList);
    getFilteredIssues(1, newFilterTagList, search, statusType);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    page != value && getFilteredIssues(value, filterTags, search, statusType);
    setPage(value);
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    if (search != query) {
      setSearch(query);
      getFilteredIssues(page, filterTags, query, statusType);
    }
  };

  const handleStatusTypeQuery = (status_type) => {
    if (status_type != statusType) {
      setStatusType(status_type);
      getFilteredIssues(page, filterTags, search, status_type);
    }
  };

  return (
    <div>
      <UtilityComponent
        title={HEADER_NAV_TITLES.PROJECTNAME(project.name)}
        page="PROJECT"
      />

      {project.id && (
        <ProjectInfo
          projectID={project.id}
          projectslug={project.projectslug}
          openAlert={openAlert}
        />
      )}

      <AppBar position="sticky">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab
            style={{ textTransform: "none" }}
            label="All"
            onClick={() => {
              handleStatusTypeQuery("All");
            }}
            {...a11yProps(0)}
          />
          <Tab
            style={{ textTransform: "none" }}
            label="Open"
            onClick={() => {
              handleStatusTypeQuery("Pending");
            }}
            {...a11yProps(1)}
          />
          <Tab
            style={{ textTransform: "none" }}
            label="Fixed"
            onClick={() => {
              handleStatusTypeQuery("Resolved");
            }}
            {...a11yProps(2)}
          />
          <Tab
            style={{ textTransform: "none" }}
            label="Closed"
            onClick={() => {
              handleStatusTypeQuery("Closed");
            }}
            {...a11yProps(2)}
          />
        </Tabs>
      </AppBar>
      <div>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              padding: "7px",
              margin: "7px 0",
            }}
          >
            <div style={{ display: "flex", width: "100%" }}>
              <>
                {isMobile && (
                  <div style={searchClass}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase
                      value={search}
                      onChange={handleSearch}
                      placeholder="Search"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      inputProps={{ "aria-label": "search" }}
                    />
                  </div>
                )}

                {!isMobile && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div style={searchClass}>
                      <div className={classes.searchIcon}>
                        <SearchIcon />
                      </div>
                      <InputBase
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search"
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput,
                        }}
                        inputProps={{ "aria-label": "search" }}
                      />
                    </div>

                    <div
                      className="issue-tag-filter-chip-container"
                      style={{ maxWidth: "30vw" }}
                    >
                      {filterTags != [] &&
                        filterTags.map((tag) => (
                          <Chip
                            className="issue-filter-tag-chip"
                            label={
                              <div
                                style={{
                                  color:
                                    tagNameColorList[tag] &&
                                    tagNameColorList[tag].tagColor,
                                  fontWeight: "900",
                                }}
                              >
                                #
                                <span className="issue-tag-text">
                                  {tagNameColorList[tag] &&
                                    tagNameColorList[tag].tagText}
                                </span>
                              </div>
                            }
                            onDelete={() => handleFilterTagRemove(tag)}
                          />
                        ))}
                    </div>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    startIcon={<FilterListIcon />}
                    className="btn-filled"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClickTag}
                  >
                    Filter
                  </Button>
                </div>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorElTag}
                  keepMounted
                  open={Boolean(anchorElTag)}
                  onClose={handleCloseTag}
                  style={{ marginTop: "50px", maxHeight: "350px" }}
                >
                  {tagList != undefined &&
                    tagList.map((tag) => (
                      <MenuItem
                        onClick={() => {
                          handleCloseTag(tag.id);
                          handleFilterTagAdd(tag.id);
                        }}
                      >
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
                </Menu>
              </>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <NewIssueWithModal
                  project={project.id}
                  projectname={project.name}
                  getIssues={getIssues}
                />
              </div>
            </div>
          </div>
        </div>

        {isMobile && (
          <div className="issue-tag-filter-chip-container">
            {filterTags != [] &&
              filterTags.map((tag) => (
                <Chip
                  className="issue-filter-tag-chip"
                  label={
                    <div
                      style={{
                        color:
                          tagNameColorList[tag] &&
                          tagNameColorList[tag].tagColor,
                        fontWeight: "900",
                      }}
                    >
                      #
                      <span className="issue-tag-text">
                        {tagNameColorList[tag] && tagNameColorList[tag].tagText}
                      </span>
                    </div>
                  }
                  onDelete={() => handleFilterTagRemove(tag)}
                />
              ))}
          </div>
        )}

        <div className="issues-list" style={projectsList}>
          {issues[0] != undefined ? (
            issues.map((issue, index) => (
              <IssueItem
                id={issue.id}
                issueIndex={index + 1}
                statusText={issue.status_text}
                statusType={issue.status_type}
                statusColor={issue.status_color}
                statusId={issue.status}
                statusList={statusList}
                date={issue.timestamp}
                title={issue.title}
                content={issue.description}
                assignedTo={issue.assigned_to_name}
                reportedBy={issue.reporter_name}
                assigneeId={issue.assigned_to}
                reporterId={issue.reporter}
                tags={issue.tags}
                project={issue.project}
                projectname={project.name}
                comments={issue.comments}
                image={issue.image[0]}
                getIssues={getIssues}
                tagNameColorList={tagNameColorList}
                reporterDetails={issue.reporter_details}
                assigneeDetails={issue.assignee_details}
                currentUser={currentUser}
                projectSlug={props.match.params.projectslug}
              />
            ))
          ) : issues.length == 0 ? (
            <center>
              <Typography>No issue has been reported yet.</Typography>
            </center>
          ) : (
            <>
              <SkeletonIssue first />
              <SkeletonIssue />
              <SkeletonIssue />
              <SkeletonIssue />
              <SkeletonIssue last />
            </>
          )}
        </div>

        {issues.length != 0 && (
          <div className="pagination-container">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </div>
        )}

        <hr className="divider2" />
      </div>

      <NewIssueWithModal
        floating
        project={project.id}
        projectname={project.name}
        getIssues={getIssues}
        style={{ zIndex: 1100 }}
      />

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
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    darkTheme: ["dark", "solarizedDark", "palpatine"].includes(
      state.theme.theme
    ),
  };
};

export default withRouter(connect(mapStateToProps, null)(ProjectPage));
