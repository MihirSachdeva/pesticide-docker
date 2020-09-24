import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ColorSwatches from "./TagColorSwatches";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const FormDialog = (props) => {
  const handleClose = (choice = false) => {
    props.confirmFormDialog(props.action, choice, props.data, fields, options);
    props.closeFormDialog();
  };

  const [fields, setFields] = React.useState(props.fields);
  const [options, setOptions] = React.useState(props.options);
  const [colorSwatchesType, setColorSwatchesType] = React.useState(
    props.colorSwatchesType
  );
  const handleFieldChange = (event) => {
    let fieldName = event.target.name;
    let fieldValue = event.target.value;
    setFields((prevFields) => {
      let index = prevFields.findIndex((field) => field.name == fieldName);
      let newFields = [...prevFields];
      newFields[index].value = fieldValue;
      return newFields;
    });
  };

  React.useEffect(() => {
    setFields(props.fields);
    setColorSwatchesType(props.colorSwatchesType);
    setOptions(props.options);
  }, [props]);

  const [anchorOptionsEl, setAnchorOptionsEl] = React.useState(null);

  const handleOptionsClick = (event) => {
    setAnchorOptionsEl(event.currentTarget);
  };
  const handleOptionsClose = () => {
    setAnchorOptionsEl(null);
  };
  const handleOptionsChange = (event) => {
    let optionName = event.target.name;
    let optionValue = event.target.value;
    setOptions((prevOptions) => {
      let index = prevOptions.findIndex((option) => option.name == optionName);
      let newOptions = [...prevOptions];
      newOptions[index].value = optionValue;
      return newOptions;
    });
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => {
          handleClose(false);
        }}
        aria-labelledby="form-dialog-title"
        className="alert-dialog"
      >
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.description}</DialogContentText>
          {["add_status", "edit_status"].includes(props.action) && (
            <>
              <Typography className="form-label">Preview</Typography>
              <Button
                className="project-issue-status-button"
                style={{
                  backgroundColor:
                    fields && fields[1] && fields[1].value.length > 1
                      ? fields[1].value
                      : "gray",
                }}
              >
                {fields && fields[0] && fields[0].value.length > 1
                  ? fields[0].value
                  : "Status text"}
              </Button>
            </>
          )}
          {["add_tag", "edit_tag"].includes(props.action) && (
            <>
              <Typography className="form-label">Preview</Typography>
              <Button
                style={{
                  textTransform: "none",
                  fontSize: "17px",
                  width: "fit-content",
                  margin: "10px auto",
                }}
                className="project-issue-tag issue-button-filled-outline"
              >
                <div
                  style={{
                    backgroundColor:
                      fields && fields[1] && fields[1].value.length > 1
                        ? fields[1].value
                        : "gray",
                  }}
                  className="tag-color"
                ></div>
                <span>
                  {fields && fields[0] && fields[0].value.length > 1
                    ? fields[0].value
                    : "Tag text"}
                </span>
              </Button>
            </>
          )}
          {fields &&
            fields != [] &&
            fields.map((field) => (
              <>
                <Typography className="form-label">
                  {field.title}
                  {field.is_required && "*"}
                </Typography>
                <TextField
                  name={field.name}
                  value={field.value}
                  onChange={handleFieldChange}
                  style={{
                    padding: "0 5px",
                    margin: "5px 0 10px 0",
                    borderRadius: "4px",
                    fontWeight: "600",
                    backgroundColor: props.bgColor,
                    color: field.value,
                  }}
                />
                {field && field.name === "color" && (
                  <input
                    type="color"
                    name={field.name}
                    value={field.value}
                    onChange={handleFieldChange}
                  />
                )}
              </>
            ))}
          {options &&
            options != [] &&
            options.map((option) => (
              <>
                <Typography className="form-label">
                  {option.title}
                  {option.is_required && "*"}
                </Typography>
                <Select
                  labelId="single-select-outlined-label"
                  id="single-select-outlined"
                  className="custom-form-selection-outline"
                  style={{
                    maxWidth: "250px",
                    maxHeight: "40px",
                    backgroundColor: props.bgColor,
                    textAlign: "left",
                  }}
                  value={option.value}
                  onChange={handleOptionsChange}
                  name="status_type"
                >
                  {option.choices &&
                    option.choices.map((choice) => (
                      <MenuItem
                        onClick={handleOptionsClose}
                        value={choice.value}
                      >
                        {choice.display_name}
                      </MenuItem>
                    ))}
                </Select>
              </>
            ))}
          {props.showColorSwatches && (
            <ColorSwatches type={colorSwatchesType} />
          )}
        </DialogContent>
        <hr className="divider2 divider-thin" />
        <DialogActions>
          <Button
            onClick={() => {
              handleClose(false);
            }}
            color="secondary"
            className="alert-action-button"
          >
            {props.cancel}
          </Button>
          <div className="divider-vertical"></div>
          <Button
            onClick={() => {
              handleClose(true);
            }}
            color="secondary"
            className="alert-action-button"
          >
            {props.confirm}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    bgColor: ["dark", "solarizedDark", "palpatine"].includes(state.theme.theme)
      ? "rgb(0 0 0 / 28%)"
      : "rgb(0 0 0 / 15%)",
  };
};

export default withRouter(connect(mapStateToProps, null)(FormDialog));
