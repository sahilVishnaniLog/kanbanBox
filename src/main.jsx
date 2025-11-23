import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import Auth from "./Auth/Auth.jsx";
import SignIn from "./Auth/SignIn.jsx";
import SignOut from "./Auth/SignOut.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
        {/* <Auth />
    <SignIn />
    <SignOut /> */}
    </StrictMode>
);
