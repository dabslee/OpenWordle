"use client";
import { usePathname, useRouter } from "next/navigation";
import NavBar from "./components/NavBar/NavBar";
import { useState, useEffect } from "react";
import './globals.css';
import { AppProvider } from "./utils/AppContext";
import { useIsMobile } from "./utils/isMobile";
import Loader from "./components/Loader/Loader";
import { usePreventScrollMobile } from "./utils/util";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  usePreventScrollMobile(); // stops scroll on mobile
  
  const pathname = usePathname();
  const router = useRouter();
  const [currentLink, setCurrentLink] = useState<"home" | "login" | "browse">();
  const isMobile = useIsMobile();

  const [showLoader, setShowLoader] = useState(true);

  // hide loader after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    switch(pathname) {
      case "/": setCurrentLink("home"); break;
      case "/login": setCurrentLink("login"); break;
      case "/browse-presets": setCurrentLink("browse"); break;
    }
  }, [pathname]);

  // while loader is active, render it

  return (
    <html>
      <body>
        <AppProvider>
          <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}>
            {(showLoader) ? <Loader /> : 
            <>
              <div style={{position: 'absolute', left: 0, right: 0, top: 0, zIndex: 10}}>
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
                    loginButtonProps={{
                      text: "LOGIN", 
                      onClick: () => {
                        setCurrentLink("login")
                        router.push("/login")
                      }
                    }}
                  />
                }
              </div>
              {children}
              </>
            }
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
