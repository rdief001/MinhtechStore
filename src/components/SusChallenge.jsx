import { useEffect, useRef, useState } from "react";

export default function SusChallenge({ open, challenge, onClose }) {
  const questions = challenge?.questions || [];
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // text questions
  const [textAnswer, setTextAnswer] = useState({}); // { [qId]: "typed answer" }

  // mcq questions
  const [selected, setSelected] = useState({}); // { [qId]: optionIndex }

  // per-question correctness + unlocked flags
  const [unlocked, setUnlocked] = useState({}); // { [qId]: true/false }
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setIndex(0);
    setShowHint(false);
    setTextAnswer({});
    setSelected({});
    setUnlocked({});
    setFeedback("");
    setCopied(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [open, index]);

  const current = questions[index];
  if (!open || !challenge || !current) return null;

  const normalize = (s) => (s || "").trim().toLowerCase();

  // Style helpers (grey UI)
  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 99999999,
      padding: 18,
    },
    card: {
      width: "min(760px, 100%)",
      background: "#151515", // GREY, not blue
      color: "#f4f4f4",
      borderRadius: 18,
      padding: 18,
      border: "1px solid rgba(255,255,255,.10)",
      boxShadow: "0 22px 80px rgba(0,0,0,.55)",
    },
    subheader: { fontSize: 12, opacity: 0.8 },
    question: { margin: "10px 0 8px", fontSize: 18, fontWeight: 900 }, // BOLDED
    promptRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: 6,
      opacity: 0.92,
    },
    redFlagPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: "rgba(255, 70, 70, .14)",
      border: "1px solid rgba(255, 70, 70, .35)",
      color: "#ff6b6b",
      padding: "6px 10px",
      borderRadius: 999,
      fontWeight: 900,
      fontSize: 12,
      lineHeight: 1,
    },
    promptText: { margin: 0, fontWeight: 700 },
    optionBtn: (picked) => ({
      textAlign: "left",
      padding: "12px 14px",
      borderRadius: 16,
      border: picked ? "1px solid rgba(255,255,255,.45)" : "1px solid rgba(255,255,255,.12)",
      background: picked ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.06)",
      color: "#f4f4f4",
      cursor: "pointer",
      fontWeight: 800,
    }),
    input: {
      width: "100%",
      marginTop: 12,
      padding: 12,
      borderRadius: 16,
      border: "1px solid rgba(255,255,255,.18)",
      outline: "none",
      background: "rgba(255,255,255,.06)",
      color: "#f4f4f4",
      fontSize: 14,
    },
    pillBtn: (bg, fg, border) => ({
      border: border || "1px solid rgba(255,255,255,.14)",
      background: bg,
      color: fg,
      borderRadius: 999,
      padding: "10px 14px",
      cursor: "pointer",
      fontWeight: 900,
      lineHeight: 1,
      userSelect: "none",
    }),
    disabled: { opacity: 0.45, cursor: "not-allowed" },
    hintBox: {
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: 16,
      padding: 12,
      marginTop: 10,
      fontWeight: 650,
      opacity: 0.95,
    },
    feedbackOk: { marginTop: 12, fontWeight: 900, color: "#4dff9a" },
    feedbackBad: { marginTop: 12, fontWeight: 900, color: "#ff6b6b" },
    flagBox: {
      marginTop: 14,
      background: "rgba(77, 255, 154, .10)",
      border: "1px solid rgba(77, 255, 154, .28)",
      borderRadius: 18,
      padding: 14,
    },
    flagPre: {
      marginTop: 10,
      background: "rgba(0,0,0,.35)",
      border: "1px solid rgba(255,255,255,.10)",
      color: "#dbe7ff",
      padding: 12,
      borderRadius: 16,
      overflowX: "auto",
    },
  };

  const unlockedThis = Boolean(unlocked[current.id]);
  const showRedFlag = Boolean(current.redFlag); // <-- set per question in App.jsx

  const checkCurrent = () => {
    setCopied(false);

    if (current.type === "text") {
      const a = normalize(textAnswer[current.id]);
      const ok = (current.accepted || []).some((x) => a.includes(normalize(x)));

      if (!a) {
        setFeedback("Type an answer first.");
        setUnlocked((p) => ({ ...p, [current.id]: false }));
        return;
      }

      if (!ok) {
        setFeedback("Not quite ❌ Try again or use the hint.");
        setUnlocked((p) => ({ ...p, [current.id]: false }));
        return;
      }

      setFeedback("Correct ✅ Flag unlocked.");
      setUnlocked((p) => ({ ...p, [current.id]: true }));
      return;
    }

    // MCQ
    const pick = selected[current.id];
    if (typeof pick !== "number") {
      setFeedback("Pick an answer first.");
      setUnlocked((p) => ({ ...p, [current.id]: false }));
      return;
    }

    if (pick !== current.correctIndex) {
      setFeedback("Not quite ❌ Try again or use the hint.");
      setUnlocked((p) => ({ ...p, [current.id]: false }));
      return;
    }

    setFeedback("Correct ✅ Flag unlocked.");
    setUnlocked((p) => ({ ...p, [current.id]: true }));
  };

  const copyFlag = async () => {
    try {
      await navigator.clipboard.writeText(current.flag);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const goPrev = () => {
    setShowHint(false);
    setFeedback("");
    setCopied(false);
    setIndex((i) => Math.max(0, i - 1));
  };

  const goNext = () => {
    setShowHint(false);
    setFeedback("");
    setCopied(false);
    setIndex((i) => Math.min(total - 1, i + 1));
  };

  return (
    <div
      style={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={styles.card} onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={styles.subheader}>
              {challenge.title} • {current.title} • {index + 1}/{total}
            </div>

            <div style={styles.question}>{current.question}</div>

            <div style={styles.promptRow}>
              {showRedFlag && (
                <span style={styles.redFlagPill}>
                  🚩 Red flag
                </span>
              )}
              <p style={styles.promptText}>{current.prompt || ""}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={styles.pillBtn("rgba(255,255,255,.10)", "#f4f4f4")}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ marginTop: 12 }}>
          {current.type === "text" ? (
            <input
              ref={inputRef}
              value={textAnswer[current.id] || ""}
              onChange={(e) => {
                setTextAnswer((p) => ({ ...p, [current.id]: e.target.value }));
                setFeedback("");
                setCopied(false);
              }}
              placeholder="Type answer..."
              autoComplete="off"
              style={styles.input}
              onKeyDown={(e) => {
                if (e.key === "Enter") checkCurrent();
                if (e.key === "Escape") onClose();
              }}
            />
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {(current.options || []).map((opt, i) => {
                const picked = selected[current.id] === i;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSelected((p) => ({ ...p, [current.id]: i }));
                      setFeedback("");
                      setCopied(false);
                    }}
                    style={styles.optionBtn(picked)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Controls */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <button
              type="button"
              onClick={() => setShowHint((s) => !s)}
              style={styles.pillBtn("rgba(255,255,255,.10)", "#f4f4f4")}
            >
              {showHint ? "Hide hint" : "Hint"}
            </button>

            <button
              type="button"
              onClick={checkCurrent}
              style={styles.pillBtn("rgba(255,255,255,.18)", "#f4f4f4", "1px solid rgba(255,255,255,.25)")}
            >
              Check
            </button>

            <button
              type="button"
              onClick={goPrev}
              disabled={index === 0}
              style={{
                ...styles.pillBtn("rgba(255,255,255,.10)", "#f4f4f4"),
                ...(index === 0 ? styles.disabled : {}),
              }}
            >
              Prev
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={index === total - 1}
              style={{
                ...styles.pillBtn("rgba(255,255,255,.10)", "#f4f4f4"),
                ...(index === total - 1 ? styles.disabled : {}),
              }}
            >
              Next
            </button>
          </div>

          {/* Hint */}
          {showHint && current.hint && (
            <div style={styles.hintBox}>
              <b>Hint:</b> {current.hint}
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div style={feedback.includes("Correct") ? styles.feedbackOk : styles.feedbackBad}>
              {feedback}
            </div>
          )}

          {/* Flag unlocked per question */}
          {unlockedThis && (
            <div style={styles.flagBox}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                <div style={{ fontWeight: 950, color: "#4dff9a" }}>Flag unlocked ✅</div>

                <button
                  type="button"
                  onClick={copyFlag}
                  style={styles.pillBtn("#1f9d55", "#ffffff", "1px solid rgba(255,255,255,.12)")}
                >
                  {copied ? "Copied!" : "Copy flag"}
                </button>
              </div>

              <pre style={styles.flagPre}>{current.flag}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
