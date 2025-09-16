import React from 'react';
import Icon from '../AppIcon';

const LoadingOverlay = ({ 
  isVisible = false, 
  message = 'Generating your presentation...', 
  progress = null,
  type = 'fullscreen' // 'fullscreen' | 'contextual'
}) => {
  if (!isVisible) return null;

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-muted rounded-full animate-spin-slow border-t-primary"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="Sparkles" size={24} className="text-primary animate-pulse-glow" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-foreground">{message}</h3>
        {progress !== null && (
          <div className="w-64 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
          </div>
        )}
        <p className="text-sm text-muted-foreground">
          This may take a few moments...
        </p>
      </div>
    </div>
  );

  if (type === 'contextual') {
    return (
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-30 rounded-md">
        <LoadingContent />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-100">
      <div className="bg-card border border-border rounded-lg p-8 shadow-elevation-3 max-w-md w-full mx-4">
        <LoadingContent />
      </div>
    </div>
  );
};

export default LoadingOverlay;