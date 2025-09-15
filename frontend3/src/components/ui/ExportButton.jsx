import React, { useState } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const ExportButton = ({ onExport, disabled = false, loading = false }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const exportOptions = [
    { id: 'pptx', label: 'PowerPoint (.pptx)', icon: 'FileText', primary: true },
    { id: 'pdf', label: 'PDF Document', icon: 'FileDown' },
    { id: 'json', label: 'JSON Data', icon: 'Code' }
  ];

  const handleExport = async (format) => {
    setIsExporting(true);
    setShowDropdown(false);
    
    try {
      if (onExport) {
        await onExport(format);
      }
      
      // For non-PPTX formats, simulate the process
      if (format !== 'pptx') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const presentationData = {
        title: 'My Presentation',
        slides: [],
        createdAt: new Date()?.toISOString()
      };
      
      await navigator.clipboard?.writeText(JSON.stringify(presentationData, null, 2));
      
      // Show success feedback
      const button = document.querySelector('[data-copy-button]');
      if (button) {
        const originalText = button?.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="fixed top-4 right-6 z-40">
      <div className="relative">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyToClipboard}
            disabled={disabled || isExporting}
            iconName="Copy"
            iconPosition="left"
            className="bg-background/95 backdrop-blur border-border hover:bg-accent transition-micro"
            data-copy-button
          >
            Copy
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={disabled}
            loading={isExporting || loading}
            iconName="Download"
            iconPosition="left"
            className="bg-primary hover:bg-primary/90 transition-micro"
          >
            Export
          </Button>
        </div>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-elevation-2 z-50">
            <div className="py-1">
              {exportOptions?.map((option) => (
                <button
                  key={option?.id}
                  onClick={() => handleExport(option?.id)}
                  disabled={isExporting}
                  className={`flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-micro disabled:opacity-50 ${
                    option?.primary ? 'font-medium' : ''
                  }`}
                >
                  <Icon name={option?.icon} size={16} className="mr-3" />
                  {option?.label}
                  {option?.primary && (
                    <span className="ml-auto text-xs text-primary">Recommended</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ExportButton;