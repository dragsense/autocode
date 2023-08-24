import React, { useState, useEffect, useMemo } from 'react';

import { getStateValue } from '@/lib/utils/elementNode';

import Tab from './Tab';

const TabsContent = (props) => {
    const { children,
        states,
        nodes,
        element,
        node,
    } = props;

    const activeIndex = states['currentIndex'] ? states['currentIndex'].defaultValue : -1;
    const duration = states['duration'] ? states['duration'].defaultValue : 300;


    const flattenedChildren = useMemo(() => {
        const flattenedChildren = nodes.length > 0 ? nodes.map((mapValue, mapIndex) => element(
            { tagName: 'div', state: node.state },
            children[0],
            mapValue,
            mapIndex,
        ))
            :
            React.Children.toArray(children);


        return flattenedChildren;

    }, [children.length, nodes]);



    const renderTabsContent = useMemo(() => {
        const tabsContent = [];
        const totalSlides = flattenedChildren.length;
        for (let i = 0; i < totalSlides; i++) {
            const isActive = activeIndex === i;

            tabsContent.push(<Tab isActive={isActive} zIndex={totalSlides - i} duration={duration}><div style={{
                background: (isActive) ? `#000` : 'none'
            }}>{flattenedChildren[i]}</div></Tab>)

        }

        return tabsContent;
    }, [flattenedChildren])

    const tabsContent = useMemo(
        () =>
            element(
                { ...node, state: undefined, map: undefined },
                <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
                    {renderTabsContent}
                </div>

            ),
        [renderTabsContent]
    );

    return tabsContent;


};

export default TabsContent;

