import * as React from "react";

function useWizardView(steps, initialStep = 1) {
  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const stepsTotal = steps.length;
  const step = steps[currentStep - 1];

  const goToNextStep = () => {
    setCurrentStep((step) => {
      return step < stepsTotal ? step + 1 : step;
    });
  };

  const goToPreviousStep = () => {
    setCurrentStep((step) => {
      return step > 1 ? step - 1 : step;
    });
  };

  const goToStep = (steptarget) => setCurrentStep(steptarget);

  return {
    steps,
    stepsTotal,
    currentStep,
    currentLabel: step?.label || "",
    goToNextStep,
    goToPreviousStep,
    goToStep,
  };
}

export { useWizardView };
