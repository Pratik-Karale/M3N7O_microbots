import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SpeakerNotesPanel = ({ 
  notes, 
  onUpdate, 
  isVisible, 
  onToggle 
}) => {
  const [editNotes, setEditNotes] = useState(notes || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleNotesChange = (value) => {
    setEditNotes(value);
    setHasUnsavedChanges(value !== notes);
  };

  const handleSave = () => {
    onUpdate(editNotes);
    setHasUnsavedChanges(false);
  };

  const handleDiscard = () => {
    setEditNotes(notes || '');
    setHasUnsavedChanges(false);
  };

  return (
    <div className="border-t border-border bg-card">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={18} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Speaker Notes</h3>
          {hasUnsavedChanges && (
            <div className="w-2 h-2 bg-warning rounded-full" />
          )}
        </div>
        <Icon 
          name={isVisible ? "ChevronDown" : "ChevronRight"} 
          size={18} 
          className="text-muted-foreground transition-transform duration-200" 
        />
      </div>
      {isVisible && (
        <div className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <textarea
              value={editNotes}
              onChange={(e) => handleNotesChange(e?.target?.value)}
              placeholder="Add speaker notes to help guide your presentation delivery..."
              className="w-full h-32 px-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              These notes are only visible to you during presentation mode
            </p>
          </div>

          {hasUnsavedChanges && (
            <div className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-warning" />
                <span className="text-sm text-warning">You have unsaved changes</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleDiscard}
                  iconName="X"
                  iconPosition="left"
                >
                  Discard
                </Button>
                <Button
                  variant="default"
                  size="xs"
                  onClick={handleSave}
                  iconName="Save"
                  iconPosition="left"
                >
                  Save Notes
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{editNotes?.length} characters</span>
            <span>Ctrl+S to save</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakerNotesPanel;