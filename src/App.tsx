import { useState } from "react";
import "./App.css";
import { RunawayDot } from "./components/RunAwayDot";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <section id="center">
        <div>
          <h1>Welcome!</h1>
          <p>
            I'm a Full-Stack Engineer with a passion for building. I thrive on
            creating seamless user experiences and robust applications.
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
          <h2>Social</h2>
          <p>Let's connect and collaborate!</p>
          <ul className="social-links">
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
        <p>Find the tricks: {count}</p>
        <p>
          &copy; {new Date().getFullYear()} My Portfolio. All rights reserved.
        </p>
      </div>
    </>
  );
}

export default App;
