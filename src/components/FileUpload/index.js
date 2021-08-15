import React from "react";
import { Input, Label } from "reactstrap";

const FileUpload = ({ label }) => {
  return (
    <div>
      {label && (
        <Label htmlFor="formFileSm" className="form-label">
          {label}
        </Label>
      )}
      <Input
        className="form-control"
        id="formFileSm"
        type="file"
      />
    </div>
  );
};

export default FileUpload;
