import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SlideCard = ({ 
  slide, 
  index, 
  onUpdateSlide, 
  onDeleteSlide, 
  onExpandContent, 
  isActive, 
  onClick,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(slide?.title);
  const [editedBullets, setEditedBullets] = useState(slide?.bullets);

  const handleSave = () => {
    onUpdateSlide(slide?.id, {
      ...slide,
      title: editedTitle,
      bullets: editedBullets
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(slide?.title);
    setEditedBullets(slide?.bullets);
    setIsEditing(false);
  };

  const addBulletPoint = () => {
    setEditedBullets([...editedBullets, '']);
  };

  const removeBulletPoint = (bulletIndex) => {
    setEditedBullets(editedBullets?.filter((_, i) => i !== bulletIndex));
  };

  const updateBulletPoint = (bulletIndex, value) => {
    const newBullets = [...editedBullets];
    newBullets[bulletIndex] = value;
    setEditedBullets(newBullets);
  };

  return (
    <div
      className={`
        bg-card border-2 rounded-lg p-6 transition-all duration-200 cursor-pointer
        ${isActive 
          ? 'border-primary shadow-elevation-2 bg-primary/5' 
          : 'border-border hover:border-primary/50 hover:shadow-elevation-1'
        }
      `}
      onClick={onClick}
      draggable
      onDragStart={(e) => onDragStart(e, slide?.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, slide?.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{index + 1}</span>
          </div>
          <Icon name="GripVertical" size={16} className="text-muted-foreground cursor-grab" />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            iconName="Wand2"
            onClick={(e) => {
              e?.stopPropagation();
              onExpandContent(slide?.id);
            }}
            className="text-secondary hover:text-secondary/80"
          />
          <Button
            variant="ghost"
            size="icon"
            iconName={isEditing ? "Check" : "Edit3"}
            onClick={(e) => {
              e?.stopPropagation();
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          />
          {isEditing && (
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              onClick={(e) => {
                e?.stopPropagation();
                handleCancel();
              }}
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            iconName="Trash2"
            onClick={(e) => {
              e?.stopPropagation();
              onDeleteSlide(slide?.id);
            }}
            className="text-destructive hover:text-destructive/80"
          />
        </div>
      </div>
      {isEditing ? (
        <div className="space-y-4">
          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e?.target?.value)}
            placeholder="Slide title..."
            className="font-semibold"
          />
          
          <div className="space-y-2">
            {editedBullets?.map((bullet, bulletIndex) => (
              <div key={bulletIndex} className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={bullet}
                  onChange={(e) => updateBulletPoint(bulletIndex, e?.target?.value)}
                  placeholder="Bullet point..."
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  iconName="Trash2"
                  onClick={() => removeBulletPoint(bulletIndex)}
                  className="text-destructive hover:text-destructive/80"
                />
              </div>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={addBulletPoint}
              className="w-full"
            >
              Add Bullet Point
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">
            {slide?.title}
          </h3>
          
          <ul className="space-y-2">
            {slide?.bullets?.map((bullet, bulletIndex) => (
              <li key={bulletIndex} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-muted-foreground text-sm leading-relaxed">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {slide?.speakerNotes && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="MessageSquare" size={14} className="text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Speaker Notes</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {slide?.speakerNotes}
          </p>
        </div>
      )}
    </div>
  );
};

export default SlideCard;