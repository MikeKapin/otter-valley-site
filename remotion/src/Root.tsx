import React from 'react';
import { Composition } from 'remotion';
import { HeroVideo } from './compositions/HeroVideo';
import { DisciplineIntro } from './compositions/DisciplineIntro';

const disciplines = [
  { id: 'Trap', name: 'Trap Shooting', tagline: 'Four fields. One target. Pure focus.' },
  { id: 'SportingClays', name: 'Sporting Clays', tagline: '10 stations through 50 acres of Ontario woodland.' },
  { id: 'Rifle', name: 'Rifle', tagline: '200 yards of precision.' },
  { id: 'Handgun', name: 'Handgun', tagline: 'Controlled. Accurate. Disciplined.' },
  { id: 'Archery', name: 'Archery', tagline: 'Traditional skill. Modern range.' },
  { id: 'Fishing', name: 'Fishing Pond', tagline: 'Cast a line. Enjoy the quiet.' },
];

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroVideo"
        component={HeroVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      {disciplines.map((d) => (
        <Composition
          key={d.id}
          id={`DisciplineIntro-${d.id}`}
          component={DisciplineIntro}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            disciplineName: d.name,
            tagline: d.tagline,
          }}
        />
      ))}
    </>
  );
};
