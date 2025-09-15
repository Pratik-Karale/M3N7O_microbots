import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import BulletPointEditor from './BulletPointEditor';
import SpeakerNotesPanel from './SpeakerNotesPanel';

const SlideEditor = ({ 
  slide, 
  onUpdate, 
  onAddBulletPoint, 
  onExpandBulletPoint 
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(slide?.title || '');
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);

  if (!slide) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card rounded-lg border border-border">
        <div className="text-center space-y-4">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-medium text-foreground">No Slide Selected</h3>
            <p className="text-muted-foreground">Select a slide from the sidebar to start editing</p>
          </div>
        </div>
      </div>
    );
  }

  const handleTitleSave = () => {
    onUpdate(slide?.id, { ...slide, title: editTitle });
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditTitle(slide?.title);
    setIsEditingTitle(false);
  };

  const handleBulletPointUpdate = (index, newText) => {
    const updatedBulletPoints = [...slide?.bulletPoints];
    updatedBulletPoints[index] = newText;
    onUpdate(slide?.id, { ...slide, bulletPoints: updatedBulletPoints });
  };

  const handleBulletPointDelete = (index) => {
    const updatedBulletPoints = slide?.bulletPoints?.filter((_, i) => i !== index);
    onUpdate(slide?.id, { ...slide, bulletPoints: updatedBulletPoints });
  };

  const handleBulletPointReorder = (fromIndex, toIndex) => {
    const updatedBulletPoints = [...slide?.bulletPoints];
    const [movedItem] = updatedBulletPoints?.splice(fromIndex, 1);
    updatedBulletPoints?.splice(toIndex, 0, movedItem);
    onUpdate(slide?.id, { ...slide, bulletPoints: updatedBulletPoints });
  };

  const handleSpeakerNotesUpdate = (notes) => {
    onUpdate(slide?.id, { ...slide, speakerNotes: notes });
  };

  return (
    <div className="flex-1 bg-card rounded-lg border border-border overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={20} className="text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Slide {slide?.id}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Copy"
              iconPosition="left"
            >
              Duplicate
            </Button>
            <Button
              variant="ghost"
              size="icon"
              iconName="MoreHorizontal"
            />
          </div>
        </div>

        {isEditingTitle ? (
          <div className="space-y-3">
            <textarea
              value={editTitle}
              onChange={(e) => setEditTitle(e?.target?.value)}
              className="w-full px-4 py-3 text-xl font-semibold bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={2}
              autoFocus
              onKeyDown={(e) => {
                if (e?.key === 'Enter' && e?.ctrlKey) handleTitleSave();
                if (e?.key === 'Escape') handleTitleCancel();
              }}
            />
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleTitleSave}
                iconName="Check"
                iconPosition="left"
              >
                Save Title
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTitleCancel}
                iconName="X"
                iconPosition="left"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <h1 
            className="text-2xl font-semibold text-foreground cursor-text hover:bg-accent/30 p-2 rounded-lg transition-colors"
            onClick={() => setIsEditingTitle(true)}
          >
            {slide?.title}
          </h1>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">Content</h2>
            <Button
              variant="outline"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              onClick={() => onAddBulletPoint(slide?.id)}
            >
              Add Point
            </Button>
          </div>

          <div className="space-y-2">
            {slide?.bulletPoints?.map((bulletPoint, index) => (
              <BulletPointEditor
                key={index}
                bulletPoint={bulletPoint}
                index={index}
                onUpdate={handleBulletPointUpdate}
                onDelete={handleBulletPointDelete}
                onReorder={handleBulletPointReorder}
                onExpand={(idx) => onExpandBulletPoint(slide?.id, idx)}
              />
            ))}
          </div>

          {slide?.bulletPoints?.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <Icon name="Plus" size={32} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Content Yet</h3>
              <p className="text-muted-foreground mb-4">Add your first bullet point to get started</p>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => onAddBulletPoint(slide?.id)}
              >
                Add Bullet Point
              </Button>
            </div>
          )}
        </div>
      </div>
      <SpeakerNotesPanel
        notes={slide?.speakerNotes}
        onUpdate={handleSpeakerNotesUpdate}
        isVisible={showSpeakerNotes}
        onToggle={() => setShowSpeakerNotes(!showSpeakerNotes)}
      />
    </div>
  );
};

export default SlideEditor;