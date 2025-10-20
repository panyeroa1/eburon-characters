/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { Persona } from '../personas';
import Spinner from './Spinner';
import './PersonaCard.css';

interface PersonaCardProps {
  persona: Persona;
  isLoading: boolean;
  isPlaying: boolean;
  hasError: boolean;
  onPlay: () => void;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ persona, isLoading, isPlaying, hasError, onPlay }) => {
  const getButtonIcon = () => {
    if (isLoading) return <Spinner />;
    if (isPlaying) return <span className="icon">stop_circle</span>;
    if (hasError) return <span className="icon">error</span>;
    return <span className="icon">play_circle</span>;
  };
  
  return (
    <div className={`persona-card ${isPlaying ? 'playing' : ''}`}>
      <div className="card-content">
        <div className="avatar-container">
          <span className="icon avatar-icon">{persona.avatar}</span>
        </div>
        <div className="text-content">
          <h3 className="persona-name">{persona.name}</h3>
          <p className="persona-tagline">{persona.tagline}</p>
        </div>
      </div>
      <button 
        className={`play-button ${hasError ? 'error' : ''}`}
        onClick={onPlay} 
        disabled={isLoading}
        aria-label={`Play sample for ${persona.name}`}
      >
        {getButtonIcon()}
      </button>
    </div>
  );
};

export default PersonaCard;
