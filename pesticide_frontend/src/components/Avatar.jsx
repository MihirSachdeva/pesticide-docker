import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DefaultAvatar from "@material-ui/core/Avatar";

const Avatar = (props) => {
  const stringToHslColor = (str = "Default Color", s = 60, l = 80) => {
    var hash = 0;
    if (!props.darkTheme) {
      s = 70;
      l = 70;
    }
    
    if (props.palpatine) {
      return "#e04034";
    }

    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return "hsl(" + h + ", " + s + "%, " + l + "%)";
  };

  let styles = {
    backgroundColor: stringToHslColor(props.name),
  };
  if (props.style) {
    styles = {
      ...styles,
      ...props.style,
    };
  }

  switch (props.type) {
    case "image":
      return (
        <DefaultAvatar
          className={props.className}
          src={props.src || "/sunglasses.svg"}
          alt={props.alt || "User Avatar"}
          style={styles}
        />
      );
    case "name":
      return (
        <DefaultAvatar className={props.className} style={styles}>
          {props.name &&
            props.name
              .split(" ")
              .map((x) => x[0])
              .join("")}
        </DefaultAvatar>
      );
    default:
      return (
        <DefaultAvatar
          className={props.className}
          src={props.src || "/sunglasses.svg"}
        />
      );
  }
};

const mapStateToProps = (state) => {
  return {
    darkTheme:
      state.theme.theme == "dark" ||
      state.theme.theme == "solarizedDark" ||
      state.theme.theme == "palpatine",
    palpatine: state.theme.theme == "palpatine",
  };
};

export default withRouter(connect(mapStateToProps, null)(Avatar));
