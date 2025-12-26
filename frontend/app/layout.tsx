"use client";
import { usePathname, useRouter } from "next/navigation";
import NavBar from "./components/NavBar/NavBar";
import { useState, useEffect } from "react";
import { getCurrentUser } from "./utils/authApi";
import { User } from "./utils/types";
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  console.log(pathname)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const router = useRouter();
  const [currentLink, setCurrentLink] = useState<"home" | "login" | "browse">()
  
  useEffect(() => {
    switch(pathname) {
      case "/": setCurrentLink("home"); break;
      case "/login": setCurrentLink("login"); break;
      case "/browse-presets": setCurrentLink("browse"); break;
    }
  }, [pathname])
  return ( 
    <html>
      <body>
        <div style={{display: "flex", flexDirection: "column", height: "100vh", alignItems: "center"}}>
          { <NavBar 
            navButtonProps={[
            {
              text: "Home", 
              state: currentLink === "home" ? "selected" : "default",
              onClick: () => {
                setCurrentLink("home")
                router.push("/")
              }
            },
            {
              text: "Browse presets", 
              state: currentLink === "browse" ? "selected" : "default",
              onClick: () => {
                setCurrentLink("browse")
                router.push("/browse-presets")
              }
            },
          ]}
            isLoggedIn = {!(loading || user === null)}
            loginButtonProps={
              {
                text: "Login", 
                onClick: () => {
                  setCurrentLink("login")
                  router.push("/login")
                }
              }
            }
          />}
          {children}
        </div>
      </body>
    </html>
  );
}
