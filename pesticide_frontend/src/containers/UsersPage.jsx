import React from "react";
import { Card, Typography } from "@material-ui/core";

import UserCard from "../components/UserCard";
import * as api_links from "../APILinks";
import UtilityComponent from "../components/UtilityComponent";
import HEADER_NAV_TITLES from "../header_nav_titles";
import TitleCard from "../components/TitleCard";

import axios from "axios";

const UsersPage = (props) => {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(api_links.API_ROOT + "users/")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <UtilityComponent title={HEADER_NAV_TITLES.USERS} page="USERS" />

      <TitleCard title="Users" />
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
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default UsersPage;
