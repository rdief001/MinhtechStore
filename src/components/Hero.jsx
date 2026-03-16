import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import React, { useEffect, useState } from "react";
import { heroVideo, smallHeroVideo } from "../utils";

const Hero = ({ onBuySusClick }) => {
  const [videoSrc, setVideoSrc] = useState(
    window.innerWidth < 760 ? smallHeroVideo : heroVideo
  );

  useEffect(() => {
    const handleResize = () => {
      setVideoSrc(window.innerWidth < 760 ? smallHeroVideo : heroVideo);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useGSAP(() => {
    gsap.to("#hero", { opacity: 1, delay: 1.5 });
    gsap.to("#cta", { opacity: 1, delay: 1.5, y: -50 });
  }, []);

  return (
    <section className="w-full nav-height bg-black relative">
      <div className="h-5/6 w-full flex-center flex-col">
        <p id="hero" className="hero-title">
          MinhPhone 18
        </p>

        <div className="md:w-10/12 w-9/12">
          <video
            className="pointer-events-none"
            autoPlay
            muted
            preload="none"
            playsInline
            key={videoSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>

      <div id="cta" className="flex flex-col items-center opacity-0 translate-y-20">
        <a
          href="#highlights"
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            onBuySusClick?.(); // SAFE
          }}
        >
          Buy
        </a>
        <p><b>QUICKLY</b> be urs for <b>$1/month</b> or <b>$10</b></p>
      </div>
    </section>
  );
};

export default Hero;
