
import { debounce } from '@/lib/utils/utils'

import React, { useState, useCallback, useEffect } from "react";
import ElementMapping from './ElementMapping';

import { getData, getAllData } from "@/lib/utils/db";
import { updateStateValue, getStateRef } from '@/lib/utils/elementNode';

const ElementComponent = (props) => {

    const { node, _id, children, setting, _states } = props;

    const [states, setStates] = useState(node.states);
    const [state, setState] = useState(null);


    const setValue = async (elem, value, withValue) => {
        const type = elem.type;
        const key = elem.key;

        switch (type) {
            case 'STATES':
                updateStateValue(key, withValue, states, value);

                setStates({ ...states });
            default:
                return;
        }

    }



    useEffect(() => {

        if (!node)
            return;

        if (node.layout === "searchable") {
            const pages = node.states?.pages;
            if (pages) {
                pages.states = [{ ...setting, global: undefined }]


                const items = 1;
                const values = Array.from({ length: parseInt(items) }, (_, index) => {
                    return `${states['items'].text || "Item"} ${index + 1}`
                });
                node.states.total.defaultValue = items;
                node.states.items.states = values;
                node.states.search.defaultValue = setting.query || '';

            }

        }


        setStates({ ...node.states });
    }, [node.states]);

    useEffect(() => {

        if (!state)
            return;
        const { elem, stateValue, withValue } = state;
        setValue(elem, stateValue, withValue);
    }, [state]);

    const onClick = useCallback(async (id, stateValue, withValue) => {
        const node = await getData(_id, id);
        if (node && node.onClick) {
            const elem = node.onClick;
            setState({ elem, stateValue, withValue })
        }

    }, [states]);

    const updateStates = useCallback(async (key, value, updateKey = 'defaultValue') => {

        const stateRef = states[key];

        if (!stateRef)
            return;

        if (key === 'items') {

            const numColumns = states['numColumns'] ? states['numColumns'].defaultValue : 1;

            const items = Math.ceil(value / numColumns);

            const oldValues = Array.isArray(states['items'].states) ? states['items'].states : []
            const values = Array.from({ length: parseInt(items) }, (_, index) => {
                return oldValues[index] || `${states['items'].text || "Item"} ${index + 1}`
            });
            states['items'] = {
                ...(states['items'] || {}),
                states: values
            };


            states['total'] = { ...(states['total'] || {}), max: value, defaultValue: value };
            if (states['currentIndex']) {
                const loop = states['loop'] ? states['loop'].defaultValue : false;

                states['currentIndex']['max'] = loop ? value + 1 : value;
                states['currentIndex']['min'] = loop ? -1 : 0;
            }

        } else
            stateRef[updateKey] = value;

        setStates({ ...states });
    }, [states]);

    const onChange = useCallback(async (node, value, all = false) => {

        if (node && node.state) {


            if (all && node.map) {

                if (value.includes('all')) {
                    const maKey = node.map.key;
                    const mapType = node.map.type;
                    let map = null;
                    if (mapType == 'STATES')
                        map = getStateRef(maKey, states);
                    else
                        map = getStateRef(maKey, states);

                    if (map) {
                        const states = Object.values(map.states).map((val) => val.split(":")[0]);
                        let options = node.options.split(",");
                        options = Object.values(options).map((val) => val.split(":")[0]);
                        value = [...(new Set([...options, ...states]))].join(',');

                    }
                } else
                    value = ''
            }

            setValue(node.state, value, '');

        }

    }, [states]);



    return <ElementMapping
     {...props} map={node.map} 
    _states={states} 
    updateStates={updateStates}
     onChange={onChange}
        onClick={onClick}  >{React.Children.map(children, (child) => {
            return child && React.cloneElement(child, {
                onChange: onChange,
                onClick: onClick,
                _states: states,
                _props: _states,
                updateStates: updateStates
            })
        })}
    </ElementMapping>




};


export default ElementComponent;