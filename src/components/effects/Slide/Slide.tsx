import { SlideProps } from '@material-ui/core';
import React, { useRef, useState } from 'react';
// import ReactDOM from 'react-dom';
// import { bool, node } from 'prop-types';
import { useTransition, animated } from 'react-spring';


interface OTPSlideProps extends SlideProps {
isVisible: boolean;
forceSlideIn: boolean;

}



const visibleStyle = { height: 'auto', opacity: 1, overflow: 'visible' };
const hiddenStyle = { opacity: 0, height: 0, overflow: 'hidden' };

function getElementHeight(ref) {
  return ref.current ? ref.current.getBoundingClientRect().height : 0;
}


export default function Slide({ isVisible, children, forceSlideIn }:OTPSlideProps) {
  const isVisibleOnMount = useRef(isVisible && !forceSlideIn);
  const containerRef = useRef(null);
  const innerRef = useRef(null);

  const transitions = useTransition(isVisible, null, {
    enter: () => async (next, cancel) => {
      const height = getElementHeight(innerRef);

      cancel();

      await next({ height, opacity: 1, overflow: 'hidden' });
      await next(visibleStyle);
    },
    leave: () => async (next, cancel) => {
      const height = getElementHeight(containerRef);

      cancel();

      await next({ height, overflow: 'hidden' });
      await next(hiddenStyle);

      isVisibleOnMount.current = false;
    },
    from: isVisibleOnMount.current ? visibleStyle : hiddenStyle,
    unique: true,
  });

  return transitions.map(({ item: show, props: springProps, key }) => {
    if (show) {
      return (
        <animated.div ref={containerRef} key={key} style={springProps}>
          <div ref={innerRef}>{children}</div>
        </animated.div>
      );
    }

    return null;
  });
}
