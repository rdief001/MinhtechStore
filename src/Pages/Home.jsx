import SusChallenge from "../components/SusChallenge";

export default function Home() {
  return (
    <main>
      <h1>MihnTech</h1>

      {/* Example sus elements */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <a href="#" data-sus="giftcard">🎁 Claim Free Gift Card</a>
        <button data-sus="plugin">⬇️ Install Required Plugin</button>
        <a href="#" data-sus="verify">🔒 Verify Account Now</a>
      </div>

      <SusChallenge />
    </main>
  );
}
