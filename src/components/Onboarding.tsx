import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
  isOpen: boolean;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onSkip, isOpen }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const steps: OnboardingStep[] = [
    {
      title: 'Willkommen bei ImmobilienLeads',
      description: 'Entdecken Sie unsere leistungsstarke Plattform zur Analyse und Verwaltung Ihres Immobilienportfolios. Wir führen Sie durch die wichtigsten Funktionen.',
      targetSelector: 'header',
      position: 'bottom'
    },
    {
      title: 'Portfolio-Übersicht',
      description: 'Hier sehen Sie alle Ihre Immobilien auf einen Blick. Verfolgen Sie Wertentwicklung, ROI und andere wichtige Kennzahlen.',
      targetSelector: '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4',
      position: 'bottom'
    },
    {
      title: 'KI-gestützte Empfehlungen',
      description: 'Unsere KI analysiert Ihr Portfolio und gibt Ihnen personalisierte Empfehlungen für Kauf, Verkauf oder Halten Ihrer Immobilien.',
      targetSelector: '.bg-white.rounded-lg.shadow-sm.border:nth-child(3)',
      position: 'top'
    },
    {
      title: 'Marktanalyse',
      description: 'Wechseln Sie zur Marktanalyse, um Regionen zu vergleichen und neue Investitionsmöglichkeiten zu entdecken.',
      targetSelector: 'button:contains("Marktanalyse")',
      position: 'bottom'
    },
    {
      title: 'Hilfe & Support',
      description: 'Haben Sie Fragen? Klicken Sie auf das Hilfe-Symbol in der oberen rechten Ecke, um auf unsere FAQ zuzugreifen.',
      targetSelector: 'button[aria-label="Hilfe"]',
      position: 'left'
    }
  ];

  useEffect(() => {
    if (!isOpen) return;

    const findElement = () => {
      const step = steps[currentStep];
      let element: HTMLElement | null = null;

      if (step.targetSelector.includes(':contains(')) {
        const text = step.targetSelector.match(/:contains\("(.+)"\)/)?.[1];
        if (text) {
          const elements = Array.from(document.querySelectorAll('button'));
          element = elements.find(el => el.textContent?.includes(text)) as HTMLElement || null;
        }
      } else {
        element = document.querySelector(step.targetSelector) as HTMLElement;
      }

      if (element) {
        setTargetElement(element);
        positionTooltip(element, step.position);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(findElement, 300);
    return () => clearTimeout(timer);
  }, [currentStep, isOpen]);

  const positionTooltip = (element: HTMLElement, position: string) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const margin = 20;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = rect.top - tooltipHeight - margin;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'bottom':
        top = rect.bottom + margin;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.left - tooltipWidth - margin;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        left = rect.right + margin;
        break;
    }

    // Ensure tooltip stays within viewport
    if (left < 0) left = margin;
    if (left + tooltipWidth > window.innerWidth) left = window.innerWidth - tooltipWidth - margin;
    if (top < 0) top = margin;
    if (top + tooltipHeight > window.innerHeight) top = window.innerHeight - tooltipHeight - margin;

    setTooltipPosition({ top, left });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Highlight overlay */}
      {targetElement && (
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div
            className="absolute bg-transparent border-2 border-blue-500 shadow-lg pointer-events-none"
            style={{
              top: targetElement.getBoundingClientRect().top - 4,
              left: targetElement.getBoundingClientRect().left - 4,
              width: targetElement.getBoundingClientRect().width + 8,
              height: targetElement.getBoundingClientRect().height + 8,
              borderRadius: '4px',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
            }}
          />
        </div>
      )}

      {/* Tooltip */}
      <div
        className="fixed bg-white rounded-lg shadow-xl p-5 w-80 pointer-events-auto"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          zIndex: 9999
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">{steps[currentStep].title}</h3>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Onboarding schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center justify-center p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Weiter
                  <ChevronRight className="h-5 w-5 ml-1" />
                </>
              ) : (
                'Fertig'
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-400">
          <p>Hinweis: Die in dieser Demo angezeigten Daten sind simuliert. In der praktischen Anwendung werden die Daten über eine API von realen Datenquellen bezogen.</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
