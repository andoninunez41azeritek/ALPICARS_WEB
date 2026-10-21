"use client";

import { SiteProvider } from "./SiteProvider";
import MapBackdrop from "./MapBackdrop";
import Header from "./Header";
import Hero from "./Hero";
import Banner from "./Banner";
import HowItWorks from "./HowItWorks";
import About from "./About";
import Services from "./Services";
import Calculator from "./Calculator";
import Models from "./Models";
import Faq from "./Faq";
import LeadForm from "./LeadForm";
import Footer from "./Footer";
import CarQuiz from "./CarQuiz";
import Motion from "./Motion";
import FloatingWhatsApp from "./FloatingWhatsApp";

export default function HomePage() {
  return (
    <SiteProvider>
      <MapBackdrop />
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">
        <Hero />
        <Banner />
        <HowItWorks />
        <About />
        <Services />
        <Calculator />
        <Models />
        <Faq />
        <LeadForm />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <CarQuiz />
      <Motion />
    </SiteProvider>
  );
}
