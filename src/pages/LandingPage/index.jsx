import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import HeroSection from "@/components/LandingPage/HeroSection";
import AdvantageSection from "@/components/LandingPage/AdvantageSection";
import HowItWorks from "@/components/LandingPage/HowItWorks";
import TemplateCatalogue from "@/components/LandingPage/TemplateCatalogue";
import BottomCTA from "@/components/LandingPage/BottomCTA";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  usePageTitle("Landing Page");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const targetId = location.state.scrollTo;
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  return (
    <>
      <HeroSection />
      <AdvantageSection />
      <HowItWorks />
      <TemplateCatalogue />
      <BottomCTA />
      <Footer />
    </>
  );
}




