import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SuggestionsSidebar = ({ activeSlide, isCollapsed, onToggle }) => {
  const [activeTab, setActiveTab] = useState('visual');

  const visualSuggestions = [
    {
      id: 1,
      type: 'image',
      title: 'Hero Image',
      description: 'Professional business meeting in modern office',
      prompt: 'Modern corporate boardroom with diverse team collaborating'
    },
    {
      id: 2,
      type: 'image',
      title: 'Data Visualization',
      description: 'Clean charts and graphs for data presentation',
      prompt: 'Minimalist infographic with colorful data charts'
    },
    {
      id: 3,
      type: 'image',
      title: 'Process Flow',
      description: 'Step-by-step workflow illustration',
      prompt: 'Clean process diagram with arrows and icons'
    }
  ];

  const iconSuggestions = [
    { name: 'TrendingUp', label: 'Growth' },
    { name: 'Target', label: 'Goals' },
    { name: 'Users', label: 'Team' },
    { name: 'Lightbulb', label: 'Ideas' },
    { name: 'BarChart3', label: 'Analytics' },
    { name: 'Shield', label: 'Security' }
  ];

  const chartSuggestions = [
    {
      type: 'bar',
      title: 'Bar Chart',
      description: 'Compare categories or show progress over time',
      icon: 'BarChart3'
    },
    {
      type: 'line',
      title: 'Line Chart',
      description: 'Show trends and changes over time',
      icon: 'TrendingUp'
    },
    {
      type: 'pie',
      title: 'Pie Chart',
      description: 'Display proportions and percentages',
      icon: 'PieChart'
    },
    {
      type: 'area',
      title: 'Area Chart',
      description: 'Emphasize magnitude of change over time',
      icon: 'Activity'
    }
  ];

  const tabs = [
    { id: 'visual', label: 'Visual', icon: 'Image' },
    { id: 'icons', label: 'Icons', icon: 'Sparkles' },
    { id: 'charts', label: 'Charts', icon: 'BarChart3' }
  ];

  if (isCollapsed) {
    return (
      <div className="w-12 bg-card border-l border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          iconName="ChevronLeft"
          onClick={onToggle}
          className="mb-4"
        />
        <div className="flex flex-col space-y-2">
          {tabs?.map((tab) => (
            <Button
              key={tab?.id}
              variant="ghost"
              size="icon"
              iconName={tab?.icon}
              className="text-muted-foreground"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Creative Suggestions</h3>
          <Button
            variant="ghost"
            size="icon"
            iconName="ChevronRight"
            onClick={onToggle}
          />
        </div>
        
        <div className="flex space-x-1">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }
              `}
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'visual' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-3">
              AI-generated image suggestions for your slides
            </div>
            {visualSuggestions?.map((suggestion) => (
              <div key={suggestion?.id} className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Icon name="Image" size={16} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">{suggestion?.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{suggestion?.description}</p>
                    <div className="mt-2">
                      <Button variant="outline" size="xs" iconName="Copy" iconPosition="left">
                        Copy Prompt
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'icons' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-3">
              Recommended icons for your content
            </div>
            <div className="grid grid-cols-3 gap-3">
              {iconSuggestions?.map((icon) => (
                <button
                  key={icon?.name}
                  className="p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon 
                      name={icon?.name} 
                      size={20} 
                      className="text-muted-foreground group-hover:text-primary transition-colors" 
                    />
                    <span className="text-xs text-muted-foreground group-hover:text-foreground">
                      {icon?.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-3">
              Chart types based on your content
            </div>
            {chartSuggestions?.map((chart) => (
              <div key={chart?.type} className="bg-background rounded-lg p-4 border border-border hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={chart?.icon} size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">{chart?.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{chart?.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {activeSlide && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Active Slide</div>
          <div className="text-sm font-medium text-foreground">
            Slide {activeSlide?.index + 1}: {activeSlide?.title}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionsSidebar;