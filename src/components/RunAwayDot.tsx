import { useRef, useEffect, useState } from "react";
import "./RunAwayDot.css";
type Position = {
  x: number;
  y: number;
};

type RunawayDotProps = {
  onComplete: () => void;
};

const PADDING = 24;
const GAP = 20;
const DOT_SIZE = 8;
const MAX_ATTEMPTS = 30;

function getRandomPosition(parent: HTMLElement): Position {
  const maxX = parent.clientWidth - DOT_SIZE - PADDING;
  const maxY = parent.clientHeight - DOT_SIZE - PADDING;

  return {
    x:
      PADDING +
      Math.random() * Math.max(0, maxX - PADDING),

    y:
      PADDING +
      Math.random() * Math.max(0, maxY - PADDING),
  };
}

function isSafePosition(
  position: Position,
  parent: HTMLElement,
  forbiddenRects: DOMRect[],
) {
  const parentRect = parent.getBoundingClientRect();

  const candidateLeft = parentRect.left + position.x;
  const candidateTop = parentRect.top + position.y;
  const candidateRight = candidateLeft + DOT_SIZE;
  const candidateBottom = candidateTop + DOT_SIZE;

  return forbiddenRects.every((rect) => {
    return (
      candidateRight < rect.left - GAP ||
      candidateLeft > rect.right + GAP ||
      candidateBottom < rect.top - GAP ||
      candidateTop > rect.bottom + GAP
    );
  });
}

function findSafePosition(parent: HTMLElement): Position | null {
  const forbiddenRects = Array.from(
    document.querySelectorAll(".avoid-dot"),
  ).map((element) => element.getBoundingClientRect());

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const position = getRandomPosition(parent);

    if (isSafePosition(position, parent, forbiddenRects)) {
      return position;
    }
  }

  return null;
}

export function RunawayDot({ onComplete }: RunawayDotProps) {
  const runawayRef = useRef<HTMLDivElement>(null);

  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const [completed, setCompleted] = useState(false);

  const getParent = () => {
    return runawayRef.current?.offsetParent as HTMLElement | null;
  };

  const moveToSafePosition = () => { 
    const parent = getParent(); 

    if (!parent) return;

    const nextPosition = findSafePosition(parent);

    if (nextPosition) {
      setPosition(nextPosition);
    }
  };

  const escape = () => { 
    setAttempts((n) => n + 1); 
    moveToSafePosition(); 
  };
  useEffect(() => {
    moveToSafePosition();
  }, []);
  useEffect(() => {
    let nextMessage = "";

    if (attempts >= 13) {
      nextMessage = "Try Hire Me:)"; 
    } else if (attempts >= 10) {
      nextMessage = "Where are you from?";
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

  useEffect(() => {
    if (attempts >= 13 && !completed) {
      setCompleted(true);
      onComplete();
    }
  }, [attempts, completed, onComplete]);
  
  return (
      <>
        <div
          className="runaway"
          ref={runawayRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        > 
          <button
            type="button"
            className="runaway-dot" 
            onMouseEnter={escape}
            onTouchStart={escape}
            aria-label="mysterious dot"
          />
        </div>
        <div
          className={`message-reveal ${visible ? "visible" : ""}`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          <span className="runaway-message">{message}</span>
        </div>
    </>
  );
}
