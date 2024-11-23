import React, { useState, useEffect } from "react";
import currentDot from "../../images/currentStepImg.svg";
import otherStep from "../../images/otherStepImg.svg";
import StepLine from "../../images/stepLine.svg";
import "./progressBar.css";

function ProgressBar({ currentStep }) {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    setCurrentProgress(currentStep);
  }, [currentStep]);

  return (
    <div className="ProgressBarWrap">
      {[0, 1, 2, 3].map(stepIndex => (
        <div key={stepIndex} className="StepContainer">
          <div
            className="Step"
            style={{
              backgroundImage: `url(${
                currentProgress === stepIndex ? currentDot : otherStep
              })`,
              backgroundSize: "cover",
            }}></div>

          {stepIndex < 3 && (
            <img src={StepLine} alt="StepLine" className="StepLine" />
          )}
        </div>
      ))}
    </div>
  );
}

export default ProgressBar;
