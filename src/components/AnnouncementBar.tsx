import React from 'react';

const AnnouncementBar = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 overflow-hidden relative fixed top-0 w-full z-40">
      <div className="flex">
        {/* Desktop version - centered */}
        <div className="hidden md:flex w-full justify-center items-center">
          <a
            href="https://hed8.pgtglobalnetwork.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline inline-flex items-center gap-1.5"
          >
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-bold">LIVE</span>
            🎉 HED 8.0 is Launched & Live — Reimagine Hackathon is Live! Click here to explore →
          </a>
        </div>
        
        {/* Mobile version - marquee scrolling */}
        <div className="md:hidden flex">
          <div className="animate-marquee whitespace-nowrap hover:pause-marquee">
            <a
              href="https://hed8.pgtglobalnetwork.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium mx-4 hover:underline"
            >
              🎉 HED 8.0 is Launched & Live — Reimagine Hackathon is Live! Click here →
            </a>
            <span className="text-sm font-medium mx-4">
              🌍 Operating in 50+ countries worldwide.
            </span>
            <span className="text-sm font-medium mx-4">
              📚 5 transformative programs available.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;