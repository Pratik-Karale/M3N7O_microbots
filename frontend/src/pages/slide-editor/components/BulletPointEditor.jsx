import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulletPointEditor = ({ 
  bulletPoint, 
  index, 
  onUpdate, 
  onDelete, 
  onReorder, 
  onExpand 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(bulletPoint);
  const [isExpanding, setIsExpanding] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'bulletPoint',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'bulletPoint',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        onReorder(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const handleSave = () => {
    onUpdate(index, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(bulletPoint);
    setIsEditing(false);
  };

  const handleExpand = async () => {
    setIsExpanding(true);
    try {
      await onExpand(index);
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        group flex items-start space-x-3 p-3 rounded-lg border transition-all duration-200
        ${isDragging ? 'opacity-50 bg-accent/50' : 'border-transparent hover:border-border hover:bg-accent/30'}
      `}
    >
      <div className="flex items-center space-x-2 mt-1">
        <Icon 
          name="GripVertical" 
          size={14} 
          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" 
        />
        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
      </div>
      <div className="flex-1 space-y-2">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e?.target?.value)}
              className="w-full px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={3}
              autoFocus
              onKeyDown={(e) => {
                if (e?.key === 'Enter' && e?.ctrlKey) handleSave();
                if (e?.key === 'Escape') handleCancel();
              }}
            />
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="xs"
                onClick={handleSave}
                iconName="Check"
                iconPosition="left"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={handleCancel}
                iconName="X"
                iconPosition="left"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p 
            className="text-sm text-foreground leading-relaxed cursor-text"
            onClick={() => setIsEditing(true)}
          >
            {bulletPoint}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          iconName="Wand2"
          onClick={handleExpand}
          loading={isExpanding}
          className="h-7 w-7 text-muted-foreground hover:text-primary"
          title="Expand with AI"
        />
        <Button
          variant="ghost"
          size="icon"
          iconName="Trash2"
          onClick={() => onDelete(index)}
          className="h-7 w-7 text-muted-foreground hover:text-error"
          title="Delete bullet point"
        />
      </div>
    </div>
  );
};

export default BulletPointEditor;