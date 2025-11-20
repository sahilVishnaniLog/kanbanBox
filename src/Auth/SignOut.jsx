import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../Auth/firebaseConfig";
import { Button } from "@mui/material";
export default function SignOut() {
  return (
    <Button onClick={() => signOut(auth).then(() => window.location.reload())}>
      {" "}
      SignOut
    </Button>
  );
}
