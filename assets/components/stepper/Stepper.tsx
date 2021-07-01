import React, { createContext } from "react";
import { useState } from "react";
import { ReactElement } from "react";

type InitialType = {
  previousStep: () => void;
  nextStep: () => void;
  formData: Record<string, string>;
  updateData: (value: any) => void;
};

export const StepperContext = createContext<InitialType>({
  previousStep: () => null,
  nextStep: () => null,
  formData: {},
  updateData: (value: any) => value,
});

type Props = {
  children: ReactElement[];
};

export function Stepper({ children }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(() => currentStep - 1);
  };

  const handleNextStep = () => {
    if (currentStep < children.length) {
      setCurrentStep(() => currentStep + 1);
    }
  };

  return (
    <div className="stepper">
      <div className="stepper__nav">
        {children.map((item: ReactElement, index: number) => (
          <div
            className={`stepper__nav-item ${
              currentStep > index + 1 ? "stepper__nav-item--complete" : ""
            } ${
              currentStep === index + 1 ? "stepper__nav-item--active" : ""
            }`.trim()}
            key={index}
          >
            <span className="stepper__nav-item-step">{index + 1}</span>
            {item.props.name}
          </div>
        ))}
      </div>
      <StepperContext.Provider
        value={{
          previousStep: handlePreviousStep,
          nextStep: handleNextStep,
          formData,
          updateData: setFormData,
        }}
      >
        {children[currentStep - 1]}
      </StepperContext.Provider>
    </div>
  );
}
