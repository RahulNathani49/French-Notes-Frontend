import React from "react";
import "../index.css";
function Footer() {
    return (
        <footer style={footerStyle}>
            <p>© {new Date().getFullYear()} French Notes. All rights reserved.</p>
        </footer>
    );
}

const footerStyle = {
   position: "fixed",
    bottom:"0",
    padding : "15px 0"
};

export default Footer;
