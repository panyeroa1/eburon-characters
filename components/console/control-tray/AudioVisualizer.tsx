/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

type AudioVisualizerProps = {
  volume: number;
  muted: boolean;
};

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ volume, muted }) => {
  const numCircles = 3;
  const circles = [];

  for (let i = 0; i < numCircles; i++) {
    // Make the effect more pronounced but clamp it
    const scaleMultiplier = Math.min(1 + volume * (5 + i * 2), 2.5);
    const opacityMultiplier = Math.min(volume * (1.5 + i), 0.5);

    const scale = muted ? 1 : scaleMultiplier;
    const opacity = muted ? 0 : opacityMultiplier;

    const style = {
      transform: `scale(${scale})`,
      opacity: opacity,
      transitionDelay: `${i * 50}ms`,
    };

    circles.push(<div key={i} className="visualizer-circle" style={style} />);
  }

  return <div className="audio-visualizer">{circles}</div>;
};

export default AudioVisualizer;
