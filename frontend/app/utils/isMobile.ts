"use client";
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 1032;
const PHONE_BREAKPOINT = 425;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
}

export function useIsPhone() {
  const [isPhone, setIsPhone] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const phone = window.innerWidth < PHONE_BREAKPOINT;
      setIsPhone(phone);
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isPhone;
}
