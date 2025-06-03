import React, { useState } from 'react';
import './ProgressSlider.css';

interface ProgressSliderProps {
  clientName: string;
  initialProgress?: number;
  initialNotes?: string;
  onProgressChange?: (progress: number) => void;
  onNameChange?: (newName: string) => void;
  onNotesChange?: (notes: string) => void;
}

const ProgressSlider: React.FC<ProgressSliderProps> = ({
  clientName,
  initialProgress = 0,
  initialNotes = '',
  onProgressChange,
  onNameChange,
  onNotesChange
}) => {
  const [progress, setProgress] = useState(initialProgress);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(clientName);
  const [notes, setNotes] = useState(initialNotes);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    updateProgress(e);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging) {
      updateProgress(e);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const updateProgress = (e: React.MouseEvent | React.TouchEvent) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    let clientX: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setProgress(percentage);
    onProgressChange?.(percentage);
  };

  const getColor = (percentage: number) => {
    if (percentage < 33) {
      return `rgb(255, ${Math.round((percentage / 33) * 255)}, 0)`;
    } else if (percentage < 66) {
      return `rgb(${Math.round(255 - ((percentage - 33) / 33) * 255)}, 255, 0)`;
    } else {
      return `rgb(0, ${Math.round(255 - ((percentage - 66) / 34) * 128)}, 0)`;
    }
  };

  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleNameSubmit = () => {
    if (editedName.trim()) {
      onNameChange?.(editedName);
    } else {
      setEditedName(clientName);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setEditedName(clientName);
      setIsEditing(false);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    onNotesChange?.(newNotes);
  };

  const toggleNotes = () => {
    setIsNotesOpen(!isNotesOpen);
  };

  return (
    <div className="progress-slider-container">
      <div className="client-name-container">
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={handleNameChange}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyPress}
            className="client-name-input"
            autoFocus
          />
        ) : (
          <div className="client-name" onClick={handleNameClick}>
            {clientName}
          </div>
        )}
      </div>
      <div
        className="progress-slider"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
            backgroundColor: getColor(progress)
          }}
        />
        <div className="progress-handle" style={{ left: `${progress}%` }} />
      </div>
      <div className="progress-value">{Math.round(progress)}%</div>
      <button 
        className={`notes-toggle ${isNotesOpen ? 'open' : ''}`}
        onClick={toggleNotes}
        aria-label="Toggle notes"
      >
        <span className="arrow-icon"></span>
      </button>
      {isNotesOpen && (
        <div className="notes-container">
          <textarea
            className="notes-textarea"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add notes about this project..."
          />
        </div>
      )}
    </div>
  );
};

export default ProgressSlider; 