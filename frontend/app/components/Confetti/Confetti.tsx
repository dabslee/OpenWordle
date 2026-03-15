import "./Confetti.css";

export default function Confetti() {
  return (
    <div className="confetti-container">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="confetti" />
      ))}
    </div>
  );
}