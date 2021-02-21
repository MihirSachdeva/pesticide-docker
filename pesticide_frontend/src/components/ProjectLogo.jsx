import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const ProjectLogo = (props) => {
  const stringToHslColor = (str = "", s = 80, l = 75) => {
    var hash = 0;
    if (!props.darkTheme) {
      s = 90;
      l = 69;
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

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      id="Capa_1"
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
      width={props.style.width}
      height={props.style.height}
      className={props.className || ""}
      style={props.style || null}
    >
      <g>
        <path
          style={{ fill: stringToHslColor(props.name) }}
          d="M407,512H105C47.103,512,0,464.897,0,407V105C0,47.103,47.103,0,105,0h302  c57.897,0,105,47.103,105,105v302C512,464.897,464.897,512,407,512z"
          data-original="#00C3FF"
          class="active-path"
          data-old_color="#00C3FF"
        />
        <path
          style={{ fill: stringToHslColor(props.name) }}
          d="M407,0H256v512h151c57.897,0,105-47.103,105-105V105C512,47.103,464.897,0,407,0z"
          data-original="#00AAF0"
          class=""
          data-old_color="#00AAF0"
        />
        <g>
          <path
            style={{ fill: "#FFFFFF" }}
            d="M157.649,394.515c-4.625,8.011-13.046,12.494-21.693,12.495c-4.239,0-8.531-1.077-12.458-3.344l0,0   c-11.938-6.892-16.043-22.212-9.151-34.15l4.917-8.516h57.735L157.649,394.515z"
            data-original="#FFFFFF"
            class=""
          />
          <path
            style={{ fill: "#FFFFFF" }}
            d="M110.5,341c-13.785,0-25-11.215-25-25s11.215-25,25-25h49.178l67.454-116.834l-18.281-31.664   c-6.892-11.938-2.788-27.258,9.15-34.151h0.001c11.938-6.892,27.258-2.786,34.15,9.151l3.848,6.665l3.848-6.664   c6.895-11.939,22.215-16.043,34.15-9.151c5.783,3.339,9.92,8.73,11.648,15.18c1.729,6.45,0.841,13.188-2.498,18.971L217.413,291   h54.079l28.868,50H110.5z"
            data-original="#FFFFFF"
            class=""
          />
        </g>
        <g>
          <path
            style={{ fill: "#FFFFFF" }}
            d="M401.5,341h-20.311l16.463,28.515c6.893,11.937,2.788,27.257-9.149,34.15   c-3.853,2.224-8.129,3.361-12.461,3.361c-2.172,0-4.356-0.285-6.511-0.863c-6.451-1.729-11.842-5.866-15.181-11.65l-86.804-150.348   l28.867-50L352.322,291H401.5c13.785,0,25,11.215,25,25S415.285,341,401.5,341z"
            data-original="#F2F2F2"
            class=""
            data-old_color="#F2F2F2"
          />
          <polygon
            style={{ fill: "#FFFFFF" }}
            points="256,291 256,341 300.36,341 271.493,291  "
            data-original="#F2F2F2"
            class=""
            data-old_color="#F2F2F2"
          />
          <path
            style={{ fill: "#FFFFFF" }}
            d="M305.646,123.531c-1.729-6.45-5.865-11.842-11.648-15.18c-11.936-6.892-27.256-2.789-34.15,9.151   L256,124.166l0,0v100l47.148-81.664C306.487,136.719,307.375,129.982,305.646,123.531z"
            data-original="#F2F2F2"
            class=""
            data-old_color="#F2F2F2"
          />
        </g>
      </g>
    </svg>
  );
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

export default withRouter(connect(mapStateToProps, null)(ProjectLogo));
