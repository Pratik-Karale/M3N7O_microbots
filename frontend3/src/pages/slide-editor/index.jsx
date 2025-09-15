import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import ExportButton from '../../components/ui/ExportButton';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import SlideCard from './components/SlideCard';
import SlideEditor from './components/SlideEditor';
import CreativeSuggestionsSidebar from './components/CreativeSuggestionsSidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const SlideEditorPage = () => {
  const [slides, setSlides] = useState([]);
  const [activeSlideId, setActiveSlideId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Initialize with mock data
  useEffect(() => {
    const mockSlides = [
      {
        id: 1,
        title: "Introduction to Digital Transformation",
        bulletPoints: [
          "Digital transformation is reshaping how businesses operate and deliver value to customers",
          "Companies must adapt to stay competitive in the digital age",
          "Technology integration affects every aspect of business operations",
          "Customer expectations are driving the need for digital solutions"
        ],
        speakerNotes: "Welcome everyone to today's presentation on digital transformation. This is a critical topic for businesses today as we navigate an increasingly digital world."
      },
      {
        id: 2,
        title: "Key Benefits of Digital Transformation",
        bulletPoints: [
          "Improved operational efficiency through automation",
          "Enhanced customer experience and engagement",
          "Better data-driven decision making capabilities",
          "Increased agility and faster time-to-market"
        ],
        speakerNotes: "Let's explore the main benefits that organizations can achieve through successful digital transformation initiatives."
      },
      {
        id: 3,
        title: "Implementation Challenges",
        bulletPoints: [
          "Legacy system integration complexities",
          "Change management and employee resistance",
          "Budget constraints and resource allocation",
          "Cybersecurity and data privacy concerns"
        ],
        speakerNotes: "While the benefits are clear, organizations face several challenges when implementing digital transformation strategies."
      },
      {
        id: 4,
        title: "Best Practices for Success",
        bulletPoints: [
          "Start with a clear digital strategy and roadmap",
          "Invest in employee training and change management",
          "Choose the right technology partners and solutions",
          "Measure progress with key performance indicators"
        ],
        speakerNotes: "To overcome these challenges, here are the best practices that successful organizations follow."
      },
      {
        id: 5,
        title: "Future Outlook and Trends",
        bulletPoints: [
          "Artificial Intelligence and Machine Learning integration",
          "Internet of Things (IoT) expansion across industries",
          "Cloud-first strategies becoming the norm",
          "Sustainable and green technology adoption"
        ],
        speakerNotes: "Looking ahead, these emerging trends will shape the future of digital transformation."
      }
    ];

    setSlides(mockSlides);
    setActiveSlideId(mockSlides?.[0]?.id || null);
  }, []);

  const activeSlide = slides?.find(slide => slide?.id === activeSlideId);

  // Add missing tab change handler
  const handleTabChange = (tab) => {
    // This function handles tab navigation
    console.log('Tab changed to:', tab);
  };

  const handleSlideSelect = (slideId) => {
    setActiveSlideId(slideId);
  };

  const handleSlideUpdate = (slideId, updatedSlide) => {
    setSlides(slides?.map(slide => 
      slide?.id === slideId ? updatedSlide : slide
    ));
  };

  const handleSlideDelete = (slideId) => {
    const updatedSlides = slides?.filter(slide => slide?.id !== slideId);
    setSlides(updatedSlides);
    
    if (activeSlideId === slideId) {
      setActiveSlideId(updatedSlides?.[0]?.id || null);
    }
  };

  const handleSlideReorder = (fromIndex, toIndex) => {
    const updatedSlides = [...slides];
    const [movedSlide] = updatedSlides?.splice(fromIndex, 1);
    updatedSlides?.splice(toIndex, 0, movedSlide);
    setSlides(updatedSlides);
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: Math.max(...slides?.map(s => s?.id), 0) + 1,
      title: "New Slide Title",
      bulletPoints: ["Add your first bullet point here"],
      speakerNotes: ""
    };
    
    setSlides([...slides, newSlide]);
    setActiveSlideId(newSlide?.id);
  };

  const handleAddBulletPoint = (slideId) => {
    const slide = slides?.find(s => s?.id === slideId);
    if (slide) {
      const updatedSlide = {
        ...slide,
        bulletPoints: [...slide?.bulletPoints, "New bullet point"]
      };
      handleSlideUpdate(slideId, updatedSlide);
    }
  };

  const handleExpandBulletPoint = async (slideId, bulletIndex) => {
    setIsLoading(true);
    setLoadingMessage('Expanding bullet point with AI...');
    
    try {
      // Simulate AI expansion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const slide = slides?.find(s => s?.id === slideId);
      if (slide) {
        const expandedText = slide?.bulletPoints?.[bulletIndex] + " - with detailed explanation and supporting evidence that provides comprehensive context for better understanding";
        const updatedBulletPoints = [...slide?.bulletPoints];
        updatedBulletPoints[bulletIndex] = expandedText;
        
        handleSlideUpdate(slideId, {
          ...slide,
          bulletPoints: updatedBulletPoints
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = async (type, suggestion) => {
    setIsLoading(true);
    setLoadingMessage(`Applying ${type} suggestion...`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (activeSlide) {
        let updatedSlide = { ...activeSlide };
        
        switch (type) {
          case 'image':
            updatedSlide?.bulletPoints?.push(`Image suggestion: ${suggestion?.prompt}`);
            break;
          case 'icon':
            updatedSlide?.bulletPoints?.push(`Icon: ${suggestion?.category} - ${suggestion?.description}`);
            break;
          case 'chart':
            updatedSlide?.bulletPoints?.push(`Chart: ${suggestion?.type} - ${suggestion?.description}`);
            break;
        }
        
        handleSlideUpdate(activeSlide?.id, updatedSlide);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format) => {
    setIsLoading(true);
    setLoadingMessage(`Exporting presentation as ${format?.toUpperCase()}...`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const exportData = {
        title: "PresentationCraft Export",
        slides: slides,
        exportedAt: new Date()?.toISOString(),
        format: format
      };
      
      console.log('Exported data:', exportData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background">
        <Header />
        <TabNavigation activeTab="edit" onTabChange={handleTabChange} />
        
        <div className="flex h-[calc(100vh-8rem)]">
          {/* Slides Sidebar */}
          <div className="w-80 bg-card border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Slides</h2>
                <span className="text-sm text-muted-foreground">
                  {slides?.length} slide{slides?.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Button
                variant="default"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                onClick={handleAddSlide}
                fullWidth
              >
                Add New Slide
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {slides?.map((slide, index) => (
                <SlideCard
                  key={slide?.id}
                  slide={slide}
                  index={index}
                  isActive={slide?.id === activeSlideId}
                  onSelect={handleSlideSelect}
                  onUpdate={handleSlideUpdate}
                  onDelete={handleSlideDelete}
                  onReorder={handleSlideReorder}
                />
              ))}
              
              {slides?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Slides Yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first slide to get started</p>
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={handleAddSlide}
                  >
                    Create First Slide
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Main Editor */}
          <div className="flex-1 p-6">
            <SlideEditor
              slide={activeSlide}
              onUpdate={handleSlideUpdate}
              onAddBulletPoint={handleAddBulletPoint}
              onExpandBulletPoint={handleExpandBulletPoint}
            />
          </div>

          {/* Creative Suggestions Sidebar */}
          <CreativeSuggestionsSidebar
            activeSlide={activeSlide}
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            onApplySuggestion={handleApplySuggestion}
          />
        </div>

        <ExportButton onExport={handleExport} />
        <LoadingOverlay 
          isVisible={isLoading} 
          message={loadingMessage}
        />
      </div>
    </DndProvider>
  );
};

export default SlideEditorPage;