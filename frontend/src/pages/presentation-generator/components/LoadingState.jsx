import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const LoadingState = ({ isVisible, progress = 0 }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  const steps = [
    { label: 'Analyzing your topic...', icon: 'Search' },
    { label: 'Structuring content...', icon: 'Layout' },
    { label: 'Generating slides...', icon: 'FileText' },
    { label: 'Adding creative touches...', icon: 'Sparkles' },
    { label: 'Finalizing presentation...', icon: 'Check' }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps?.length - 1) {
          return prev + 1;
        }
        return 0; // Loop back to start
      });
    }, 1500);

    const progressInterval = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev < 95) {
          return prev + Math.random() * 3;
        }
        return prev;
      });
    }, 200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isVisible, steps?.length]);

  useEffect(() => {
    if (progress === 100) {
      setDisplayProgress(100);
    }
  }, [progress]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-8 shadow-elevation-3 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-muted rounded-full animate-spin-slow border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon 
                name={steps?.[currentStep]?.icon || 'Sparkles'} 
                size={28} 
                className="text-primary animate-pulse-glow" 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">
              Creating Your Presentation
            </h3>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {steps?.[currentStep]?.label || 'Processing...'}
              </p>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(100, displayProgress)}%` }}
                ></div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {Math.round(displayProgress)}% complete
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-1">
              {steps?.map((_, index) => (
                <div
                  key={index}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${index <= currentStep ? 'bg-primary' : 'bg-muted'}
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;