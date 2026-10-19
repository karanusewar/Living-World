import React from 'react';

export const MyWorldScene: React.FC = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#070b14] select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* High-Resolution Responsive Single View Diorama */}
      <img
        src="/images/my_world.jpg"
        alt="A Day in Our Living World - Miniature Diorama"
        className="w-full h-full object-cover object-center pointer-events-none select-none will-change-transform"
        style={{
          imageRendering: 'auto',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
        fetchPriority="high"
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};
