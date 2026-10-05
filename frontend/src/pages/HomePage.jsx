import React from 'react';
import { useNavigate } from 'react-router-dom';
import Masthead from '../components/theme/Masthead';
import CardShell from '../components/theme/CardShell';
import SpeedGauge from '../components/theme/SpeedGauge';
import ContextWindow from '../components/theme/ContextWindow';
import ConnectionsMap from '../components/theme/ConnectionsMap';
import TileWall from '../components/theme/TileWall';
import LearnMoreButton from '../components/theme/LearnMoreButton';
import LedDotText from '../components/theme/LedDotText';

export default function HomePage() {
  const navigate = useNavigate();
  const handleStartMigration = () => navigate('/setup');

  return (
    <div className="flex-1 flex flex-col justify-between w-full max-w-[var(--content-max)] mx-auto py-2 sm:py-4">
      <Masthead
        headlineLine1="Built for"
        dotWord="Intelligent"
        headlineLine2="Performance"
        intro="Every capability is engineered for speed, scale and contextual understanding, giving your migration pipeline the intelligence to reason, adapt and perform in production."
      />

      <section className="cards" aria-label="Core Performance Pillars">
        {/* CARD 1: Speed */}
        <CardShell variant="speed">
          <div className="card__title">
            Inference Speed
            <span className="block text-[0.7em] font-normal opacity-85 mt-0.5">AI Response Latency</span>
          </div>
          <SpeedGauge activeValue={118} />
          <div className="card__metric">
            <LedDotText text="118" color="#ffffff" dotRadius={2.2} pitchX={5} pitchY={4} />
            <span className="card__unit">ms</span>
          </div>
          <div className="card__caption">Average global<br />response</div>
          <LearnMoreButton label="Get Started" onClick={handleStartMigration} />
        </CardShell>

        {/* CARD 2: Context */}
        <CardShell variant="context">
          <TileWall />
          <div className="card__title">
            Context Window
            <span className="block text-[0.7em] font-normal opacity-85 mt-0.5">Long-form Understanding</span>
          </div>
          <ContextWindow />
          <div className="card__metric">
            <LedDotText text="2.4" color="#ffffff" dotRadius={2.2} pitchX={5} pitchY={4} />
            <span className="card__unit">M</span>
          </div>
          <div className="card__caption">Tokens processed<br />simultaneously</div>
          <LearnMoreButton label="Review Schema" onClick={handleStartMigration} />
        </CardShell>

        {/* CARD 3: Connections */}
        <CardShell variant="connections">
          <div className="card__title">
            Intelligent Connections
            <span className="block text-[0.7em] font-normal opacity-85 mt-0.5">Cross-Source Context</span>
          </div>
          <ConnectionsMap />
          <div className="card__metric">
            <LedDotText text="16" color="#ffffff" dotRadius={2.2} pitchX={5} pitchY={4} />
            <span className="card__unit">K</span>
          </div>
          <div className="card__caption">Connected data<br />sources</div>
          <LearnMoreButton label="Initialize" onClick={handleStartMigration} />
        </CardShell>
      </section>
    </div>
  );
}
