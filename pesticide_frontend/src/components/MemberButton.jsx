import React from "react";
import { Button } from "@material-ui/core";
import axios from 'axios';
import { Link } from 'react-router-dom';

import * as api_links from '../APILinks';

function MemberButton(props) {

  const [userInfo, setUserInfo] = React.useState({});

  React.useEffect(() => {
    axios.get(api_links.API_ROOT + `users/${props.user}/`)
      .then(res => {
        setUserInfo(res.data);
      })
      .catch(err => console.log(err));
  }, [props.user]);

  return (
    <Link to={userInfo.enrollment_number && '/users/' + userInfo.enrollment_number} style={{height: '40px'}}>
      <Button 
      variant="outlined" 
      className="project-member-button">
        <div className="project-issue-reported-by-image">
          <img src={userInfo.display_picture || "../sunglasses.svg"} alt="Member" />
        </div>
        &nbsp;
        <span style={{whiteSpace: 'nowrap'}}>{userInfo.name}</span>
      </Button>&nbsp;&nbsp;
    </Link>
  )
}

export default MemberButton;