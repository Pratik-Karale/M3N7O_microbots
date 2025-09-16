import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import SlideCard from './SlideCard';
import Icon from '../../../components/AppIcon';

const SlidesContainer = ({ 
  slides, 
  onUpdateSlide, 
  onDeleteSlide, 
  onAddSlide, 
  onExpandContent,
  onReorderSlides,
  activeSlideId,
  onSlideSelect
}) => {
  const [draggedSlideId, setDraggedSlideId] = useState(null);

  const handleDragStart = (e, slideId) => {
    setDraggedSlideId(slideId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetSlideId) => {
    e?.preventDefault();
    
    if (draggedSlideId && draggedSlideId !== targetSlideId) {
      const draggedIndex = slides?.findIndex(slide => slide?.id === draggedSlideId);
      const targetIndex = slides?.findIndex(slide => slide?.id === targetSlideId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newSlides = [...slides];
        const [draggedSlide] = newSlides?.splice(draggedIndex, 1);
        newSlides?.splice(targetIndex, 0, draggedSlide);
        onReorderSlides(newSlides);
      }
    }
    
    setDraggedSlideId(null);
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      title: 'New Slide',
      bullets: ['Add your content here'],
      speakerNotes: ''
    };
    onAddSlide(newSlide);
  };

  if (slides?.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No slides yet</h3>
          <p className="text-muted-foreground mb-4">
            Generate your first presentation to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Your Presentation</h2>
          <p className="text-sm text-muted-foreground">
            {slides?.length} slide{slides?.length !== 1 ? 's' : ''} • Click to edit, drag to reorder
          </p>
        </div>
        
        <Button
          variant="outline"
          iconName="Plus"
          iconPosition="left"
          onClick={handleAddSlide}
        >
          Add Slide
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4 max-w-4xl">
          {slides?.map((slide, index) => (
            <SlideCard
              key={slide?.id}
              slide={slide}
              index={index}
              onUpdateSlide={onUpdateSlide}
              onDeleteSlide={onDeleteSlide}
              onExpandContent={onExpandContent}
              isActive={slide?.id === activeSlideId}
              onClick={() => onSlideSelect(slide?.id)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlidesContainer;