import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SlideCard = ({ 
  slide, 
  isActive, 
  onSelect, 
  onUpdate, 
  onDelete, 
  onReorder,
  index 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(slide?.title);

  const [{ isDragging }, drag] = useDrag({
    type: 'slide',
    item: { id: slide?.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'slide',
    hover: (draggedItem) => {
      if (draggedItem?.index !== index) {
        onReorder(draggedItem?.index, index);
        draggedItem.index = index;
      }
    },
  });

  const handleTitleSave = () => {
    onUpdate(slide?.id, { ...slide, title: editTitle });
    setIsEditing(false);
  };

  const handleTitleCancel = () => {
    setEditTitle(slide?.title);
    setIsEditing(false);
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        relative p-4 rounded-lg border transition-all duration-200 cursor-pointer
        ${isActive 
          ? 'border-primary bg-primary/5 shadow-elevation-2' 
          : 'border-border bg-card hover:border-primary/50 hover:bg-accent/30'
        }
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
      `}
      onClick={() => onSelect(slide?.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name="GripVertical" size={16} className="text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Slide {index + 1}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          iconName="Trash2"
          onClick={(e) => {
            e?.stopPropagation();
            onDelete(slide?.id);
          }}
          className="h-6 w-6 text-muted-foreground hover:text-error"
        />
      </div>
      <div className="space-y-3">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e?.target?.value)}
              className="w-full px-2 py-1 text-sm font-medium bg-input border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
              onKeyDown={(e) => {
                if (e?.key === 'Enter') handleTitleSave();
                if (e?.key === 'Escape') handleTitleCancel();
              }}
            />
            <div className="flex space-x-1">
              <Button
                variant="default"
                size="xs"
                onClick={handleTitleSave}
                iconName="Check"
              />
              <Button
                variant="ghost"
                size="xs"
                onClick={handleTitleCancel}
                iconName="X"
              />
            </div>
          </div>
        ) : (
          <h3 
            className="font-medium text-sm text-foreground line-clamp-2 cursor-text"
            onClick={(e) => {
              e?.stopPropagation();
              setIsEditing(true);
            }}
          >
            {slide?.title}
          </h3>
        )}

        <div className="space-y-1">
          {slide?.bulletPoints?.slice(0, 3)?.map((point, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
              <p className="text-xs text-muted-foreground line-clamp-1">
                {point}
              </p>
            </div>
          ))}
          {slide?.bulletPoints?.length > 3 && (
            <p className="text-xs text-muted-foreground/70 italic">
              +{slide?.bulletPoints?.length - 3} more points
            </p>
          )}
        </div>
      </div>
      {isActive && (
        <div className="absolute -right-1 -top-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
      )}
    </div>
  );
};

export default SlideCard;