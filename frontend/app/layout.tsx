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
        <NavBar navButtonProps={[
          {text: "Home", onClick: () => router.push("/")},
          {text: "Login", onClick: () => router.push("/login")},
        ]}/>
        {children}
      </body>
    </html>
  );
}
