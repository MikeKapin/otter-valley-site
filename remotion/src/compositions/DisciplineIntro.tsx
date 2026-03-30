import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
} from 'remotion';
import { GoldText } from '../components/GoldText';
import { FilmGrain } from '../components/FilmGrain';
import { theme } from '../styles/theme';

interface DisciplineIntroProps {
  disciplineName: string;
  tagline: string;
}

export const DisciplineIntro: React.FC<DisciplineIntroProps> = ({
  disciplineName,
  tagline,
}) => {
  const frame = useCurrentFrame();

  // Background gradient shift
  const gradientPos = interpolate(frame, [0, 150], [0, 50], {
    extrapolateRight: 'clamp',
  });

  // Gold divider line
  const dividerWidth = interpolate(frame, [60, 100], [0, 120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Tagline fade
  const taglineOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const taglineY = interpolate(frame, [60, 90], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${theme.colors.brownDark} ${gradientPos}%, ${theme.colors.brownBase} ${gradientPos + 30}%, ${theme.colors.brownMid} 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Discipline name */}
      <Sequence from={0}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <GoldText text={disciplineName} fontSize={90} delay={10} />
        </AbsoluteFill>
      </Sequence>

      {/* Gold divider */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 120,
        }}
      >
        <div
          style={{
            width: dividerWidth,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${theme.colors.gold}, transparent)`,
          }}
        />
      </AbsoluteFill>

      {/* Tagline */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 180,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 28,
            color: theme.colors.cream,
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          {tagline}
        </div>
      </AbsoluteFill>

      <FilmGrain />
    </AbsoluteFill>
  );
};
