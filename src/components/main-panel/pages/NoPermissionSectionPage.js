import React from "react";
import Fade from '@material-ui/core/Fade';

export default function NoPermissionSectionPage() {

  return (
    <Fade in={true} timeout={500}>
      <div>
        <br />
        <br />
        <br />
        <h2>You don't have permission to access this section.</h2>
      </div>
    </Fade>
  );
}