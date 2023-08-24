import React, { useState, useEffect, useMemo } from 'react';

import {
    Slides, Tabs, TabsButton, TabsContent, Accordion, AccordionItems, Modal, Gallery,
    Sider,
    Dropdown, Gototop, Menu, Observable, Searchable
} from './components';

import ElementMapping from './ElementMapping';
import { getStateStates } from '@/lib/utils/elementNode';
import ElementSetting from './ElementSetting';

const ElementLayout = (props) => {

    const {
        _states,
        updateStates,
        nodes,
        layout,
        pos,
        mapNodes,
        options,
        mapIndex,
        mapValue,
        isActive,
        node,
        children } = props;

    const mapVal = { label: 'Element', value: 0 }
    const mapIdx = pos.slice(-1)



    const element = (node, children,
        mapValue,
        mapIndex) => {

        return <ElementSetting
            {...props}
            node={node}
            _states={_states}
            mapNodes={mapNodes}
            attributes={node.attributes}
            conditions={node.conditions}
            classes={node.classes}
            mapValue={mapValue}
            {...(mapValue?.type === 'pages' ? { setting: { ...props.setting, ...mapValue } } : {})}
            {...(mapValue?.type === 'docs' ? { colStates: { ...props.colStates, ...mapValue } } : {})}
            mapIndex={mapIndex}
            options={options}
        >{React.Children.map(children, (child) => {


            return React.cloneElement(child, {
                ...(mapValue ? { mapValue } : {}),
                ...(mapIndex ? { mapIndex } : {}),
                ...(mapValue?.type === 'docs' ? { colStates: { ...props.colStates, ...mapValue } } : {}),
                ...(mapValue?.type === 'pages' ? { setting: { ...props.setting, ...mapValue } } : {})

            })
        })
            }
        </ElementSetting>
    }



    const elements = useMemo(() => {


        return nodes.length > 0 ?
            nodes.map((mapValue, mapIndex) => element(node, children, mapValue, mapIndex)) :
            element(node, children, mapValue || mapVal, mapIndex || mapIdx);

    }, [nodes])

    switch (layout) {
        case 'slides':
            return <Slides
                states={_states}
                node={node}
                nodes={nodes}
                element={element}
                updateStates={updateStates}>{children}</Slides>

        case 'tabs':
            return <Tabs
                node={node}
                nodes={nodes}
                element={element}
            >{children}</Tabs>
            break;
        case 'tabs-btn':
            return <TabsButton
                states={_states}
                node={node}
                nodes={mapNodes}
                element={element}
                updateStates={updateStates}
            >{children}</TabsButton>
            break;
        case 'tabs-content':
            return <TabsContent
                states={_states}
                node={node}
                nodes={nodes}
                element={element}
                updateStates={updateStates}
            >{children}</TabsContent>
            break;
        case 'accordions':

            return <AccordionItems
                states={_states}
                node={node}
                nodes={nodes}
                element={element}
                updateStates={updateStates}>{children}</AccordionItems>
            break;
        case 'accordion':
            const duration = _states['duration'] ? _states['duration'].defaultValue : 300;

            return element(node, <Accordion
                isActive={isActive}
                duration={duration}
            >{children}</Accordion>)
            break;
        case 'modal':
            return <Modal
                states={_states}
                node={node}
                nodes={nodes}
                element={element}
                updateStates={updateStates}>{children}</Modal>
            break;
        case 'gallery':
            return <Gallery
                states={_states}
                node={node}
                nodes={nodes}
                element={element}
                updateStates={updateStates}>{children}</Gallery>
        case 'sider':
            return <Sider
                states={_states}
                node={node}
                nodes={nodes}
                element={element}
                updateStates={updateStates}>{children}</Sider>
            break;
        case 'dropdown':
            return <Dropdown
                states={_states}
                node={node}
                element={element}
                updateStates={updateStates}>{children}</Dropdown>;
            break;
        case 'gototop':
            return <Gototop
                states={_states}
                node={node}
                element={element}
                updateStates={updateStates}>{children}</Gototop>;
        case 'observable':
            return <Observable
                states={_states}
                node={node}
                element={element}
                updateStates={updateStates}>{children}
            </Observable>;
        case 'searchable':
            return <Searchable
                states={_states}
                node={node}
                element={element}
                updateStates={updateStates}>{children}
            </Searchable>;
        case 'menu':
            return <Menu states={_states}
                node={node}
                nodes={nodes}
                element={element}
                updateStates={updateStates}>{children}</Menu>;
            break;
        case 'select':
            return element(node, nodes.length > 0 ?
                nodes.map((mapValue, mapIndex) =>
                    <ElementSetting
                        key={mapIndex}
                        _states={_states}
                        node={{ _uid: mapIndex + 1, tagName: 'option' }}
                        attributes={node.childAttributes}
                        classes={{}}
                        conditions={node.childConditions}
                        mapValue={mapValue}
                        mapIndex={mapIndex}
                    />) :
                [])



            break;
        default:
            return elements;
    }

};

export default ElementLayout;