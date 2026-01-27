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
          <div style={{position: 'relative', display: "flex", flexDirection: "column", height: "100vh", alignItems: "center"}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 0}}>
              { (currentLink !== "login" && currentLink) && 
                <NavBar 
                  navButtonProps={[
                  {
                    text: "HOME", 
                    state: currentLink === "home" ? "selected" : "default",
                    onClick: () => {
                      setCurrentLink("home")
                      router.push("/")
                    }
                  },
                  {
                    text: "BROWSE PRESETS", 
                    state: currentLink === "browse" ? "selected" : "default",
                    onClick: () => {
                      setCurrentLink("browse")
                      router.push("/browse-presets")
                    }
                  },
                ]}
                  loginButtonProps={
                    {
                      text: "LOGIN", 
                      onClick: () => {
                        setCurrentLink("login")
                        router.push("/login")
                      }
                    }
                  }
                />}
            </div>
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
