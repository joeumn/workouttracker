"use client";

import { useState } from "react";
import { Dashboard } from "@/components/dashboard";
import { LandingPage } from "@/components/landing-page";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  if (isLoggedIn) {
    return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
  }
  
  return <LandingPage onLogin={() => setIsLoggedIn(true)} />;
}
