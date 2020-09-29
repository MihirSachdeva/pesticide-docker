import React from "react";
import UserCard from "../components/UserCard";
import ProjectInfo from "../components/ProjectInfo";
import IssueItem from "../components/IssueItem";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Pagination from "@material-ui/lab/Pagination";
import { Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";

import axios from "axios";

import * as api_links from "../APILinks";
import AlertDialog from "../components/AlertDialog";
import UtilityComponent from "../components/UtilityComponent";
import HEADER_NAV_TITLES from "../header_nav_titles";

export default function UserPage(props) {
  const isMobile = useMediaQuery("(max-width: 700px)");

  const enrollmentNumber = props.match.params.enrollmentNumber;

  const [user, setUser] = React.useState({});
  const [projectList, setProjectList] = React.useState([]);
  const [issueList, setIssueList] = React.useState({
    issuesAssigned: [],
    issuesReported: [],
  });
  const [page, setPage] = React.useState({
    assigned: 1,
    reported: 1,
  });
  const [totalPages, setTotalPages] = React.useState({
    assigned: 1,
    reported: 1,
  });
  const [tagNameColorList, setTagNameColorList] = React.useState([]);
  const [userNameList, setUserNameList] = React.useState([]);
  const [enrNoList, setEnrNoList] = React.useState([]);
  const [statusList, setStatusList] = React.useState([]);
  const [alert, setAlert] = React.useState({
    open: false,
  });
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

  const getDemReportedIssues = (userId, pageNumber = 1) => {
    let config1 = {
      // headers: { Authorization: "Token " + token },
      params: {
        page: pageNumber,
        reporter: userId,
      },
    };
    axios
      .get(api_links.API_ROOT + "issues/", config1)
      .then((res) => {
        setIssueList((prev) => ({
          ...prev,
          issuesReported: res.data.results,
        }));
        setTotalPages((prev) => ({
          ...prev,
          reported: res.data.total_pages,
        }));
      })
      .catch((err) => console.log(err));
  };

  const getDemAssignedIssues = (userId, pageNumber = 1) => {
    let config2 = {
      // headers: { Authorization: "Token " + token },
      params: {
        page: pageNumber,
        assigned_to: userId,
      },
    };
    axios
      .get(api_links.API_ROOT + "issues/", config2)
      .then((res) => {
        setIssueList((prev) => ({
          ...prev,
          issuesAssigned: res.data.results,
        }));
        setTotalPages((prev) => ({
          ...prev,
          assigned: res.data.total_pages,
        }));
      })
      .catch((err) => console.log(err));
  };
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
      })
      .catch((err) => console.log(err));

    axios
      .get(api_links.API_ROOT + `userByEnrNo/${enrollmentNumber}/`)
      .then((res) => {
        setUser(res.data);
        getDemReportedIssues(res.data.id);
        getDemAssignedIssues(res.data.id);

        let config = {
          // headers: { Authorization: "Token " + token },
          params: {
            members: res.data.id,
          },
        };
        axios
          .get(api_links.API_ROOT + "projects/", config)
          .then((res2) => {
            setProjectList(res2.data);
          })
          .catch((err) => console.log(err));

        axios
          .get(api_links.API_ROOT + "tags/")
          .then((res4) => {
            let tagNameColorList = {};
            res4.data.map((tag) => {
              tagNameColorList[tag.id] = {
                tagText: tag.tag_text,
                tagColor: tag.color,
              };
            });
            setTagNameColorList(tagNameColorList);
          })
          .catch((err) => console.log(err));

        axios
          .get(api_links.API_ROOT + "users/")
          .then((res5) => {
            let userNameList = {};
            res5.data.map((user) => (userNameList[user.id] = user.name));
            setUserNameList(userNameList);
            let userEnrNoList = {};
            res5.data.map(
              (user) => (userEnrNoList[user.id] = user.enrollment_number)
            );
            setEnrNoList(userEnrNoList);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        window.location.href = "/404";
      });
  }, [props.match.params.enrollmentNumber]);

  const getIssues = () => {
    getDemReportedIssues(user.id, page.reported);
    getDemAssignedIssues(user.id, page.assigned);
  };

  const handleReportedPageChange = (event, value) => {
    page.reported != value && getDemReportedIssues(user.id, value);
    setPage((prev) => ({
      ...prev,
      reported: value,
    }));
  };

  const handleAssignedPageChange = (event, value) => {
    page.assigned != value && getDemAssignedIssues(user.id, value);
    setPage((prev) => ({
      ...prev,
      assigned: value,
    }));
  };

  return (
    <>
      <UtilityComponent title={HEADER_NAV_TITLES.USER} page="USER" />

      <div
        className="user-card-container"
        style={{
          margin: isMobile ? "10px 5px" : "15px",
        }}
      >
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
        />
      </div>

      <Typography style={{ textAlign: "center" }}>Projects: </Typography>
      {projectList.length != 0 ? (
        projectList.map((project) => (
          <ProjectInfo
            projectID={project.id}
            projectslug={project.projectslug}
            openAlert={openAlert}
          />
        ))
      ) : (
        <Card
          style={{
            padding: "15px",
            margin: "15px",
            borderRadius: "15px",
          }}
          variant="outlined"
        >
          No Projects
        </Card>
      )}

      <hr className="divider2" />

      <Typography style={{ textAlign: "center", margin: "45px 0 20px 0" }}>
        Issues Reported:{" "}
      </Typography>

      <div
        className="issues-list"
        // style={{
        //   margin: '10px',
        //   paddingBottom: '7px'
        // }}
        // variant="outlined"
      >
        {issueList.issuesReported.length != 0 ? (
          issueList.issuesReported.map((issue, index) => (
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
              assigneeId={issue.assigned_to}
              reporterId={issue.reporter}
              tags={issue.tags}
              project={issue.project}
              projectname={issue.project_name}
              comments={issue.comments}
              image={issue.image[0]}
              tagNameColorList={tagNameColorList}
              userNameList={userNameList}
              enrNoList={enrNoList}
              showProjectNameOnCard
              currentUser={currentUser}
              reporterDetails={issue.reporter_details}
              assigneeDetails={issue.assignee_details}
              getIssues={getIssues}
              commentsLength={issue.comments.length}
            />
          ))
        ) : (
          <Card
            style={{
              padding: "15px",
              margin: "15px",
              borderRadius: "15px",
            }}
            variant="outlined"
          >
            No Issues Reported.
          </Card>
        )}
      </div>

      <div className="pagination-container">
        <Pagination
          count={totalPages.reported}
          page={page.reported}
          onChange={handleReportedPageChange}
          variant="outlined"
          shape="rounded"
        />
      </div>

      <hr className="divider2" />

      <Typography style={{ textAlign: "center", margin: "45px 0 20px 0" }}>
        Issues Assigned:{" "}
      </Typography>

      <div
        className="issues-list"
        // style={{
        //   margin: '10px',
        //   paddingBottom: '7px'
        // }}
        // variant="outlined"
      >
        {issueList.issuesAssigned.length != 0 ? (
          issueList.issuesAssigned.map((issue, index) => (
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
              assigneeId={issue.assigned_to}
              reporterId={issue.reporter}
              tags={issue.tags}
              project={issue.project}
              projectname={issue.project_name}
              comments={issue.comments}
              image={issue.image[0]}
              tagNameColorList={tagNameColorList}
              userNameList={userNameList}
              enrNoList={enrNoList}
              showProjectNameOnCard
              currentUser={currentUser}
              reporterDetails={issue.reporter_details}
              assigneeDetails={issue.assignee_details}
              getIssues={getIssues}
              commentsLength={issue.comments.length}
            />
          ))
        ) : (
          <Card
            style={{
              padding: "15px",
              margin: "10px",
              borderRadius: "15px",
            }}
            variant="outlined"
          >
            No Issues Assigned.
          </Card>
        )}
      </div>
      <div className="pagination-container">
        <Pagination
          count={totalPages.assigned}
          page={page.assigned}
          onChange={handleAssignedPageChange}
          variant="outlined"
          shape="rounded"
        />
      </div>

      <hr className="divider2" />

      <br />

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
  );
}
