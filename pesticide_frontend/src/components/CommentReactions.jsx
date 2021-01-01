import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import Grow from "@material-ui/core/Grow";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Link, withRouter, Redirect } from "react-router-dom";

const isMobile = window.innerWidth < 850;

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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CommentReactions(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    props.handleModalClose();
  };

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        TransitionComponent={Grow}
        transitionDuration={{
          enter: 100,
          exit: 100,
        }}
        className={
          !isMobile
            ? "modal-rounded comment-reactions-modal"
            : "comment-reactions-modal"
        }
        maxWidth="xl"
      >
        <DialogTitle id="responsive-dialog-title" className="modal-title">
          <Button
            className="btn-filled-small btn-filled-bg-transparent btn-round"
            onClick={handleClose}
          >
            <CloseRoundedIcon />
          </Button>
          Comment reactions
        </DialogTitle>

        <DialogContent style={{ padding: "5px 10px", minHeight: "400px" }}>
          <div className={classes.root}>
            <AppBar
              position="static"
              className="comment-reactions-tabs"
              scrollButtons="auto"
            >
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
              >
                <Tab label="👍 7" {...a11yProps(0)} />
                <Tab label="😄 2" {...a11yProps(1)} />
                <Tab label="👀 1" {...a11yProps(2)} />
                <Tab label="👀 1" {...a11yProps(2)} />
                <Tab label="👀 1" {...a11yProps(2)} />
                <Tab label="👀 1" {...a11yProps(2)} />
                <Tab label="👀 1" {...a11yProps(2)} />
                <Tab label="👀 1" {...a11yProps(2)} />
                <Tab label="👀 1" {...a11yProps(2)} />
                <Tab label="👀 1" {...a11yProps(2)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <div className="comment-sender">
                <div className="comment-sender-image">
                  <img
                    src="/sunglasses.svg"
                    alt="Reacter"
                    className="commentor-img"
                  />
                </div>
                <Typography className="commentor-name">
                  <Link to={`/users/19121018`}>
                    {/* {!props.isSentByCurrentUser
                      ? props.comment.commentor_details.name
                      : "You"} */}
                    Mihir Sachdeva
                  </Link>
                </Typography>
              </div>
              <br />
              <div className="comment-sender">
                <div className="comment-sender-image">
                  <img
                    src="/sunglasses.svg"
                    alt="Reacter"
                    className="commentor-img"
                  />
                </div>
                <Typography className="commentor-name">
                  <Link to={`/users/19121018`}>
                    {/* {!props.isSentByCurrentUser
                      ? props.comment.commentor_details.name
                      : "You"} */}
                    Mihir Sachdeva
                  </Link>
                </Typography>
              </div>
              <br />
              <div className="comment-sender">
                <div className="comment-sender-image">
                  <img
                    src="/sunglasses.svg"
                    alt="Reacter"
                    className="commentor-img"
                  />
                </div>
                <Typography className="commentor-name">
                  <Link to={`/users/19121018`}>
                    {/* {!props.isSentByCurrentUser
                      ? props.comment.commentor_details.name
                      : "You"} */}
                    Mihir Sachdeva
                  </Link>
                </Typography>
              </div>
              <br />
              <div className="comment-sender">
                <div className="comment-sender-image">
                  <img
                    src="/sunglasses.svg"
                    alt="Reacter"
                    className="commentor-img"
                  />
                </div>
                <Typography className="commentor-name">
                  <Link to={`/users/19121018`}>
                    {/* {!props.isSentByCurrentUser
                      ? props.comment.commentor_details.name
                      : "You"} */}
                    Mihir Sachdeva
                  </Link>
                </Typography>
              </div>
              <br />
            </TabPanel>
            <TabPanel value={value} index={1}>
              Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
              Item Three
            </TabPanel>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
