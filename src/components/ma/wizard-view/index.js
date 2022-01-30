import * as React from "react";

function WizardView({ children, currentStep = 1 }) {
  const indexFromStep = parseInt(currentStep) - 1;
  const CurrentView = React.Children.toArray(children)[indexFromStep];

  return CurrentView || null;
}

function WizardViewContent({ children, noContainer }) {
  if (noContainer) {
    return children;
  }
  return <div className="wizard-view">{children}</div>;
}

export { WizardView, WizardViewContent };
