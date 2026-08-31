import { useEffect, useState } from "react";
import "./RunAwayDot.css";

type RunawayDotProps = {
  onComplete: () => void;
};

export function RunawayDot({ onComplete }: RunawayDotProps) {
  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const escape = () => {
    setAttempts((n) => n + 1);

    setPosition({
      x: Math.random() * 180 - 90,
      y: Math.random() * 80 - 40,
    });
  };

  useEffect(() => {
    let nextMessage = "";

    if (attempts >= 13) {
      nextMessage = "Try Hire Me.";
      onComplete();
    } else if (attempts >= 10) {
      nextMessage = "Which company are you from?";
    } else if (attempts >= 7) {
      nextMessage = "still here?";
    }

    if (!nextMessage) {
      setVisible(false);
      return;
    }

    setMessage(nextMessage);
    setVisible(true);

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [attempts]);

  return (
    <>
      <button
        type="button"
        className="runaway-dot"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseEnter={escape}
        onClick={escape}
        aria-label="mysterious dot"
      />

      <p className={`runaway-message ${visible ? "visible" : ""}`}>{message}</p>
    </>
  );
}
