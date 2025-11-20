import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react"; // Added useEffect; consolidated imports
import { TextField, Button, Typography, CircularProgress } from "@mui/material";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Move listener to useEffect for one-time setup
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user); // Simplified: true if user exists
    });
    return () => unsubscribe(); // Cleanup: Unsubscribe on unmount
  }, []); // Empty deps: Runs once on mount

  async function signIn(email, password, setError, setLoading) {
    try {
      setError("");
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed in successfully");
      // Listener will update isSignedIn; optionally redirect here
      setLoading(false);
    } catch (err) {
      setLoading(false);
      let errorMessage = "Something went wrong. Please try again.";
      if (err.code === "auth/wrong-password") {
        errorMessage = "Invalid password";
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.log(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    await signIn(email, password, setError, setLoading); // Await for proper flow
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          disabled={loading}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !email || !password}
        >
          {loading ? <CircularProgress size={24} /> : "Sign In"}
        </Button>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
      </form>
      <Typography>
        {isSignedIn ? "You are signed in" : "You are not signed in"}
      </Typography>
    </>
  );
}
