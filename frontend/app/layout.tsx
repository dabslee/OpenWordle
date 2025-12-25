"use client";
import { useRouter } from "next/navigation";
import NavBar from "./components/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <html>
      <body>
        <div style={{display: "flex", flexDirection: "column", height: "100vh", alignItems: "center"}}>
          <NavBar navButtonProps={[
            {text: "Home", onClick: () => router.push("/")},
            {text: "Login", onClick: () => router.push("/login")},
          ]}/>
          {children}
        </div>
      </body>
    </html>
  );
}
