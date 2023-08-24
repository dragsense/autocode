// import { useState, useEffect, useRef } from "react";
// import usePageStates, { useNodeStates, useComponentsStates } from "@/components/Editor/PageProvider";


// import AttributeComponent from "./Attributes";
// import Value from "./Value";
// import ConditionComponent from './Condition';
// import { MapComponent } from "./Map";
// import { EventComponent } from "./Event";
// import { FilterEventComponent } from "./Event/filterEvent";
// import { Collapse, message, Select, Checkbox, Input, Button, Tag } from "antd";
// const { Panel } = Collapse;
// const { Option } = Select;

// import { fetcher } from "@/lib/fetch";


// const generateCascader = (state) => {
//     let children = null;

//     if (state.type === 'OBJECT')
//         children = state.defaultValue.map(value => { return { label: value.key, value: value.key } });
//     else if (state.type === 'ARRAY OBJECT') {
//         const root = state.defaultValue[0];
//         const child = root.defaultValue;
//         children = [{ label: root.key, value: root.key, children: child.map(value => { return { label: value.key, value: value.key } }) }];
//     }
//     else if (state.type === 'ARRAY')
//         children = state.defaultValue.map((value, index) => { return { label: index, value: index } });
//     else
//         children = undefined;


//     return {
//         label: state.key, value: state.key, type: state.type, children
//     }
// }


// export function NodeSetting({ active, states,
//     customPaths }) {



//     const [collections, setColelctions] = useState([]);
//     const [collection, setColelction] = useState(null);

//     const [docStates, setDocStates] = useState([]);
//     const [relStates, setRelStates] = useState([]);
//     const [documents, setDocuments] = useState([]);

//     const [relationships, setRelationships] = useState([]);

//     const { modify } = usePageStates();
//     const { node } = useNodeStates();
//     const { getCurrentComponent } = useComponentsStates();

//     const [custom, setCustom] = useState('');

//     const [name, setName] = useState('unnamed');
//     const [inputVisible, setInputVisible] = useState(false);

//     const [limit, setLimit] = useState('');
//     const [page, setPage] = useState('');
//     const [mode, setMode] = useState('');

//     const [_import, setImport] = useState('');


//     useEffect(() => {

//         if (!node || !getCurrentComponent())
//             return;

//         setCustom(!!node.element.import);
//         setImport(node.element.import);

//         setName(node.element.name);

//         setColelction(node.element.collection);

//         const comp = getCurrentComponent();

//         if (comp && node.element.collection) {
//             if (comp.page)
//                 setPage(comp.page[node.element.collection]);
//             if (comp.limit)
//                 setLimit(comp.limit[node.element.collection]);
//             if (comp.mode)
//                 setMode(comp.mode[node.element.collection]);
//         }



//     }, [node]);

//     useEffect(async () => {

//         const id = localStorage.getItem("project");
//         const response = await fetcher('/api/projects/' + id, {
//             method: 'GET'
//         });

//         const url = `http://${response.project.domain}:${response.project.port}`;
//         const apikey = response.project.apikey;

//         const _collections = await fetcher(`${url}/api/collections`, {
//             method: 'GET',
//             headers: { 'x-api-key': apikey },
//         });

//         setColelctions(_collections);


//     }, []);



//     useEffect(async () => {


//         try {

//             if (collection) {

//                 const coll = collections.find(col => col.name == collection);

//                 if (!coll)
//                     return;



//                 setDocStates(coll.states.map(state => generateCascader(state)));


//                 const id = localStorage.getItem("project");
//                 const response = await fetcher('/api/projects/' + id, {
//                     method: 'GET'
//                 });

//                 const url = `http://${response.project.domain}:${response.project.port}`;
//                 const apikey = response.project.apikey;



//                 if (coll.relationship) {


//                     const relation = await fetcher(`${url}/api/collections/collection/${coll.relationship}`, {
//                         method: 'GET',
//                         headers: { 'x-api-key': apikey },
//                     })

//                     if (relation)
//                         setRelStates(relation.states.map(state => generateCascader(state)));

//                     const rel = await fetcher(`${url}/api/documents/${relation.name}`, {
//                         method: 'GET',
//                         headers: { 'x-api-key': apikey },
//                     });

//                     if (rel.docs)
//                         setRelationships(rel.docs);
//                 }



