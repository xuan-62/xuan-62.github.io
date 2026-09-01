import { useState } from "react";
import "./App.css";
import { RunawayDot } from "./components/RunAwayDot";

function App() {
  const [count, setCount] = useState(0); 

  return (
    <>
      <section id="center">
        <div>
          <h1 className="avoid-dot">Welcome!</h1>
          <p className="avoid-dot">
            I'm a Full-Stack Engineer with a passion for building. 
          </p>
        </div>
        <RunawayDot
          onComplete={() => {
            setCount((prev) => prev + 1);
          }}
        />
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="social">
          <h2 className="avoid-dot">Social</h2>
          <p className="avoid-dot">Let's connect and collaborate!</p>
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
      <section id="spacer"></section>
      <div className="footer">
        <p className="avoid-dot">Find the tricks: {count}</p>
        <p className="avoid-dot">
          &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
        </p>
      </div>
    </>
  );
}

export default App;
