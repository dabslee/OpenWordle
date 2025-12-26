"use client";
import { usePathname, useRouter } from "next/navigation";
import NavBar from "./components/NavBar/NavBar";
import { useState, useEffect } from "react";
import './globals.css';
import { AppProvider } from "./utils/AppContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  console.log(pathname)

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
        <AppProvider>
          <div style={{display: "flex", flexDirection: "column", height: "100vh", alignItems: "center"}}>
            { (currentLink !== "login" && currentLink) && <NavBar 
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
        </AppProvider>
      </body>
    </html>
  );
}
