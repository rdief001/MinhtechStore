import { appleImg, bagImg, searchImg } from "../utils";
import { navLists } from "../constants";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatStep, setChatStep] = useState(1);
  const [chatMessages, setChatMessages] = useState([]);
  const cartRef = useRef(null);
  const supportRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false);
      }

      if (supportRef.current && !supportRef.current.contains(e.target)) {
        setSupportOpen(false);
      }
    };

    if (cartOpen || supportOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [cartOpen, supportOpen]);

  const goToCheckout = () => {
    setCartOpen(false);
    window.location.hash = "#/checkout";
  };

  const openSupportChat = () => {
    setSupportOpen(true);
    setMessage("");
    setChatStep(1);
    setChatMessages([
      {
        id: 1,
        sender: "bot",
        text: "How can I help you?",
      },
      {
        id: 2,
        sender: "bot",
        text: 'To get help solve this: "eiL A sI tsaoT ehT"',
      },
    ]);
  };

  const handleNavClick = (nav) => {
    if (nav === "Support") {
      openSupportChat();
    }
  };

  const normalizeText = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9]/g, "");
  };

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
    };

    const normalized = normalizeText(trimmed);

    if (chatStep === 1) {
      if (normalized === "thetoastisalie") {
        setChatMessages((prev) => [
          ...prev,
          userMessage,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: 'Okay to get more help you need to solve this one too: "Wklv lv d fdhvdu vkliw"',
          },
        ]);
        setChatStep(2);
      } else {
        setChatMessages((prev) => [
          ...prev,
          userMessage,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: "Nope try again.",
          },
        ]);
      }
    } else if (chatStep === 2) {
      if (normalized === "thisisacaesarshift") {
        setChatMessages((prev) => [
          ...prev,
          userMessage,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: "How much was it shifted?",
          },
        ]);
        setChatStep(3);
      } else {
        setChatMessages((prev) => [
          ...prev,
          userMessage,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: "Still wrong. Try again.",
          },
        ]);
      }
    } else if (chatStep === 3) {
      if (trimmed === "3") {
        setChatMessages((prev) => [
          ...prev,
          userMessage,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: "sorry too bad there is no one at this time come again tomorrow tehe 😜",
          },
        ]);
        setChatStep(4);
      } else {
        setChatMessages((prev) => [
          ...prev,
          userMessage,
          {
            id: Date.now() + 1,
            sender: "bot",
            text: "Not quite. Try again.",
          },
        ]);
      }
    }

    setMessage("");
  };

  return (
    <>
      <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center">
        <nav className="flex w-full screen-max-width items-center">
          <img src={appleImg} alt="mihn-tech" width={14} height={18} />

          <div className="flex flex-1 justify-center max-sm:hidden">
            {navLists.map((nav) => (
              <div
                key={nav}
                onClick={() => handleNavClick(nav)}
                className="px-5 text-sm cursor-pointer text-gray hover:text-white transition-all"
              >
                {nav}
              </div>
            ))}
          </div>

          <div className="flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1">
            <img src={searchImg} alt="search" width={18} height={18} />

            <div className="relative" ref={cartRef}>
              <button
                type="button"
                onClick={() => setCartOpen((v) => !v)}
                aria-label="Cart"
                title="Cart"
                className="cursor-pointer"
              >
                <img src={bagImg} alt="cart" width={18} height={18} />
              </button>

              {cartOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-xl border border-gray-300 bg-black/95 backdrop-blur px-4 py-3 shadow-lg z-50">
                  <div className="text-sm font-semibold text-white">Cart</div>

                  <div className="mt-2 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-white">Minh Phone Pro 18</div>
                      <div className="text-xs text-gray">Qty: 1</div>
                    </div>
                    <div className="text-xs text-gray">$999</div>
                  </div>

                  <button
                    type="button"
                    onClick={goToCheckout}
                    className="w-full mt-3 rounded-full bg-blue py-2 text-sm font-semibold text-black hover:opacity-90"
                  >
                    Checkout
                  </button>

                  <div className="text-[11px] text-gray mt-2 opacity-75">
                    Local training build. No real purchases.
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {supportOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/55 z-50 px-4">
          <div
            ref={supportRef}
            className="w-full max-w-[460px] rounded-3xl bg-[#f4f7fb] p-5 shadow-2xl border border-white/70"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[#111827] font-semibold text-lg">
                  Support
                </div>
                <div className="text-xs text-gray-500">Message board</div>
              </div>

              <button
                type="button"
                onClick={() => setSupportOpen(false)}
                className="h-9 w-9 rounded-full bg-white text-gray-500 hover:bg-gray-100"
              >
                ×
              </button>
            </div>

            <div className="h-[340px] overflow-y-auto rounded-2xl bg-[#e9eef7] p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm shadow-sm ${
                      msg.sender === "user"
                        ? "rounded-2xl rounded-br-md bg-[#2f80ff] text-white"
                        : "rounded-2xl rounded-bl-md bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && chatStep !== 4) {
                    handleSend();
                  }
                }}
                placeholder={chatStep === 4 ? "Support is unavailable" : "Type your answer"}
                disabled={chatStep === 4}
                className="flex-1 rounded-2xl border border-blue-300 bg-[#dbeafe] px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-blue-700/70 focus:border-blue-500 disabled:opacity-60"
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={chatStep === 4}
                className="rounded-2xl bg-[#2f80ff] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;