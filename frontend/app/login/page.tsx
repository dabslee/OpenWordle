"use client";
import React, {useState, useEffect} from 'react'
import { useRouter } from "next/navigation"
import { loginHelper } from "../utils/authApi";
import type { AuthResponse } from "../utils/types";
import Container from '../components/Container/Container'
import Text from '../components/Text'
import Field from '../components/Field/Field'
import Button from '../components/Button/Button';
import { useApp } from '../utils/AppContext';
import SnackBar from '../components/SnackBar/SnackBar';

const login = () => {
  const [user, setUser] = useState<string>("")
  const [pass, setPass] = useState<string>("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarKey, setSnackbarKey] = useState(0)
  const { setIsLoggedIn } = useApp();

  const router = useRouter();

const handleLogin = async () => {
  if (loading) return;
  setLoading(true);
  setError(null);

  try {
    const response = await loginHelper(user, pass); // only call once

      if (!response.success) {
        // Login failed
        setError(response.message || "Invalid username or password");
        return; // stop here
      }

      // Login successful
      console.log("Logged in via session");
      setIsLoggedIn(true);
      router.push("/");

    } catch (err: any) {
      // Network or unexpected errors
      console.error(err);
      setError(err.message || "Unknown error");
      setSnackbarKey((prev) => prev + 1)
    } finally {
      setLoading(false);
    }
  };

  // Listen for enter key down
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleLogin();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={"flex justify-center align-center bg-peach"} style={{flex: 1, width: "100%"}}>
      <Container style={{padding: 0, position: "relative", width: "832px"}}>
        <div className={"col gap-lg align-center bg-primary border-primary br-lg pad-x-xxxl pad-y-xxl"} style={{boxSizing: "border-box", width: "100%", zIndex: 10}}>
          <Text className={'text-headline-h1'}>Login</Text>
          <div className={"col gap-xxl align-center"} style={{width: "100%"}}>
            <div className={"col gap-md"} style={{width: "100%"}}>
              <Field 
                value={user}
                placeholder={"Username"}
                onChange={setUser}
                variant={"outline"}
              />
              <Field 
                value={pass}
                placeholder={"Password"}
                onChange={setPass}
                variant={"outline"}
              />
              <div className="flex justify-end">
                <Button text="Forgot password?" variant="link" size="small"/>
              </div>
            </div>
            <div className={"col gap-md"} style={{width: "100%"}}>
              <Button 
                text="Login"
                size="large"
                onClick={handleLogin}
                showDropShadow={false}
              />
              <Button 
                text="Register"
                size="large"
                showDropShadow={false}
                variant="secondary"
              />
            </div>
          </div>
          </div>
          <div className="border-primary br-lg" style={{position: "absolute", left: 16, right: -16, top: 16, bottom: -16}}/>
          {error && (
            <SnackBar
              key={snackbarKey}
              message={error}
            />
          )}
      </Container>
    </div>
  )
}

export default login