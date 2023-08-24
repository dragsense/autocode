import React, { useState, useEffect, useMemo, useRef } from 'react';
import Slide from './Slide';

const Slides = (props) => {
  const {
    children,
    states,
    nodes,
    element,
    node,
    updateStates
  } = props;

  const nodeRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const total = states['total'] ? states['total'].defaultValue : 0;
  const activeIndex = states['currentIndex'] ? states['currentIndex'].defaultValue : -1;
  const numColumns = states['numColumns'] ? states['numColumns'].defaultValue : 1;
  const moveColumns = states['numColumns'] ? states['numColumns'].defaultValue : 1;

  const type = states['type'] ? states['type'].defaultValue : 'slide';

  const autoPlay = states['autoPlay'] ? states['autoPlay'].defaultValue : false;
  const duration = states['duration'] ? states['duration'].defaultValue : 300;
  const loop = states['loop'] ? states['loop'].defaultValue : false;
  const hoverStop = states['hoverStop'] ? states['hoverStop'].defaultValue : 1;

  const interval = states['interval'] ? states['interval'].defaultValue : 3000;

  const flattenedChildren = useMemo(() => {
    const flattenedChildren =
      nodes.length > 0
        ? nodes.map((mapValue, mapIndex) =>
          element({ tagName: 'div', state: node.state }, children, mapValue, mapIndex)
        )
        : React.Children.toArray(children);

    const length = flattenedChildren.length;
    if (length !== total) {
      updateStates('items', length, 'states');
    }

    return flattenedChildren;
  }, [children.length, nodes]);

  useEffect(() => {
    let timer;

    const handleSlideTransition = () => {
      const totalSlides = Math.ceil(flattenedChildren.length / numColumns);
      let newIndex = activeIndex + 1; // Increment the active index by 1

      if (newIndex >= totalSlides * numColumns) {
        newIndex = 0; // Reset to the first slide if reached the end
      }

      updateStates('currentIndex', newIndex);
      updateStates('activeItem', flattenedChildren[newIndex]);
    };

    if (autoPlay && !isHovered) {
      if (!loop && activeIndex === total - 1) {
        clearInterval(timer);
      } else {
        timer = setInterval(() => {
          handleSlideTransition();
        }, interval);
      }
    }

    return () => {
      clearInterval(timer);
    };
  }, [autoPlay, interval, loop, activeIndex, total, isHovered]);

  const setLoopIndex = () => {
    let totalSlides = Math.ceil(flattenedChildren.length / numColumns);
   // totalSlides += 2;
    let newIndex = activeIndex;

    if (newIndex >= totalSlides * numColumns) {
      newIndex = newIndex % (totalSlides * numColumns);
    } else if (newIndex < 0) {
      newIndex = (totalSlides * numColumns) - Math.abs(newIndex % (totalSlides * numColumns));
    }

    updateStates('currentIndex', newIndex);
    updateStates('activeItem', flattenedChildren[newIndex]);
  };

  useEffect(() => {
  
    if(loop)
    setLoopIndex()
    else
      updateStates('activeItem', flattenedChildren[activeIndex]);
    
  }, [activeIndex]);

  const handleMouseEnter = () => {
    setIsHovered(hoverStop);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const renderSlides = useMemo(() => {
    const width = 100 / numColumns + '%';
    const moveOffset = moveColumns;
    let slides = [];


    let sortAsc = false;
    let sortDesc = false;
    const slideChildren = [];

    const totalSlides = Math.ceil(flattenedChildren.length / numColumns);

    for (let i = 0; i < totalSlides; i++) {
      const startIndex = i * numColumns;
      const endIndex = startIndex + numColumns;
      const slideItems = flattenedChildren.slice(startIndex, endIndex);
    
      // sortAsc = activeIndex === total - 1 && i === 0;
      // sortDesc = activeIndex === 0 && i === total - 1;

      slides.push(slideItems.map((item, index) => (
        <div
          key={startIndex + index}
          style={{
            display: 'inline-block',
            color: 'white',
            background: activeIndex === startIndex + index ? '#3c3c3c' : 'none',
            width
          }}
        >
          {startIndex + index + 1}
          {item}
        </div>
      )));
    }

  
    return <Slide
      key={0}
     
      moveOffset={moveOffset}
      index={0}
      activeIndex={activeIndex}
      lastIndex={total - 1}
      duration={duration}
      type={type}
    >{slides}</Slide>


  }, [flattenedChildren, numColumns, activeIndex]);

  const slides = useMemo(
    () =>
      element(
        { ...node, state: undefined, map: undefined },
        <div
          ref={nodeRef}
          style={{ position: 'relative', height: '100%', overflow: 'hidden' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {renderSlides}
        </div>
      ),
    [renderSlides]
  );

  return slides;
};

export default Slides;