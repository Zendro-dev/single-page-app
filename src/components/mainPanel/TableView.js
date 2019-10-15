import React from "react";

/*
  Material-UI components
*/
import Fade from '@material-ui/core/Fade';

export default function TableView() {

    return (
        <Fade in={true} timeout={500}>
            <div>
                <br />
                <br />
                <br />
                <h2>Table</h2>
                <p>Table</p>
                <p>Table</p>
            </div>
        </Fade>
    );
}
