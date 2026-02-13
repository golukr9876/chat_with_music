import React, { useRef, useEffect, useState } from 'react';

const ScrollingTitle = ({ text }) => {
  const textRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      const isOverflow = el.scrollWidth > el.offsetWidth;
      setIsOverflowing(isOverflow);
    }
  }, [text]);

  return (
    <div className="overflow-hidden relative w-full h-5">
      <div
        ref={textRef}
        className={`whitespace-nowrap text-sm font-semibold text-gray-800 ${
          isOverflowing ? 'animate-marquee' : ''
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default ScrollingTitle;