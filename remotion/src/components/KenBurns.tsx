import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

interface KenBurnsProps {
  src: string;
  direction?: 'in' | 'out';
  duration?: number;
}

export const KenBurns: React.FC<KenBurnsProps> = ({
  src,
  direction = 'in',
  duration = 150,
}) => {
  const frame = useCurrentFrame();

  const scaleStart = direction === 'in' ? 1 : 1.15;
  const scaleEnd = direction === 'in' ? 1.15 : 1;

  const scale = interpolate(frame, [0, duration], [scaleStart, scaleEnd], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateX = interpolate(frame, [0, duration], [0, direction === 'in' ? -15 : 15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateX(${translateX}px)`,
        }}
      />
    </div>
  );
};
