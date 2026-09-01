import { useState } from "react";
import "./App.css";
import { RunawayDot } from "./components/RunAwayDot";

function App() {
  const [count, setCount] = useState(0);
  const [showDot, setShowDot] = useState(true);

  return (
    <>
      <section id="center">
        <div>
          <h1 className="avoid-dot">Welcome!</h1>
          <p className="avoid-dot">
            I work on software, untangle messy systems, and build things for
            fun.
          </p>
        </div>
        {showDot && (
          <RunawayDot
            onComplete={() => {
              setCount((prev) => prev + 1);
            }}
            onDisappear={() => setShowDot(false)}
          />
        )}
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="social">
          <h2 className="avoid-dot">Social</h2>
          <p className="avoid-dot">Feel free to reach out!</p>
          <ul className="social-links avoid-dot">
            <li>
              <a
                href="https://github.com/xuan-62"
                target="_blank"
                onClick={() => setCount(count + 1)}
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/xluo14/"
                target="_blank"
                onClick={() => setCount(count + 1)}
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#linkedin-icon"></use>
                </svg>
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>

      <div className="footer">
        <p className="avoid-dot">Find the tricks: {count}</p>
        <p className="avoid-dot">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </>
  );
}

export default App;
