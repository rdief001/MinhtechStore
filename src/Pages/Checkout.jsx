import React from "react";

const ALLOWED_CARD_TOKEN = "6767 6767 6767 6767"; // training token only
const ALLOWED_CVC_TOKEN = "123";

// 3 different flags (one per question)
const FLAGS = {
  q1: "CKCTF{67_phishing}", // phishing
  q2: "CKCTF{76_spoofing}", // spoofing
  q3: "CKCTF{Personal_Identifiable_Information}", // personal
};

// --- helpers ---
function formatCard(value) {
  const digits = String(value).replace(/\D/g, "").slice(0, 16);
  const parts = digits.match(/.{1,4}/g) || [];
  return parts.join(" ");
}

function isValidId8(v) {
  return /^\d{8}$/.test(String(v).trim());
}

function looksLikeRealCard(v) {
  const digits = String(v).replace(/\D/g, "");
  return digits.length === 16 && formatCard(digits) !== ALLOWED_CARD_TOKEN;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const Checkout = () => {
  const backHome = () => (window.location.hash = "#/");

  // billing
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [addr, setAddr] = React.useState("");
  const [city, setCity] = React.useState("");
  const [stateProv, setStateProv] = React.useState("");
  const [postal, setPostal] = React.useState("");

  // forced ID: must be 8 digits
  const [idNumber, setIdNumber] = React.useState("");

  // training payment
  const [card, setCard] = React.useState(ALLOWED_CARD_TOKEN);
  const [exp, setExp] = React.useState("01/30");
  const [cvc, setCvc] = React.useState(ALLOWED_CVC_TOKEN);

  // flow
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [incidentOpen, setIncidentOpen] = React.useState(false);

  // quiz
  const [qIndex, setQIndex] = React.useState(0);
  const [revealedCode, setRevealedCode] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const price = 1600;

  const errors = React.useMemo(() => {
    const e = {};
    if (!email.trim()) e.email = "Required";
    if (!name.trim()) e.name = "Required";
    if (!addr.trim()) e.addr = "Required";
    if (!city.trim()) e.city = "Required";
    if (!stateProv.trim()) e.stateProv = "Required";
    if (!postal.trim()) e.postal = "Required";

    // required 8-digit ID
    if (!idNumber.trim()) e.idNumber = "Required";
    else if (!isValidId8(idNumber)) e.idNumber = "Must be exactly 8 digits.";

    // payment guardrails
    if (looksLikeRealCard(card)) e.card = "Invalid card.";
    else if (card !== ALLOWED_CARD_TOKEN) e.card = "Invalid card.";

    if (cvc !== ALLOWED_CVC_TOKEN) e.cvc = "Invalid CVC.";

    return e;
  }, [email, name, addr, city, stateProv, postal, idNumber, card, cvc]);

  const resetCTF = () => {
    setQIndex(0);
    setRevealedCode("");
    setCopied(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(errors).length) {
      alert("Please fix the highlighted fields.");
      return;
    }

    setIsProcessing(true);
    setIncidentOpen(false);
    resetCTF();

    window.setTimeout(() => {
      setIsProcessing(false);
      setIncidentOpen(true);
    }, 1400);
  };

  const question = React.useMemo(() => {
    if (qIndex === 0) {
      return {
        prompt: "CTF-WQ4: What kind of attack was this?",
        options: ["phishing", "malware", "virus", "hacking"],
        correct: "phishing",
        code: FLAGS.q1,
      };
    }
    if (qIndex === 1) {
      return {
        prompt: "CTF-WQ5: How does the attacker trick users in this attack?",
        options: ["spoofing", "firewall", "encryption", "antivirus"],
        correct: "spoofing",
        code: FLAGS.q2,
      };
    }
    return {
      prompt: "CTF-WQ6: What was type of information was leaked?",
      options: ["personal identifiable information", "passwords", "cookies", "device locations"],
      correct: "personal identifiable information",
      code: FLAGS.q3,
    };
  }, [qIndex]);

  const onPick = (opt) => {
    setCopied(false);
    if (opt === question.correct) {
      setRevealedCode(question.code);
      return;
    }
    alert("Incorrect.");
  };

  const onCopy = async () => {
    if (!revealedCode) return;
    const ok = await copyText(revealedCode);
    setCopied(ok);
    if (!ok) alert("Copy failed. Please copy manually.");
  };

  const onNext = () => {
    setRevealedCode("");
    setCopied(false);
    if (qIndex < 2) setQIndex(qIndex + 1);
  };

  return (
    <main className="bg-black min-h-screen px-5 sm:px-10 py-10 text-white">
      <div className="screen-max-width">
        <button
          type="button"
          onClick={backHome}
          className="text-blue hover:underline text-sm"
          disabled={isProcessing}
        >
          ← Back
        </button>

        <div className="mt-4 flex items-start justify-between gap-6 flex-col lg:flex-row">
          {/* LEFT */}
          <div className="w-full lg:w-[60%]">
            <h1 className="text-3xl sm:text-4xl font-semibold">Checkout</h1>
            <p className="text-gray mt-2 max-w-xl">
              Confirm billing and payment to complete purchase.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-8">
              <section className="rounded-2xl border border-gray-300/60 bg-black/60 p-5">
                <h2 className="font-semibold text-lg">Contact</h2>

                <label className="block text-sm text-gray mt-4 mb-2">Email</label>
                <input
                  className="w-full rounded-xl bg-black border border-gray-300/70 px-4 py-3 text-white outline-none focus:border-white"
                  placeholder="name@example.com"
                  autoComplete="off"
                  value={email}
                  disabled={isProcessing}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <div className="text-xs text-red-300 mt-1">{errors.email}</div>
                )}
              </section>

              <section className="rounded-2xl border border-gray-300/60 bg-black/60 p-5">
                <h2 className="font-semibold text-lg">Billing</h2>

                <label className="block text-sm text-gray mt-4 mb-2">Full name</label>
                <input
                  className="w-full rounded-xl bg-black border border-gray-300/70 px-4 py-3 text-white outline-none focus:border-white"
                  placeholder="First Last"
                  autoComplete="off"
                  value={name}
                  disabled={isProcessing}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <div className="text-xs text-red-300 mt-1">{errors.name}</div>
                )}

                <label className="block text-sm text-gray mt-4 mb-2">
                  Nickname (optional)
                </label>
                <input
                  className="w-full rounded-xl bg-black border border-gray-300/70 px-4 py-3 text-white outline-none focus:border-white"
                  placeholder="What should we call you?"
                  autoComplete="off"
                  value={nickname}
                  disabled={isProcessing}
                  onChange={(e) => setNickname(e.target.value)}
                />

                <label className="block text-sm text-gray mt-4 mb-2">Address</label>
                <input
                  className="w-full rounded-xl bg-black border border-gray-300/70 px-4 py-3 text-white outline-none focus:border-white"
                  placeholder="123 Example St"
                  autoComplete="off"
                  value={addr}
                  disabled={isProcessing}
                  onChange={(e) => setAddr(e.target.value)}
                />
                {errors.addr && (
                  <div className="text-xs text-red-300 mt-1">{errors.addr}</div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <div>
                    <label className="block text-sm text-gray mb-2">City</label>
                    <input
                      className="w-full rounded-xl bg-black border border-gray-300/70 px-4 py-3 text-white outline-none focus:border-white"
                      placeholder="City"
                      autoComplete="off"
                      value={city}
                      disabled={isProcessing}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    {errors.city && (
                      <div className="text-xs text-red-300 mt-1">{errors.city}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray mb-2">State</label>
                    <input
                      className="w-full rounded-xl bg-black border border-gray-300/70 px-4 py-3 text-white outline-none focus:border-white"
                      placeholder="CA"
                      autoComplete="off"
                      value={stateProv}
                      disabled={isProcessing}
                      onChange={(e) => setStateProv(e.target.value)}
                    />
                    {errors.stateProv && (
                      <div className="text-xs text-red-300 mt-1">{errors.stateProv}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray mb-2">Postal</label>
                    <input
                      className="w-full rounded-xl bg-black border border-gray-300/70 px-4 py-3 text-white outline-none focus:border-white"
                      placeholder="90210"
                      autoComplete="off"
                      value={postal}
                      disabled={isProcessing}
                      onChange={(e) => setPostal(e.target.value)}
                    />
                    {errors.postal && (
                      <div className="text-xs text-red-300 mt-1">{errors.postal}</div>
                    )}
                  </div>
                </div>

                <label className="block text-sm text-gray mt-5 mb-2">
                  Identification Number (8 digits)
                </label>
                <input
                  className="w-full rounded-xl bg-black border border-gray-300/70 px-4 py-3 text-white outline-none focus:border-white"
                  placeholder="12345678"
                  autoComplete="off"
                  inputMode="numeric"
                  value={idNumber}
                  disabled={isProcessing}
                  onChange={(e) =>
                    setIdNumber(e.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                />
                {errors.idNumber && (
                  <div className="text-xs text-red-300 mt-1">{errors.idNumber}</div>
                )}
              </section>

              <section className="rounded-2xl border border-gray-300/60 bg-black/60 p-5">
                <h2 className="font-semibold text-lg">Payment</h2>

                <label className="block text-sm text-gray mt-4 mb-2">Card number</label>
                <input
                  className="w-full rounded-xl bg-black border border-gray-300/70 px-4 py-3 text-white outline-none focus:border-white"
                  value={card}
                  disabled={isProcessing}
                  onChange={(e) => setCard(formatCard(e.target.value))}
                  inputMode="numeric"
                  autoComplete="off"
                />
                {errors.card && (
                  <div className="text-xs text-red-300 mt-1">{errors.card}</div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="block text-sm text-gray mb-2">Exp</label>
                    <input
                      className="w-full rounded-xl bg-black border border-gray-300/70 px-4 py-3 text-white outline-none focus:border-white"
                      value={exp}
                      disabled={isProcessing}
                      onChange={(e) => setExp(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray mb-2">CVC</label>
                    <input
                      className="w-full rounded-xl bg-black border border-gray-300/70 px-4 py-3 text-white outline-none focus:border-white"
                      value={cvc}
                      disabled={isProcessing}
                      onChange={(e) =>
                        setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))
                      }
                      inputMode="numeric"
                      autoComplete="off"
                    />
                    {errors.cvc && (
                      <div className="text-xs text-red-300 mt-1">{errors.cvc}</div>
                    )}
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full rounded-full py-3 text-sm font-semibold text-black hover:opacity-90 ${
                  isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-blue"
                }`}
              >
                {isProcessing ? "Processing order..." : "Place Order"}
              </button>

              {incidentOpen && (
                <div className="rounded-2xl border border-gray-300/40 bg-black/70 p-5 space-y-4">
                  <div className="font-semibold text-lg">⚠️ DATA EXPOSURE DETECTED</div>
                  <div className="text-gray text-sm">Your information has been leaked.</div>

                  <div className="rounded-xl border border-gray-300/30 bg-black/60 p-4 space-y-3">
                    <div className="font-semibold">{question.prompt}</div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {question.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => onPick(opt)}
                          className="rounded-xl border border-gray-300/40 bg-black px-4 py-3 text-white hover:border-white"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {revealedCode && (
                      <div className="rounded-xl border border-gray-300/40 bg-black/70 p-4 space-y-3">
                        <div className="font-semibold">✅ Correct</div>

                        <div className="flex items-center justify-between gap-3 flex-col sm:flex-row">
                          <div className="w-full sm:w-auto">
                            <div className="text-gray text-xs mb-1">CTF Code</div>
                            <div className="text-white font-mono text-lg select-all">
                              {revealedCode}
                            </div>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={onCopy}
                              className="w-full sm:w-auto rounded-full bg-blue px-5 py-2 text-sm font-semibold text-black hover:opacity-90"
                            >
                              {copied ? "Copied" : "Copy"}
                            </button>

                            {qIndex < 2 && (
                              <button
                                type="button"
                                onClick={onNext}
                                className="w-full sm:w-auto rounded-full border border-gray-300/60 px-5 py-2 text-sm font-semibold text-white hover:border-white"
                              >
                                Next
                              </button>
                            )}
                          </div>
                        </div>

                        {qIndex === 2 && (
                          <div className="text-gray text-xs">Done.</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-gray opacity-75">
                    (Simulation) No information is stored or transmitted.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* RIGHT */}
          <aside className="w-full lg:w-[40%]">
            <div className="rounded-2xl border border-gray-300/60 bg-black/60 p-5 sticky top-6">
              <h2 className="font-semibold text-lg">Order summary</h2>

              <div className="mt-4 flex gap-4">
                <div className="w-24 h-24 rounded-xl border border-gray-300/40 overflow-hidden bg-black">
                  <img
                    src="/assets/images/iphone15.jpg"
                    alt="Minh Phone Pro 18"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="font-medium">Minh Phone Pro 18</div>
                  <div className="text-gray text-sm">Qty: 1</div>
                  <div className="text-gray text-sm mt-1">${price}</div>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-300/40 pt-4 flex items-center justify-between">
                <div className="font-semibold">Total</div>
                <div className="font-semibold">${price}</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
