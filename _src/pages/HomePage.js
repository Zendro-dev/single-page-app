import React from "react";
import Fade from '@material-ui/core/Fade';

export default function Home() {

  return (
    <Fade in={true} timeout={500}>
      <div>
        <br />
        <br />
        <br />
        <h2>Home</h2>
      </div>
    </Fade>
  );
}