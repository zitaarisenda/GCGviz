import React from 'react';

export const useContainerWidth = (ref: React.RefObject<HTMLElement>) => {
  const [width, setWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const getWidth = () => ref.current?.offsetWidth || 0;

    const handleResize = () => {
      setWidth(getWidth());
    };

    if (ref.current) {
      setWidth(getWidth());
    }

    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        setWidth(entries[0].contentRect.width);
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return width;
};