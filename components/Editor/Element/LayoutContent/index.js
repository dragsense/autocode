import React, { useState } from 'react';
import Menu from './Menu';
import ImageElement from './Image';
import Component from './Component';
import RichTextEditor from "../Content";

function LayoutContent({ children, state, onUpdate }) {

  const layout = state.node.layout;
  const name = state.node.name;
  const type = state.node.type;

  return layout === 'menu' ? (
    <Menu onSave={(menus) => onUpdate("menu", menus)} node={state.node} pages={[]}>{children}</Menu>
  ) :
    layout === 'img' ? (
      <ImageElement onSave={() => onUpdate("element", null)} node={state.node} pages={[]}>{children}</ImageElement>
    ) :
      layout === 'icon' ? (
        <></>
      ) :
        layout === 'component' || type === 'component' ? (
          <Component
            onSave={() => onUpdate("element", null)}
            node={state.node}
            name={name}
            skippedProperties={['currentIndex', 'total', 'items', 'activeItem', 'openModal', 'openSider', 'openDropdown']}
          >
            {children}</Component>
        ) : (
          <><RichTextEditor node={state.node} onSave={(innerHTML) => onUpdate('element', innerHTML)} /></>
        );

}

export default LayoutContent;