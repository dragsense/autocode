import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Transition } from 'react-transition-group';

const SIDES = [
    'topRight',
    'topLeft',
    'bottomLeft',
    'bottomRight',
  ];

const Dropdown = ({ 
    children, 
     type,
    duration,
    openSide,
    openDropdown,
    leftOffset,
    topOffset, }) => {
  const nodeRef = useRef(null);

  const dropdownTransition = transitions[type].getTransition(duration);

  return (
    <Transition nodeRef={nodeRef} in={openDropdown} timeout={duration}>
      {state => {
        const baseStyle = {
          position: 'absolute',
          [openSide]: 0,
          visibility:  openDropdown ? 'visible' : 'hidden',
          left: openSide.includes('Left') ? leftOffset : 'auto',
          right: openSide.includes('Right') ? leftOffset : 'auto',
          top: openSide.includes('top') ? topOffset : 'auto',
          bottom: openSide.includes('bottom') ? topOffset : 'auto',
          width: '100%',
    height: '100%',
          ...dropdownTransition.defaultStyles,
        };
        const transitionStyles =  dropdownTransition[state];
        return (
          <div ref={nodeRef} style={{ ...baseStyle, ...transitionStyles }}>
            {children}
          </div>
        );
      }}
    </Transition>
  );
};

const transitions = {

    fade: {
        getTransition: (duration = 300) => {
          const defaultStyles = {
            transition: `opacity ${duration}ms ease-in-out`,
            opacity: 0,
          };
    
          const entering = { opacity: 1 };
          const entered = { opacity: 1 };
          const exiting = { opacity: 0 };
          const exited = { opacity: 0 };
    
          return { defaultStyles, entering, entered, exiting, exited };
        },
  },
};


export default Dropdown;



// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { Transition } from 'react-transition-group';

// const Slide = ({ children, activeIndex, lastIndex, moveOffset, duration, type, index }) => {
//   const nodeRef = useRef(null);

//   const sliderTransition = transitions[type].getTransition(duration, index);
//   const isActive = activeIndex === index;

//   let lastActiveIndex = activeIndex;

//   useEffect(() => {
//     lastActiveIndex = activeIndex;
//   }, [activeIndex]);

//   const slideCount = lastIndex + 1;
//   const prevIndex = (index - 1 + slideCount) % slideCount;
//   const nextIndex = (index + 1) % slideCount;

//   const isPrevSlide = activeIndex === prevIndex;
//   const isNextSlide = activeIndex === nextIndex;

//   const isSingleSlide = slideCount === 1;

//   return (
//     <Transition nodeRef={nodeRef} in={isActive || type === 'slide'} timeout={duration}>
//       {state => {
//         const baseStyle = {
//           position: 'absolute',
//           top: 0,
//           left: type === 'slide'
//             ? isActive || isSingleSlide
//               ? '0%'
//               : isPrevSlide
//                 ? '100%'
//                 : isNextSlide
//                   ? '-100%'
//                   : '0%'
//             : 0,
//           width: '100%',
//           height: '100%',
          
//           ...sliderTransition.defaultStyles,
//         };

//         const transitionStyles = type === 'slide'
//           ? {
//             transform: isActive || isSingleSlide
//               ? 'translateX(0%)'
//               : isPrevSlide
//                 ? 'translateX(100%)'
//                 : isNextSlide
//                   ? 'translateX(-100%)'
//                   : '0%'
//           }
//           : sliderTransition[state];



//         return (
//           <div ref={nodeRef} style={{ ...baseStyle, ...transitionStyles }}>

//             {children}
//           </div>
//         );
//       }}
//     </Transition>
//   );
// };

// const transitions = {
//   slide: {
//     getTransition: (duration = 300, index) => {
//       const defaultStyles = {
//         transition: `transform ${duration}ms ease-in-out`,
//       };

//       const entering = {
//         transform: 'translateX(0%)',
//       };

//       const entered = {
//         transform: 'translateX(0%)',
//       };

//       const exiting = {
//         transform: index === 0 ? 'translateX(100%)' : 'translateX(-100%)',
//       };

//       const exited = {
//         transform: index === 0 ? 'translateX(100%)' : 'translateX(-100%)',
//       };

//       return { defaultStyles, entering, entered, exiting, exited };
//     },
//   },
//   fade: {
//     getTransition: (duration = 300) => {
//       const defaultStyles = {
//         transition: `opacity ${duration}ms ease-in-out`,
//         opacity: 0,
//       };

//       const entering = { opacity: 1 };
//       const entered = { opacity: 1 };
//       const exiting = { opacity: 0 };
//       const exited = { opacity: 0 };

//       return { defaultStyles, entering, entered, exiting, exited };
//     },
//   },
// };


// export default Slide;