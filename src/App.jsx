import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import Model from "./components/Model";
import Features from "./components/Features";
import Chip from "./components/Chip";
import Shop from "./components/Shop";
import Footer from "./components/Footer";
import Exploring from "./components/Exploring";

import Checkout from "./pages/Checkout";
import SusChallenge from "./components/SusChallenge";

const App = () => {
  const [route, setRoute] = useState(window.location.hash || "#/");
  const [ctfOpen, setCtfOpen] = useState(false);
  const [ctfChallenge, setCtfChallenge] = useState(null);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const openHeroBuyCTF = () => {
    setCtfChallenge({
      title: "CTF: Spot the Red Flags",
      questions: [
        {
          id: "q1",
          type: "text",
          title: "CTF-WQ1",
          redFlag: true,
          question: "Something does not seem right. What type of social engineering is this?",
          prompt: "Type the answer.",
          hint: "We use this to fish. Scammers use the same idea online.",
          accepted: ["bait", "baiting","phishing", "phish"],
          flag: "VCTF{phishing_bait_detected}",
        },
        {
          id: "q2",
          type: "text",
          title: "CTF-WQ2",
          redFlag: true,
          question:
            "What is suspicious about “QUICKLY be urs for $1/month or $10”?",
          prompt: "Type the red flag.",
          hint:
            "Scams often use unrealistic pricing and pressure to rush decisions.",
          accepted: ["bad spelling", "incorrect spelling", "misspelled","misspelling","low price",
            "too good to be true",
            "unrealistic price",
            "misleading price",
            "baiting",
            "lure",
            "bait",
            "rushing",
            "scam",
            "rush",
            "rushing",
            "urgency",
            "spelling",
          ],
          flag: "VCTF{unrealistic_price_urgency_bad_spelling}",
        },
        {
          id: "q3",
          type: "mcq",
          title: "CTF-WQ3",
          redFlag: true,
          question:
            "If a website pretends to be a real brand to steal payment or login info, what is that called?",
          prompt: "Pick one.",
          hint: "It’s a fake lookalike site used to steal info.",
          options: ["Phishing (spoofed site)", "Man-in-the-middle", "Ransomware", "DDoS"],
          correctIndex: 0,
          flag: "VCTF{phishing_spoof_site}",
        },
      ],
    });

    setCtfOpen(true);
  };

  const closeCTF = () => {
    setCtfOpen(false);
    setCtfChallenge(null);
  };

  if (route === "#/checkout") return <Checkout />;

  return (
    <main className="bg-black overflow-y-auto">
      <SusChallenge open={ctfOpen} challenge={ctfChallenge} onClose={closeCTF} />

      <Navbar />
      <Hero onBuySusClick={openHeroBuyCTF} />
      <Highlights />
      <Model />
      <Features />
      <Chip />
      <Shop />
      <Exploring />
      <Footer />
    </main>
  );
};

export default App;
