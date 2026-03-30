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

export const HeroVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Background gradient animation
  const gradientAngle = interpolate(frame, [0, 300], [135, 180], {
    extrapolateRight: 'clamp',
  });

  // Gold divider line that grows
  const dividerWidth = interpolate(frame, [150, 210], [0, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientAngle}deg, ${theme.colors.brownDark} 0%, ${theme.colors.brownBase} 40%, ${theme.colors.brownMid} 70%, ${theme.colors.brownDark} 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Main title */}
      <Sequence from={0}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <GoldText text="Otter Valley" fontSize={120} delay={15} />
        </AbsoluteFill>
      </Sequence>

      {/* Subtitle */}
      <Sequence from={30}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 140,
          }}
        >
          <GoldText text="Rod & Gun Club" fontSize={60} delay={30} />
        </AbsoluteFill>
      </Sequence>

      {/* Gold divider */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 240,
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
      <Sequence from={120}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 310,
          }}
        >
          <GoldText text="50 Acres of Tradition" fontSize={40} delay={15} />
        </AbsoluteFill>
      </Sequence>

      {/* Location */}
      <Sequence from={180}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 390,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 24,
              color: theme.colors.cream,
              opacity: interpolate(frame - 180, [0, 30], [0, 0.8], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            Straffordville, Ontario
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Film grain overlay */}
      <FilmGrain />
    </AbsoluteFill>
  );
};
