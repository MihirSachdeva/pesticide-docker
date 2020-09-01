import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import * as api_links from "../APILinks";
import Axios from "axios";

export default function ColorSwatches(props) {
  const [colors, setColors] = React.useState([]);
  React.useEffect(() => {
    Axios.get(api_links.API_ROOT + props.type + "/")
      .then((res) => {
        setColors(res.data.colors);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      style={{
        display: "grid",
        justifyContent: "center",
        alignContent: "center",
        gridTemplateColumns: "auto auto auto auto auto auto",
        padding: "15px",
        gridGap: "10px",
      }}
    >
      {colors != [] &&
        colors.map((color) => (
          <Tooltip title={color} placement="bottom" interactive>
            <div
              style={{
                height: "25px",
                width: "25px",
                borderRadius: "4px",
                backgroundColor: color,
                border: "2px solid #ffffff1c",
              }}
            ></div>
          </Tooltip>
        ))}
    </div>
  );
}
