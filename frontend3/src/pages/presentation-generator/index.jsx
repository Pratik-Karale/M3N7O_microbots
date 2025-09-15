import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import ExportButton from '../../components/ui/ExportButton';
import PresentationForm from './components/PresentationForm';
import SlidesContainer from './components/SlidesContainer';
import SuggestionsSidebar from './components/SuggestionsSidebar';
import LoadingState from './components/LoadingState';
import Icon from '../../components/AppIcon';


const PresentationGenerator = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [slides, setSlides] = useState([]);
  const [activeSlideId, setActiveSlideId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (formData) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);
    
    try {
      // Create FormData object for multipart/form-data
      const apiFormData = new FormData();
      apiFormData?.append('topic', formData?.topic);
      apiFormData?.append('slideCount', formData?.slideCount?.toString());
      
      // Append additional data for context
      apiFormData?.append('audience', formData?.audience);
      apiFormData?.append('style', formData?.style);
      
      // Append files if any
      formData?.files?.forEach((file, index) => {
        apiFormData?.append('files', file);
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);

      // Make API call to generate outline
      const response = await fetch('http://localhost:5001/api/generate', {
        method: 'POST',
        body: apiFormData,
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (!response?.ok) {
        const errorData = await response?.text();
        throw new Error(`API Error: ${response?.status} - ${errorData || 'Failed to generate presentation'}`);
      }

      const result = await response?.json();

      if (!result?.slides || !Array.isArray(result?.slides)) {
        throw new Error('Invalid response format: missing slides array');
      }

      // Transform API response to internal format
      const transformedSlides = result?.slides?.map((slide, index) => ({
        id: `slide-${index + 1}`,
        title: slide?.title || `Slide ${index + 1}`,
        bullets: Array.isArray(slide?.points) ? slide?.points : slide?.bullets || [],
        speakerNotes: slide?.speakerNotes || slide?.notes || ''
      }));

      setSlides(transformedSlides);
      setActiveSlideId(transformedSlides?.[0]?.id);
      setHasGenerated(true);
      
    } catch (error) {
      console.error('Generation failed:', error);
      setError(error?.message || 'Failed to generate presentation. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleUpdateSlide = (slideId, updatedSlide) => {
    setSlides(prevSlides =>
      prevSlides?.map(slide =>
        slide?.id === slideId ? updatedSlide : slide
      )
    );
  };

  const handleDeleteSlide = (slideId) => {
    setSlides(prevSlides => prevSlides?.filter(slide => slide?.id !== slideId));
    
    if (activeSlideId === slideId) {
      const remainingSlides = slides?.filter(slide => slide?.id !== slideId);
      setActiveSlideId(remainingSlides?.[0]?.id || null);
    }
  };

  const handleAddSlide = (newSlide) => {
    setSlides(prevSlides => [...prevSlides, newSlide]);
    setActiveSlideId(newSlide?.id);
  };

  const handleExpandContent = async (slideId) => {
    // Simulate AI content expansion
    const slide = slides?.find(s => s?.id === slideId);
    if (slide) {
      const expandedBullets = [
        ...slide?.bullets,
        'AI-generated additional insight',
        'Enhanced detail based on context'
      ];
      
      handleUpdateSlide(slideId, {
        ...slide,
        bullets: expandedBullets
      });
    }
  };

  const handleReorderSlides = (reorderedSlides) => {
    setSlides(reorderedSlides);
  };

  const handleSlideSelect = (slideId) => {
    setActiveSlideId(slideId);
  };

  const handleExport = async (format) => {
    if (format === 'pptx') {
      try {
        setError(null);
        
        // Prepare data for export API
        const exportData = {
          templateId: 'dark', // Default template, could be made configurable
          slides: slides?.map(slide => ({
            title: slide?.title,
            points: slide?.bullets || []
          }))
        };

        // Make API call to export presentation
        const response = await fetch('http://localhost:5001/api/export/final', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(exportData)
        });

        if (!response?.ok) {
          const errorData = await response?.text();
          throw new Error(`Export failed: ${response?.status} - ${errorData || 'Failed to export presentation'}`);
        }

        // Handle file blob download
        const blob = await response?.blob();
        
        // Verify we got the correct content type
        const contentType = response?.headers?.get('content-type');
        if (!contentType?.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
          console.warn('Unexpected content type:', contentType);
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `presentation-${new Date()?.toISOString()?.split('T')?.[0]}.pptx`;
        document.body?.appendChild(link);
        link?.click();
        
        // Cleanup
        document.body?.removeChild(link);
        URL.revokeObjectURL(url);

        return { success: true, format: 'pptx' };
        
      } catch (error) {
        console.error('Export failed:', error);
        setError(error?.message || 'Failed to export presentation. Please try again.');
        throw error;
      }
    } else {
      // For other formats, use existing logic
      const exportData = {
        title: 'Generated Presentation',
        slides: slides,
        format: format,
        exportedAt: new Date()?.toISOString()
      };
      
      return exportData;
    }
  };

  const handleTabChange = (tabName) => {
    navigate(`/${tabName}`);
  };

  const activeSlide = slides?.find(slide => slide?.id === activeSlideId);
  const activeSlideWithIndex = activeSlide ? {
    ...activeSlide,
    index: slides?.findIndex(slide => slide?.id === activeSlideId)
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation activeTab="generate" onTabChange={handleTabChange} />
      
      {error && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-3">
          <div className="container mx-auto flex items-center text-destructive">
            <Icon name="AlertTriangle" size={16} className="mr-2" />
            <span className="text-sm">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-destructive hover:text-destructive/80"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}
      
      <main className="flex-1">
        {!hasGenerated ? (
          <div className="container mx-auto px-6 py-12">
            <PresentationForm 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
        ) : (
          <div className="flex h-[calc(100vh-8rem)]">
            <SlidesContainer
              slides={slides}
              onUpdateSlide={handleUpdateSlide}
              onDeleteSlide={handleDeleteSlide}
              onAddSlide={handleAddSlide}
              onExpandContent={handleExpandContent}
              onReorderSlides={handleReorderSlides}
              activeSlideId={activeSlideId}
              onSlideSelect={handleSlideSelect}
            />
            
            <SuggestionsSidebar
              activeSlide={activeSlideWithIndex}
              isCollapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>
        )}
      </main>
      {hasGenerated && (
        <ExportButton 
          onExport={handleExport}
          disabled={slides?.length === 0}
        />
      )}
      <LoadingState 
        isVisible={isGenerating}
        progress={generationProgress}
      />
    </div>
  );
};

export default PresentationGenerator;