//                 const result = await fetcher(`${url}/api/documents/${coll.name}`, {
//                     method: 'GET',
//                     headers: { 'x-api-key': apikey },
//                 })


//                 setDocuments(result.docs);
//             }


//         } catch (e) {
//             message.error(e?.message || 'Error!')
//         }

//     }, [collection]);




//     const onChangeLimit = (e) => {
//         const v = e.target.value;
//         setLimit(v);


//         getCurrentComponent().limit = { ...getCurrentComponent().limit, [collection]: v }



//     }

//     const onChangePage = (e) => {
//         const v = e.target.value;
//         setPage(v);


//         getCurrentComponent().page = { ...getCurrentComponent().page, [collection]: v }
//     }


//     const onChangeMode = (state) => {
//         setMode(state);

//         getCurrentComponent().mode = { ...getCurrentComponent().mode, [collection]: state }
//     }




//     const onChangeCustom = (state) => {
//         if (!state) {
//             setImport('');
//             node.element.import = undefined;
//             modify();
//         }

//         setCustom(state);


//     }

//     const onChangeImport = (value) => {
//         node.element.import = value;
//         setImport(value);
//     }


//     const onUpdateImoprt = (e) => {

//         modify();
//     }

//     const onUpdateCollection = (e) => {

//         if (!collection && node.element.collection) {
//             getCurrentComponent().limit = { ...getCurrentComponent().limit, [node.element.collection]: undefined }
//             getCurrentComponent().page = { ...getCurrentComponent().page, [node.element.collection]: undefined }
//             getCurrentComponent().mode = { ...getCurrentComponent().mode, [node.element.collection]: undefined }

//         }

//         console.log(getCurrentComponent(), collection);

//         node.element.collection = collection;
//         getCurrentComponent().refresh = { collection };
//         modify();


//     }



//     const onChangeCollection = (value) => {

//         setColelction(value);

//     }

//     const showInput = () => {
//         setInputVisible(!inputVisible);
//     };

//     const handleInputChange = e => {
//         setName(e.target.value);
//     };

//     const handleInputConfirm = () => {

//         node.element.name = name;

//         setInputVisible(false);



//     };


//     return node ?
//         <div className="wrapper">

//             <h2>{node?.element.tagName}  {inputVisible && <>

//                 <Input

//                     type="text"
//                     size="small"
//                     style={{ width: '100px', marginLeft: 10 }}
//                     className="tag-input"
//                     value={name}

//                     onChange={handleInputChange}
//                     onPressEnter={handleInputConfirm}
//                 />



//             </>
//             }

//                 {!inputVisible && (
//                     <Tag className="site-tag-plus" onClick={showInput}>
//                         {name}
//                     </Tag>
//                 )}

//             </h2>
//             <div className="hr-line"></div>
//             {node?.element.tagName !== 'hr' && <>
//                 <Select onChange={onChangeCollection}
//                     value={collection}
//                     style={{ width: '100%', marginBottom: 5 }} placeholder="Select Collection">
//                     <Option value="">None</Option>
//                     {collections.map(col =>
//                         <Option value={col.name}>
//                             {col.name}
//                         </Option>
//                     )}

//                 </Select>

//                 {collection && <> <br />
//                     <label>Page Limit</label>
//                     <Input placeholder="Limit"
//                         onChange={onChangeLimit}
//                         value={limit}
//                         required />
//                     <label>Page</label>
//                     <Input placeholder="Page"
//                         onChange={onChangePage}
//                         value={page}
//                         required />


//                     <Checkbox checked={mode} onChange={() => {
//                         onChangeMode(!mode);
//                     }} /> <label>Load More</label>

//                 </>
//                 }

//                 <div style={{ textAlign: 'right', marginBottom: 5 }}>
//                     <Button onClick={onUpdateCollection} size="small" type="primary">Update</Button>
//                 </div>

//                 <h5>Custom:  <Checkbox checked={(custom)} onChange={() => onChangeCustom(!custom)}
//                 /></h5>
//                 {custom &&
//                     <>
//                         <Select style={{ width: '100%' }} placeholder="Component Path" value={_import} onChange={onChangeImport}>
//                             {customPaths.map(val => <Option value={val}></Option>)}
//                         </Select>
//                         <div style={{ textAlign: 'right', marginTop: 5 }}>
//                             <Button onClick={onUpdateImoprt} disabled={!_import} size="small" type="primary">Update</Button>
//                         </div>
//                     </>}
//                 <Collapse defaultActiveKey={['1']} accordion ghost>
//                     {!custom && <Panel header="Value" key="1">

