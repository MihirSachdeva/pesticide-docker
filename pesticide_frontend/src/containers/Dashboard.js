import React from "react";
import { PieChart, BarChart } from "react-chartkick";
import "chart.js";
import { Card, Typography, Button, useMediaQuery } from "@material-ui/core";
import axios from "axios";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import * as api_links from "../APILinks";
import UtilityComponent from "../components/UtilityComponent";
import HEADER_NAV_TITLES from "../header_nav_titles";

const Dashboard = (props) => {
  const isMobile = useMediaQuery("(max-width: 500px)");
  const userId = localStorage.getItem("id");
  const [name, setName] = React.useState("");
  const [enrNo, setEnrNo] = React.useState("");
  const [projectsStatusData, setProjectsStatusData] = React.useState([]);
  const [topReporters, setTopReporters] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(api_links.API_ROOT + `users/${userId}/`)
      .then((res) => {
        setName(res.data.name.split(" ")[0]);
        setEnrNo(res.data.enrollment_number);
      })
      .catch((err) => console.log(err));

    axios
      .get(api_links.API_ROOT + "issuestatustally/")
      .then((res) => {
        let issuesData = [];
        let resolved = 0,
          pending = 0,
          closed = 0;
        res.data.forEach((status) => {
          switch (status.type) {
            case "Pending":
              pending += status.number_of_issues;
              break;
            case "Resolved":
              resolved += status.number_of_issues;
              break;
            case "Closed":
              closed += status.number_of_issues;
              break;
          }
          issuesData = [
            ["Pending", pending],
            ["Resolved", resolved],
            ["Closed", closed],
          ];
        });
        setProjectsStatusData(issuesData);
      })
      .catch((err) => console.log(err));

    axios
      .get(api_links.API_ROOT + "topdebuggers/")
      .then((res) => {
        let topDebuggers = [];
        topDebuggers = res.data.map((user) => [
          user.user_name,
          user.num_issues,
        ]);
        setTopReporters(topDebuggers);
      })
      .catch((err) => console.log(err));
  }, [props.isAuthenticated]);

  const bugQuoteList = [
    "Never allow the same bug to bite you twice.",
    "'It's not a bug - it's an undocumented feature.'",
    "Let he who has a bug free software cast the first stone.",
    "Debugging : Removing Bugs :: Programming : Adding Bugs",
    "Testing can be used to show the presence of bugs, but never to show their absence!",
  ];

  const starWarsQuoteList = [
    `"It’s not my fault.” – Han Solo`,
    `“Do. Or do not. There is no try.” – Yoda`,
    `“I find your lack of faith disturbing.” – Darth Vader`,
    `“Your eyes can deceive you. Don’t trust them.” – Obi-Wan Kenobi`,
    `“Your focus determines your reality.” – Qui-Gon Jinn`,
  ];

  return (
    <div className="dashboard-cards">
      <UtilityComponent title={HEADER_NAV_TITLES.DASHBOARD} page="HOME" />
      <Card className="dashboard-hero-welcome-card">
        <div
          className="dashboard-hero-image image-shadow"
          style={{
            backgroundImage:
              props.theme != "palpatine"
                ? "url(./fix.svg)"
                : "url(./jedi_order.png",
          }}
        ></div>
        <div className="dashboard-hero-text">
          <div>
            <Typography className="dashboard-hero-welcome">
              {props.theme != "palpatine" ? "Pesticide" : "Millenium Falcon"}
            </Typography>
            <hr className="divider" />
            <Typography className="dashboard-hero-quote">
              {props.theme != "palpatine"
                ? bugQuoteList[Math.floor(Math.random() * bugQuoteList.length)]
                : starWarsQuoteList[
                Math.floor(Math.random() * starWarsQuoteList.length)
                ]}
            </Typography>
            <div className="dashboard-hero-buttons">
              <Link to="/issues">
                <Button
                  className="btn-filled-small"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {!isMobile && "View "}
                  {"Issues"}
                </Button>
              </Link>
              <Link to="/projects">
                <Button
                  className="btn-filled-small"
                  style={{ whiteSpace: "nowrap" }}
                >
                  {!isMobile && "Browse "}
                  {"Projects"}
                </Button>
              </Link>
              <Link to={`/users/${enrNo}`}>
                <Button
                  className="btn-filled-small"
                  style={{ whiteSpace: "nowrap" }}
                >
                  My Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
      <div className="data-charts-top-container">
        <Card className="donut-chart-card">
          <center>
            <Typography style={{ fontSize: "20px" }}>
              <strong>
                Issues at a Glance
                <hr className="divider" />
              </strong>
            </Typography>
            <p style={{ fontWeight: "400" }}>Status tally of all issues.</p>
          </center>
          <PieChart
            donut={true}
            colors={
              props.theme != "palpatine"
                ? ["#3b7fff", "#00ea3f", "#ff0021"]
                : ["#4f0000", "#960000", "#ff0000"]
            }
            data={projectsStatusData}
            style={{
              margin: "10px",
            }}
          />
        </Card>

        <Card className="donut-chart-card">
          <center>
            <Typography style={{ fontSize: "20px" }}>
              <strong>
                {"Top "}
                {props.theme != "palpatine" ? "Debuggers" : "Jedi"}
                <hr className="divider" />
              </strong>
            </Typography>
            <p style={{ fontWeight: "400" }}>
              Users who have reported highest number of issues.
            </p>
          </center>
          <BarChart
            colors={props.theme != "palpatine" ? ["3b7fff"] : ["ff0000"]}
            data={topReporters}
          />
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    theme: state.theme.theme || "default",
  };
};

export default withRouter(connect(mapStateToProps, null)(Dashboard));
