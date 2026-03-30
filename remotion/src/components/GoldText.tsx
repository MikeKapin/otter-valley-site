import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../styles/theme';

interface GoldTextProps {
  text: string;
  fontSize?: number;
  delay?: number;
}

export const GoldText: React.FC<GoldTextProps> = ({
  text,
  fontSize = 80,
  delay = 0,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame - delay, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(frame - delay, [0, 30], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        fontFamily: theme.fonts.heading,
        fontSize,
        fontWeight: 700,
        color: theme.colors.gold,
        opacity,
        transform: `translateY(${translateY}px)`,
        textAlign: 'center',
        lineHeight: 1.1,
      }}
    >
      {text}
    </div>
  );
};
