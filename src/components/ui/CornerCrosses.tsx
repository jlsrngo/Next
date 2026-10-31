import React from 'react';

export function CornerCrosses() {
  return (
    <>
      <span className="absolute -top-1.5 -left-1.5 font-mono text-[10px] font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
      <span className="absolute -top-1.5 -right-1.5 font-mono text-[10px] font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
      <span className="absolute -bottom-1.5 -left-1.5 font-mono text-[10px] font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
      <span className="absolute -bottom-1.5 -right-1.5 font-mono text-[10px] font-bold leading-none text-black dark:text-white select-none pointer-events-none">+</span>
    </>
  );
}

export default CornerCrosses;
