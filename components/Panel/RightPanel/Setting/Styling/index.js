
import { Button, Divider, Card } from 'antd';
import { useState, useEffect, Children } from 'react';
import { generateCascader } from '@/lib/utils/elementNode';
import Style from './Style';

export default function Styling({
    state,
    menuKeys,
    onSelectSelector,
    onDeleteSelector,
    onResetSelector,
    onUpdateSelector
 }) {





    return state.node ? <>
        <Divider orientation="center" orientationMargin="0">Tag: {state.node.tagName} </Divider>

        <div style={{ maxHeight: '62vh', overflow: 'auto' }}>
            <><Style
                onResetSelector={onResetSelector}
                onDeleteSelector={onDeleteSelector}
                onUpdateSelector={onUpdateSelector}
                menuKeys={menuKeys}
                state={state}
                onSelectSelector={onSelectSelector} /></>
        </div>

    </>
        : <span>Please Select the node</span>
}