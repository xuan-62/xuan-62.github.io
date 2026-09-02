import { useRef, useEffect, useState } from "react";
import "./RunAwayDot.css";

type Position = {
  x: number;
  y: number;
};

type messageSide = {
  horizontal: "left" | "right";
  vertical: "top" | "bottom";
};

type RunawayDotProps = {
  onComplete: () => void;
  onDisappear: () => void;
};

type DotMode = "playing" | "ending" | "hidden";

const PADDING = 24;
const GAP = 20;
const DOT_SIZE = 8;
const MAX_ATTEMPTS = 30;
const EDGE_BUFFER = 50;

function getRandomPosition(parent: HTMLElement): Position {
  const maxX = parent.clientWidth - DOT_SIZE - PADDING - EDGE_BUFFER;
  const maxY = parent.clientHeight - DOT_SIZE - PADDING - EDGE_BUFFER;

  return {
    x: PADDING + Math.random() * Math.max(0, maxX - PADDING),
    y: PADDING + Math.random() * Math.max(0, maxY - PADDING),
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

function getPlacement(
  parent: HTMLElement,
  messageDiv: DOMRect,
  newPosition: Position,
  oldPosition: Position,
): messageSide {
  const horizontal = newPosition.x < oldPosition.x ? "right" : "left";
  const vertical = newPosition.y < oldPosition.y ? "bottom" : "top";
  const placement: messageSide = { horizontal, vertical };

  const safePlacement = getSafePlacement(
    parent,
    messageDiv,
    newPosition,
    placement,
  );
  return safePlacement;
}

function getSafePlacement(
  parent: HTMLElement,
  messageDiv: DOMRect,
  position: Position,
  preferred: messageSide,
): messageSide {
  const messageWidth = messageDiv.width; // Approximate width of the message
  const messageHeight = messageDiv.height; // Approximate height of the message
  const gap = 10; // Gap between the dot and the message

  const leftSpace = position.x - gap;
  const rightSpace = parent.clientWidth - (position.x + DOT_SIZE + gap);
  const topSpace = position.y - gap;
  const bottomSpace = parent.clientHeight - (position.y + DOT_SIZE + gap);
  let horizontal = preferred.horizontal;
  let vertical = preferred.vertical;
  // preferred left
  if (
    horizontal === "left" &&
    leftSpace < messageWidth &&
    rightSpace >= messageWidth
  ) {
    horizontal = "right";
  }

  // preferred right
  else if (
    horizontal === "right" &&
    rightSpace < messageWidth &&
    leftSpace >= messageWidth
  ) {
    horizontal = "left";
  }

  if (
    vertical === "top" &&
    topSpace < messageHeight &&
    bottomSpace >= messageHeight
  ) {
    vertical = "bottom";
  } else if (
    vertical === "bottom" &&
    bottomSpace < messageHeight &&
    topSpace >= messageHeight
  ) {
    vertical = "top";
  }

  return {
    horizontal,
    vertical,
  };
}

export function RunawayDot({ onComplete, onDisappear }: RunawayDotProps) {
  const runawayRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const [completed, setCompleted] = useState(false);

  const [messageSide, setMessageSide] = useState<messageSide>({
    horizontal: "left",
    vertical: "top",
  });

  const [mode, setMode] = useState<DotMode>("playing");

  const getParent = () => {
    return runawayRef.current?.offsetParent as HTMLElement | null;
  };

  const getMessageDiv = () => {
    return messageRef.current?.getBoundingClientRect() ?? null;
  };

  const moveToSafePosition = () => {
    const parent = getParent();
    const messageDiv = getMessageDiv();

    if (!parent || !messageDiv) return;
    if (!parent) return;

    const nextPosition = findSafePosition(parent);

    if (nextPosition) {
      const preferredPlacement = getPlacement(
        parent,
        messageDiv,
        nextPosition,
        position,
      );

      setMessageSide(preferredPlacement);
      setPosition(nextPosition);
    }
  };

  const escape = () => {
    setAttempts((n) => n + 1);
    moveToSafePosition();
  };
  useEffect(() => {
    if (mode !== "ending") return;

    const parent = getParent();
    const messageDiv = messageRef.current?.getBoundingClientRect();

    if (!parent || !messageDiv) return;

    const safePlacement = getSafePlacement(
      parent,
      messageDiv,
      position,
      messageSide,
    );

    setMessageSide(safePlacement);

    // recalculate after ending
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  useEffect(() => {
    moveToSafePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let nextMessage = "";
    if (attempts >= 19) {
      nextMessage = " ";
    } else if (attempts > 16) {
      nextMessage = "Have Fun!";
    } else if (attempts >= 13) {
      nextMessage = "Try Hire Me :)";
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

  useEffect(() => {
    if (attempts === 16) {
      setMode("ending");
      setVisible(true);
    }
  }, [attempts]);
  const [copied, setCopied] = useState(false);
  const share = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  };

  return (
    <>
      <div
        className="runaway"
        ref={runawayRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseEnter={escape}
        onTouchStart={escape}
      >
        <button
          type="button"
          className="runaway-dot"
          aria-label="mysterious dot"
        />
      </div>
      {mode === "playing" && (
        <div
          className={`
            message-reveal 
            ${visible ? "visible" : ""}
            ${messageSide.horizontal} 
            ${messageSide.vertical}
            `}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          <span ref={messageRef} className="runaway-message">
            {message}
          </span>
        </div>
      )}
      {mode === "ending" && (
        <div
          className={`message-reveal
            visible
            ${messageSide.horizontal} 
            ${messageSide.vertical}
            `}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          <div ref={messageRef} className="runaway-message ending-content">
            <div className="ending-copy">
              <span>
              okay, you win. 
              </span>
              <span>
              Share this page? 
              </span>
            </div>

            <div className="ending-actions">
              <button onClick={share}>
                {copied ? "Link copied!" : "Copy link"}
              </button>
              <button onClick={() => setMode("playing")}>keep playing</button>
              <button onClick={onDisappear}>end game</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
