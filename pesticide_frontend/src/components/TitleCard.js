import React from "react";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const TitleCard = (props) => {
  const illustrationSrc = (title) => {
    let path = "../illustrations/";
    switch (title) {
      case "Users":
        return (path + "people.svg");
      case "Projects":
        return (path + "projects.svg");
      case "Issues":
        return (path + "issues.svg");
      case "Admin":
        return (path + "admin.svg");
      case "Settings":
        return (path + "settings.svg");
      default:
        return null;
    }
  }
  return (
    <>
    </>
    // <Card className="list-title-card">
    //   {/* <Typography className="list-title">{props.title}</Typography> */}
    //   {illustrationSrc(props.title) && <img src={illustrationSrc(props.title)} class="list-title-illustration" />}
    // </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    theme: state.theme.theme || "default",
  };
};

export default withRouter(connect(mapStateToProps, null)(TitleCard));