//                         <Value currentNode={node}
//                             states={states}
//                             collection={collection}
//                             docStates={docStates}
//                             relStates={relStates}
//                             documents={documents}
//                             relationships={relationships}
//                         />
//                     </Panel>}
//                     <Panel header="Attributes" key="2">
//                         <AttributeComponent
//                             currentNode={node?.element}
//                             states={states}
//                             docStates={docStates}
//                             relStates={relStates}
//                         />
//                     </Panel>
//                     <Panel header="Conditions" key="3">
//                         <ConditionComponent currentNode={node} states={states} />
//                     </Panel>
//                     <Panel header="Mapping" key="4">
//                         <MapComponent currentNode={node?.element} states={states} />
//                     </Panel>
//                     <Panel header="Collection Filter Event" key="5">
//                         <FilterEventComponent currentNode={node}

//                             states={states}
//                             collections={collections}
//                         />
//                     </Panel>
//                     <Panel header="Event" key="6">
//                         <EventComponent collections={collections}
//                             currentNode={node?.element} states={states} />
//                     </Panel>
//                 </Collapse>
//             </>}
//         </div>
//         : <span>Please Select the node</span>
// };

import { Button, Divider, Card } from 'antd';
import { useState, useEffect, Children } from 'react';
import ElementSetting from './Setting';
import { getAllData } from '@/lib/utils/db';
import ElementCondition from './Condition';
import ElementAttribute from './Attributes';
import ElementMapping from './Map';
import ElementEvent from './Event';
import ElementWrapping from './Wrapper';

import { generateCascader, updateStateValue } from '@/lib/utils/elementNode';

export default function Element({ state, onUpdate, cascaderStates }) {

    const [settingState, setSettingState] = useState({ attributes: {} });
    const [settingOptionState, setSettingOptionState] = useState({ attributes: {} });


    const [isChange, setIsChange] = useState(false);

    useEffect(() => {

        if (!state.node)
            return;

        if (!state.node.attributes)
            state.node.attributes = {};

        setSettingState({ ...state.node });

        if (!state.node.childAttributes)
            state.node.childAttributes = {};

        setSettingOptionState({ attributes: state.node.childAttributes })




    }, [state.node]);


    const onElementUpdate = async () => {

        for (const key in settingState) {
            state.node[key] = settingState[key]
        }

        for (const key in settingOptionState) {
            if (key == 'attributes')
                state.node["childAttributes"] = settingOptionState[key]
            else
                state.node[key] = settingOptionState[key]
        }

        onUpdate();
        setIsChange(false);
    }


    return state.node ? <>
        <Divider orientation="center" orientationMargin="0">Tag: {state.node.tagName} </Divider>

        <div style={{ maxHeight: '62vh', overflow: 'auto' }}>

            <Card><ElementSetting
                cascaderStates={cascaderStates}
                setIsChange={setIsChange}
                state={settingState}
                setState={setSettingState} />

                {/* <Divider orientation="left" orientationMargin="0">Component Wrapper: </Divider>
            <ElementWrapping setIsChange={setIsChange} state={state} setState={setState} />
*/}


                <Divider orientation="center" orientationMargin="0">Custom Attributes: </Divider>
                <ElementAttribute cascaderStates={cascaderStates}
                    setIsChange={setIsChange}
                    state={settingState}
                    setState={setSettingState} />


                {settingState.tagName === 'select' && <>
                    <Divider orientation="center" orientationMargin="0">Options Attributes: </Divider>
                    <ElementAttribute cascaderStates={cascaderStates}
                        setIsChange={setIsChange}
                        state={settingOptionState}
                        setState={setSettingOptionState} /></>}


                <Divider orientation="center" orientationMargin="0">Events: </Divider>
                <ElementEvent cascaderStates={cascaderStates}
                    setIsChange={setIsChange}
                    state={settingState}
                    setState={setSettingState} />
            </Card>
        </div>
        <Divider orientation="center" orientationMargin="0"></Divider>

        <div style={{ textAlign: 'right' }}>
            <Button disabled={!isChange} onClick={onElementUpdate} type='primary'>Update</Button>
        </div>
    </>
        : <span>Please Select the node</span>
}