import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const PresentationForm = ({ onGenerate, isGenerating }) => {
  const [formData, setFormData] = useState({
    topic: '',
    slideCount: 10,
    audience: '',
    style: 'formal',
    files: []
  });

  const [error, setError] = useState(null);

  const audienceOptions = [
    { value: 'corporate', label: 'Corporate' },
    { value: 'academic', label: 'Academic' },
    { value: 'startup', label: 'Startup' },
    { value: 'general', label: 'General' }
  ];

  const styleOptions = [
    { value: 'formal', label: 'Formal' },
    { value: 'creative', label: 'Creative' },
    { value: 'educational', label: 'Educational' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError(null);
    
    if (formData?.topic?.trim() && formData?.audience) {
      onGenerate(formData);
    }
  };

  const handleSlideCountChange = (e) => {
    setFormData(prev => ({
      ...prev,
      slideCount: parseInt(e?.target?.value)
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e?.target?.files || []);
    setFormData(prev => ({ ...prev, files }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev?.files?.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg p-8 shadow-elevation-2">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Presentation" size={32} color="white" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Craft Your Perfect Presentation
          </h1>
          <p className="text-muted-foreground">
            Transform your ideas into structured, engaging presentations with AI assistance
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center text-destructive">
              <Icon name="AlertTriangle" size={16} className="mr-2" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="Presentation Topic"
              type="text"
              placeholder="Enter your presentation topic or main idea..."
              value={formData?.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e?.target?.value }))}
              required
              description="Be specific about your topic for better AI-generated content"
              className="h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Number of Slides: {formData?.slideCount}
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={formData?.slideCount}
                  onChange={handleSlideCountChange}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((formData?.slideCount - 5) / 15) * 100}%, var(--color-muted) ${((formData?.slideCount - 5) / 15) * 100}%, var(--color-muted) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5</span>
                  <span>20</span>
                </div>
              </div>
            </div>

            <Select
              label="Target Audience"
              placeholder="Select your audience"
              options={audienceOptions}
              value={formData?.audience}
              onChange={(value) => setFormData(prev => ({ ...prev, audience: value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Presentation Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {styleOptions?.map((style) => (
                <button
                  key={style?.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, style: style?.value }))}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-center
                    ${formData?.style === style?.value
                      ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background hover:border-primary/50 text-foreground hover:bg-accent'
                    }
                  `}
                >
                  <div className="font-medium">{style?.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Supporting Files (Optional)
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Icon name="Upload" size={24} className="mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Documents, images, PDFs (MAX. 10MB each)
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {formData?.files?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Selected Files ({formData?.files?.length})
                  </p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {formData?.files?.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-accent/30 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Icon name="File" size={16} className="text-muted-foreground" />
                          <span className="text-sm text-foreground truncate max-w-48">
                            {file?.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({(file?.size / 1024 / 1024)?.toFixed(1)}MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-destructive hover:text-destructive/80 transition-colors"
                        >
                          <Icon name="X" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isGenerating}
            iconName="Sparkles"
            iconPosition="left"
            disabled={!formData?.topic?.trim() || !formData?.audience}
            className="mt-8"
          >
            {isGenerating ? 'Generating Presentation...' : 'Generate Presentation'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PresentationForm;