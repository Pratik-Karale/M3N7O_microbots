import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CreativeSuggestionsSidebar = ({ 
  activeSlide, 
  isCollapsed, 
  onToggle,
  onApplySuggestion 
}) => {
  const [activeTab, setActiveTab] = useState('images');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock suggestions based on slide content
  const suggestions = {
    images: [
      {
        id: 1,
        prompt: "Professional business meeting with diverse team collaborating around a modern conference table",
        url: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Business"
      },
      {
        id: 2,
        prompt: "Modern office workspace with natural lighting and minimalist design elements",
        url: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400",
        category: "Workspace"
      },
      {
        id: 3,
        prompt: "Data visualization dashboard on multiple screens showing analytics and growth metrics",
        url: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpg?auto=compress&cs=tinysrgb&w=400",
        category: "Technology"
      }
    ],
    icons: [
      { name: "TrendingUp", category: "Growth", description: "Perfect for showing progress" },
      { name: "Users", category: "Team", description: "Ideal for collaboration topics" },
      { name: "Target", category: "Goals", description: "Great for objectives and targets" },
      { name: "Lightbulb", category: "Ideas", description: "Excellent for innovation content" },
      { name: "BarChart3", category: "Analytics", description: "Best for data presentations" }
    ],
    charts: [
      { type: "Bar Chart", icon: "BarChart3", description: "Compare categories or show progress over time" },
      { type: "Line Chart", icon: "TrendingUp", description: "Display trends and changes over time" },
      { type: "Pie Chart", icon: "PieChart", description: "Show proportions and percentages" },
      { type: "Area Chart", icon: "Activity", description: "Visualize cumulative data over time" }
    ]
  };

  const handleGenerateMore = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const tabs = [
    { id: 'images', label: 'Images', icon: 'Image' },
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
              onClick={() => {
                setActiveTab(tab?.id);
                onToggle();
              }}
              className={activeTab === tab?.id ? 'bg-primary/10 text-primary' : ''}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Creative Suggestions</h2>
          <Button
            variant="ghost"
            size="icon"
            iconName="ChevronRight"
            onClick={onToggle}
          />
        </div>

        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all
                ${activeTab === tab?.id 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'images' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Image Suggestions</h3>
              <Button
                variant="outline"
                size="xs"
                iconName="Wand2"
                onClick={handleGenerateMore}
                loading={isGenerating}
              >
                Generate
              </Button>
            </div>
            <div className="grid gap-3">
              {suggestions?.images?.map((image) => (
                <div key={image?.id} className="group relative">
                  <div className="aspect-video rounded-lg overflow-hidden border border-border">
                    <Image
                      src={image?.url}
                      alt={image?.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Plus"
                      onClick={() => onApplySuggestion('image', image)}
                    >
                      Add to Slide
                    </Button>
                  </div>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                      {image?.category}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {image?.prompt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'icons' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Icon Suggestions</h3>
              <Button
                variant="outline"
                size="xs"
                iconName="Shuffle"
                onClick={handleGenerateMore}
                loading={isGenerating}
              >
                Refresh
              </Button>
            </div>
            <div className="grid gap-2">
              {suggestions?.icons?.map((icon, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:border-border hover:bg-accent/30 transition-all cursor-pointer group"
                  onClick={() => onApplySuggestion('icon', icon)}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={icon?.name} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">{icon?.category}</span>
                      <Icon name="Plus" size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted-foreground">{icon?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Chart Recommendations</h3>
              <Button
                variant="outline"
                size="xs"
                iconName="BarChart3"
                onClick={handleGenerateMore}
                loading={isGenerating}
              >
                Analyze
              </Button>
            </div>
            <div className="grid gap-3">
              {suggestions?.charts?.map((chart, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/30 transition-all cursor-pointer group"
                  onClick={() => onApplySuggestion('chart', chart)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={chart?.icon} size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">{chart?.type}</h4>
                        <Icon name="ArrowRight" size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{chart?.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeSuggestionsSidebar;