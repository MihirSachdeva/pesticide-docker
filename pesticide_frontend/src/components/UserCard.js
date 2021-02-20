import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import Skeleton from "@material-ui/lab/Skeleton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Link } from "react-router-dom";

import designation from "../constants/designation";
import year from "../constants/year";
import Avatar from "./Avatar";

export default function UserCard(props) {
  const isMobile = useMediaQuery("(max-width: 700px)");

  return (
    <Card
      // style={{
      //   borderRadius: "15px",
      //   padding: '7px 0'
      // }}
      className="user-card"
    >
      <CardHeader
        avatar={
          <Link to={`/users/${props.enrollment_number}`}>
            {props.display_picture ? (
              <Avatar
                src={props.display_picture}
                type="image"
                alt={props.name}
                style={{
                  width: isMobile ? "100px" : "120px",
                  height: isMobile ? "100px" : "120px",
                  margin: "14px 0",
                  fontSize: "3.3rem"
                }}

              />
            ) : (
                <Avatar
                  name={props.name}
                  type="name"
                  style={{
                    width: isMobile ? "100px" : "120px",
                    height: isMobile ? "100px" : "120px",
                    margin: "14px 0",
                    fontSize: "3.3rem"
                  }}
                ></Avatar>
              )}
          </Link>
        }
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: isMobile ? "17px" : "20px", fontWeight: "700" }}>
              {!props.name ? (
                <Skeleton width={100} height={50} animation="wave" />
              ) : (
                  <Link to={"/users/" + props.enrollment_number}>
                    {props.name}
                  </Link>
                )}
            </div>
          </div>
        }
        subheader={
          <>
            <div style={{ fontWeight: "600" }}>
              <span>
                {props.isAdmin && <strong>Admin</strong>}
              </span>
              <br />
              {props.current_year && (
                <>
                  <span>{designation(props.current_year)}</span>
                  <br />
                </>
              )}
              <span>
                {props.current_year ? (
                  <>
                    <span>{year(props.current_year)}</span>
                    <br />
                  </>
                ) : (
                    <Skeleton width={140} animation="wave" />
                  )}
              </span>
              <br />
            </div>
          </>
        }
      />
      {props.fromAdminPage && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            marginBottom: "15px",
          }}
        >
          <Button
            className={
              props.isAdmin
                ? "btn-filled-small btn-filled-small-error"
                : "btn-filled-small btn-filled-small-success"
            }
            style={{
              fontWeight: "900",
              textTransform: "none",
            }}
            onClick={() => {
              !props.isAdmin
                ? props.openAlert(
                  "make_admin",
                  `Make ${props.name} an admin?`,
                  "All admins can delete and update status of issues and projects, disable any user and even revoke admin status from other admins. All admins will be notified by email.",
                  "Cancel",
                  "Confirm",
                  {
                    id: props.id,
                    field: "is_master",
                    bool: true,
                  }
                )
                : props.openAlert(
                  "revoke_admin",
                  `Revoke admin status of ${props.name}?`,
                  "All admins will be notified by email.",
                  "Cancel",
                  "Confirm",
                  {
                    id: props.id,
                    field: "is_master",
                    bool: false,
                  }
                );
            }}
          >
            {props.isAdmin ? "Remove Admin" : "Make Admin"}
          </Button>
          <Button
            className={
              props.isActive
                ? "btn-filled-small btn-filled-small-error"
                : "btn-filled-small btn-filled-small-success"
            }
            style={{
              fontWeight: "900",
              textTransform: "none",
            }}
            onClick={() => {
              !props.isActive
                ? props.openAlert(
                  "enable_user",
                  `Enable ${props.name} to use Pesticide?`,
                  `${props.name} will be able to log in again, report issues, make comments and create/be a member of projects.`,
                  "Cancel",
                  "Enable",
                  {
                    id: props.id,
                    field: "is_active",
                    bool: true,
                  }
                )
                : props.openAlert(
                  "disable_user",
                  `Disable ${props.name} to use Pesticide?`,
                  `${props.name} will NOT be able to log in again, report issues, make comments and create/be a member of projects.`,
                  "Cancel",
                  "Disable",
                  {
                    id: props.id,
                    field: "is_active",
                    bool: false,
                  }
                );
            }}
          >
            {props.isActive ? "Disable" : "Enable"}
          </Button>
        </div>
      )}
    </Card>
  );
}
