import React from "react";
import { Button } from "@material-ui/core";
import axios from "axios";
import { Link } from "react-router-dom";

import Avatar from "./Avatar";
import * as api_links from "../APILinks";

function MemberButton(props) {
  const [userInfo, setUserInfo] = React.useState({});

  React.useEffect(() => {
    axios
      .get(api_links.API_ROOT + `users/${props.user}/`)
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => console.log(err));
  }, [props.user]);

  return (
    <Link
      to={userInfo.enrollment_number && "/users/" + userInfo.enrollment_number}
      style={{ height: "40px" }}
    >
      <Button variant="outlined" className="project-member-button">
        {userInfo.display_picture ? (
          <Avatar
            src={userInfo.display_picture}
            className="project-issue-reported-by-image"
            type="image"
            alt={userInfo.name}
          />
        ) : (
          <Avatar
            className="project-issue-reported-by-image"
            name={userInfo.name}
            type="name"
          ></Avatar>
        )}
        &nbsp;
        <span style={{ whiteSpace: "nowrap" }}>{userInfo.name}</span>
      </Button>
      &nbsp;&nbsp;
    </Link>
  );
}

export default MemberButton;
