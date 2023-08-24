
// import { Button, Divider, Card } from 'antd';
// import { useState, useEffect, Children } from 'react';
// import ElementContent from './ElementContent';
// import { generateCascader } from '@/lib/utils/elementNode';


// export default function Collection({ element, onUpdate }) {

//     const [state, setState] = useState({});


//     const [isChange, setIsChange] = useState(false);


//     useEffect(() => {
//         let cascaderStates = element.states
//             ?
//             generateCascader(element.states, "STATES") : []
//         cascaderStates = element.props ? [...cascaderStates, ...generateCascader(element.props, "PROPS")] : cascaderStates;
//         cascaderStates = element.docStates ? [...cascaderStates, ...generateCascader(element.docStates, "DOCSTATES")] : cascaderStates;

//         cascaderStates = [{ label: 'TOGGLE', value: 'TOGGLE' },
//         ...(element.colStates ?

//             [{
//                 label: 'COLSTATES', type: 'COLSTATES', value: 'COLSTATES', children: [{ label: '_id', value: 'collectionId' },

//                 { label: 'page', value: 'page' },
//                 { label: 'limit', value: 'limit' },
//                 { label: 'total', value: 'maxPage' },
//                ]
//             }]
//             : []),

//         ...([{ label: 'MAPINDEX', value: 'MAPINDEX' }, { label: 'MAPVALUE', value: 'MAPVALUE' }]), ...cascaderStates]

//         setState({ ...element, cascaderStates });

//     }, [element]);

//     const onElementUpdate = async () => {

//         // for (const key in state) {
//         //     element[key] = state[key]
//         // }


//         await onUpdate(state);

//         setIsChange(false);
//     }

//     return element ? <>
//         <Divider orientation="center" orientationMargin="0">Tag: {element.tagName} </Divider>

//         <div style={{ maxHeight: '62vh', overflow: 'auto' }}>
//             <Card><ElementContent setIsChange={setIsChange} state={state} setState={setState} /></Card>
//         </div>
//         <Divider orientation="center" orientationMargin="0"></Divider>

//         <div style={{ textAlign: 'right' }}>
//             <Button disabled={!isChange} onClick={onElementUpdate} type='primary'>Update</Button>
//         </div>
//     </>
//         : <span>Please Select the node</span>
// }



import { Button, Divider, Card, Select } from 'antd';

const { Option } = Select

import { useState, useEffect, Children } from 'react';
import ElementContent from './ElementContent';

import ElementCondition from '../Element/Condition';
import ElementMapping from '../Element/Map';
import ComponentServices from '@/lib/services/components';

export default function Content({ state, onUpdate, cascaderStates }) {

    const [contentState, setContentState] = useState({ attributes: {}, conditions: {} });
    const [optionState, setOptionState] = useState({ conditions: {} });

    const [customPaths, setCustomPaths] = useState([]);

    const [isChange, setIsChange] = useState(false);


    const onChangeImportPath = (value) => {
        setContentState({ ...contentState, customPath: value })
        setIsChange(true);
    }


    useEffect(() => {

        const load = async () => {
            try {
                const compPaths = await ComponentServices.getPaths();
                setCustomPaths(compPaths);
            } catch (e) {
            } finally {
            }
        }

        load();
    }, []);




    useEffect(() => {

        if (!state.node)
            return;


        if (!state.node.attributes)
            state.node.attributes = {};

        setContentState({ ...state.node });


        if (!state.node.childConditions)
            state.node.childConditions = {};

        setOptionState({ conditions: state.node.childConditions })



    }, [state.node]);

    const onElementUpdate = async () => {

        for (const key in contentState) {
            state.node[key] = contentState[key]
        }

        for (const key in optionState) {
            if (key == 'conditions')
                state.node["childConditions"] = optionState[key]
            else
                state.node[key] = optionState[key]
        }

      

        onUpdate();
        setIsChange(false);
    }

    return state.node ? <>
        <Divider orientation="center" orientationMargin="0">Tag: {state.node.tagName} </Divider>

        <div style={{ maxHeight: '62vh', overflow: 'auto' }}>
            <Card>
                <Divider orientation="center" orientationMargin="0">Custom Component: </Divider>

                <Select
                    disabled={state.node.layout !== 'div'}
                    style={{ width: '100%' }}
                    placeholder="Component Path"
                    value={contentState.customPath}
                    onChange={onChangeImportPath}
                    optionFilterProp="label"
                >
                    <Option>None</Option>
                    {Array.isArray(customPaths) && customPaths.map(val => <Option value={val}></Option>)}
                </Select>

                <Divider orientation="center" orientationMargin="0">Custom Content: </Divider>

                <ElementContent setIsChange={setIsChange}
                    cascaderStates={cascaderStates}
                    state={contentState}
                    setState={setContentState} />

                <Divider orientation="center" orientationMargin="0">Mapping: </Divider>
                <ElementMapping
                    setIsChange={setIsChange}
                    cascaderStates={cascaderStates}
                    state={contentState}
                    setState={setContentState} />

                <Divider orientation="center" orientationMargin="0">Conditions: </Divider>
                <ElementCondition
                    setIsChange={setIsChange}
                    cascaderStates={cascaderStates}
                    state={contentState}
                    setState={setContentState} />

                {contentState.tagName === 'select' && <>
                    <Divider orientation="center" orientationMargin="0">Options Conditions: </Divider>
                    <ElementCondition cascaderStates={cascaderStates}
                        setIsChange={setIsChange}
                        state={optionState}
                        setState={setOptionState} /></>}

            </Card>
        </div>
        <Divider orientation="center" orientationMargin="0"></Divider>

        <div style={{ textAlign: 'right' }}>
            <Button disabled={!isChange} onClick={onElementUpdate} type='primary'>Update</Button>
        </div>
    </>
        : <span>Please Select the node</span>
}