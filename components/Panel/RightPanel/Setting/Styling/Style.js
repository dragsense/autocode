

import { Button, Input, Card, Divider, Alert, message, } from "antd";
import { useState, useCallback, useReducer, useEffect, useMemo } from "react";


import RigthSideBar from "@/components/Dashboard/Styling/Style/Editor/RightSideBar";


import {

    updateStyleData, searchSelector
} from '@/lib/utils/db';




export default function Style({
    menuKeys,
    state,
    onSelectSelector,
    onDeleteSelector,
    onUpdateSelector}) {

        const [isChange, setIsChange] = useState(false);

    useEffect(() => {

        if (!state.node)
            return;


        const fetchSelector = async () => {

            if (state.selector)
                await onUpdateSelector(state.selector);


            const res = await searchSelector([state.media || 'normal', state.node.tagName]);
            const data = res?.selectors ? res.selectors : {};

            let selector = data[state.node.selector];

            if (!selector)
                selector = { selectorText: state.node.selector, properties: {} }
            else
                selector = { ...data[state.node.selector] };


            return selector;
        }

        fetchSelector().then(sel => onSelectSelector(sel, ""));

    }, [state.node, state.media])






    const onDelete = async () => {

        if (!state.selector) {
            message.error('Selector not found!')
            return;
        }

        if (state.selector.selectorText === state.node.selector) {
            message.error("Sorry this selector can't be delete!");
            return;
        }
        await onDeleteSelector(state.selector);
    };

    const onReset = async () => {
        await onUpdateSelector({...state.selector, properties: {}});
    }

    const onSelect = async (newSelector, elementstate = '') => {
        console.log(newSelector,elementstate)
        await onSelectSelector(newSelector, elementstate);
    };


    const onChange = async (name, value, priority, unit) => {

        state.selector.properties[name] = {value, priority, unit}

        setIsChange(true);

    }


    return <>

        {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}

        <RigthSideBar
            selector={state.selector}
            selectorKey={[state.media || 'normal', state.node.tagName]}
            onSelect={onSelect}
            onDelete={onDelete}
            onReset={onReset}
            onChange={onChange}
            width={'100%'}
            mode={"light"}
            menuKeys={menuKeys}
        />

        <Divider orientation="center" orientationMargin="0"></Divider>

        <div style={{ textAlign: 'right' }}>
            <Button disabled={!isChange} onClick={() => onUpdateSelector(state.selector)} type='primary'>Update</Button>
        </div>

    </ >

}

