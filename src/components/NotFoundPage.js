import React from "react";
import Fade from '@material-ui/core/Fade';

export default function NotFoundPage() {

    return (
        <Fade in={true} timeout={500}>
            <div>
                <br />
                <br />
                <br />
                <h2>404: Page not found</h2>
                <p>404</p>
                <p>404</p>
            </div>
        </Fade>
    );
}
