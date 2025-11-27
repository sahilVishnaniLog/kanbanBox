import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { useState } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { ConstructionOutlined } from "@mui/icons-material";

// signUp function
async function signUp(email, password, setError, setLoading) {
    try {
        setError(""); // Clear previous errors
        setLoading(true); // Start loading
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length > 0) {
            setError("Email already in use");
            setLoading(false);
            return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User created successfully");
        await addDoc(collection(db, "users"), {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
        });
        // Optionally: Redirect or show success
        setLoading(false);
    } catch (err) {
        setLoading(false);
        let errorMessage = "Something went wrong. Please try again.";
        if (err.code === "auth/too-many-requests") {
            errorMessage = "Too many requests. Wait 1 hour or try a different network. (Firebase limit: 100 sign-ups/hour per IP)";
        } else if (err.code === "auth/weak-password") {
            errorMessage = "Password must be at least 6 characters.";
        } else if (err.code === "auth/email-already-in-use") {
            errorMessage = "Email already in use.";
        } else {
            errorMessage = err.message;
        }
        setError(errorMessage);
        console.log(err);
    }
}

export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // New: Track submission

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formElement = document.getElementById("auth-form");
        const formData = new FormData(formElement);

        const dataObject = Object.fromEntries(formData.entries());
        console.log(dataObject);
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }
        await signUp(email, password, setError, setLoading);
    };

    return (
        <>
            <form id="auth-form" onSubmit={handleSubmit}>
                <TextField name="email" label="Email" type="email" value={email} fullWidth margin="normal" disabled={loading} />
                <TextField name="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" disabled={loading} />
                <Button type="submit" variant="contained" fullWidth disabled={loading || !email || !password}>
                    {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}
            </form>
        </>
    );
}
