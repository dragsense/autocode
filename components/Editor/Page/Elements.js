
// import React, { useEffect, useState, useRef } from "react";
// import { getData } from "@/lib/utils/db";
// import Element from "./Element";
// import Form from "./Form";
// import Component from "./Component";
// import { usePageStates } from '../PageProvider';
// import { useDrop } from 'react-dnd';
// import { message, theme } from "antd";
// import Collection from "./Collection";

// export default function ELements({
//     page,
//     _uid = '0',
//     props,
//     setProps,
//     states,
//     formStates,
//     setFormStates,
//     docStates,
//     docRelations,
//     setStates,
//     colStates,
//     setColStates,
//     children,
//     index = -1,
//     parent = "",

//     mapValue, mapIndex }) {

//     const {
//         token: { colorPrimaryBg },
//     } = theme.useToken();



//     const [element, setElement] = useState(null);
//     const [hoverPosition, setHoverPosition] = useState('end');

//     const elementRef = useRef();

//     const { state, onMove, onSelect, onAdd, onAddTemplate } = usePageStates();





//     useEffect(() => {


//         if (!page && _uid == '0')
//             return;

//         getData(_uid)
//             .then(data => {
//                 if (data) setElement(data);
//             })
//             .catch(err => console.log(err));

//         return () => {
//             //setElement(null);
//         }



//     }, [page, _uid]);



//     useEffect(() => {
//         if (!element)
//             return;

//         if (state.modifyUid == element._uid || state.refreshUid == element._uid) {


//             getData(_uid)
//                 .then(data => { setElement(data); })
//                 .catch(err => console.log(err))
//                 .finally(() => {
//                     if (state.modifyUid == element._uid)
//                         state.modifyUid = undefined;
//                     else
//                         if (state.refreshUid == element._uid)
//                             state.refreshUid = undefined;
//                 })
//         }
//         return () => {
//            // setElement(null);
//         }

//     }, [state.refresh]);




//     const [{ hovering, shallowHovering }, drop] = useDrop({
//         accept: ['moveItem', 'newItem', 'formItem', 'template'],

//         hover: (item, monitor) => {



//             const hoverBoundingRect = elementRef.current?.getBoundingClientRect();

//             const hoverMiddleY = 20;

//             const clientOffset = monitor.getClientOffset();

//             const hoverClientY = clientOffset.y - hoverBoundingRect.top;


//             if (hoverClientY < hoverMiddleY) {
//                 setHoverPosition('above');

//             } else
//                 setHoverPosition('end');


//         },
//         drop: async (item, monitor) => {

//             if (monitor.isOver({ shallow: true })) {
//                 const itemType = monitor.getItemType();

//                 if (itemType === 'formItem') {

//                     if (!element.form) {
//                         message.error("This tag is not allowed within this element.")
//                         return;
//                     }


//                     const { state } = item;



//                     const attributes = [];

//                     if (state.placeholder)
//                         attributes.push({ key: "placeholder", value: state.placeholder })

//                     if (state.required)
//                         attributes.push({ key: "required", value: state.required })

//                     if (state.multiple)
//                         attributes.push({ key: "multiple", value: state.multiple })



//                     let tag = { tag: 'input', type: 'input', layout: 'input', attributes }
//                     if (state.type == 'select') {
//                         tag.tag = 'select',
//                             tag.state = { key: [state.key], type: 'FORMSTATES' }
//                     } else {
//                         attributes.push({ key: "type", value: state.type })
//                         tag.state = { key: [state.key], type: 'FORMSTATES' }
//                     }

//                     let targetIndex = undefined;

//                     if (hoverPosition == 'above') {
//                         targetIndex = index;
//                     }

//                     await onAdd(tag, targetIndex, { parent: parent._uid, index, ...element });
//                 }

//                 if (itemType === 'newItem') {
//                     const { tag } = item;



//                     let targetIndex = undefined;

//                     if (hoverPosition == 'above') {
//                         targetIndex = 0;
//                     }

//                     await onAdd(tag, targetIndex, { parent: parent._uid, index, ...element });
//                 } if (itemType === 'template') {
//                     const { template } = item;



//                     let targetIndex = undefined;

//                     if (hoverPosition == 'above') {
//                         targetIndex = 0;
//                     }

//                     await onAddTemplate(template, targetIndex, { parent: parent._uid, index, ...element });
//                 } else
//                     if (itemType === 'moveItem') {



//                         let targetIndex = -1;
//                         let targetUid = _uid;

//                         if (hoverPosition == 'above') {
//                             targetIndex = index;
//                             targetUid = parent._uid;
//                         }


//                         await onMove(targetUid, targetIndex);

//                     }
//             }

//         },
//         collect: monitor => ({
//             hovering: !!monitor.isOver({ shallow: true }),
//         }),
//     });


//     drop(elementRef);


//     useEffect(() => {

//         if (!element || !state.node)
//             return;


//         if (state.node._uid == element._uid) {

//             onSelect(element,
//                 parent,
//                 index,
//                 states,
//                 props,
//                 docStates,
//                 colStates,
//                 setStates,
//                 formStates,
//                 setFormStates,
//                 !!docRelations)
//         }

//     }, [state.node]);


//     return <>{element && (element.component ?

//         <Component ref={elementRef}
//             index={index}
//             node={state.node}
//             hovering={hovering}
//             hoverPosition={hoverPosition}
//             parent={parent}
//             props={states}
//             docStates={docStates}
//             docRelations={docRelations}
//             formStates={formStates}
//             setFormStates={setFormStates}
//             setProps={setStates}
//             element={element}
//             colStates={colStates}
//             setColStates={setColStates}
//             mapValue={mapValue}
//             mapIndex={mapIndex}
//             onSelect={onSelect}
//         >

//             {hovering && <span

//                 style={{
//                     display: 'inherit',

//                     padding: '10px',
//                     borderRadius: 5,
//                     fontSize: 30,
//                     textAlign: 'center',
//                     margin: '10px',
//                     outline: `2px dashed ${colorPrimaryBg}`,
//                 }}
//             > + </span>}</Component>

//         : element.collection ?

//             <Collection ref={elementRef}
//                 index={index}
//                 node={state.node}
//                 hovering={hovering}
//                 hoverPosition={hoverPosition}
//                 parent={parent}
//                 states={states}
//                 props={props}
//                 setProps={setProps}
//                 docStates={docStates}
//                 docRelations={docRelations}
//                 formStates={formStates}
//                 setFormStates={setFormStates}
//                 setStates={setStates}
//                 element={element}

//                 mapValue={mapValue}
//                 mapIndex={mapIndex}
//                 onSelect={onSelect}
//             >

//                 {hovering && <span

//                     style={{
//                         display: 'inherit',

//                         padding: '10px  0',
//                         margin: '0 10x',
//                         fontSize: 30,
//                         textAlign: 'center',
//                         outline: `2px dashed ${colorPrimaryBg}`,
//                     }}
//                 > + </span>}</Collection>
//             : element.form ?

//                 <Form ref={elementRef}
//                     index={index}
//                     node={state.node}
//                     hovering={hovering}
//                     hoverPosition={hoverPosition}
//                     parent={parent}
//                     states={states}
//                     props={props}
//                     setProps={setProps}
//                     docStates={docStates}
//                     docRelations={docRelations}
//                     colStates={colStates}
//                     setColStates={setColStates}
//                     setStates={setStates}
//                     element={element}

//                     mapValue={mapValue}
//                     mapIndex={mapIndex}
//                     onSelect={onSelect}
//                 >

//                     {hovering && <span

//                         style={{
//                             display: 'inherit',

//                             padding: '10px',
//                             borderRadius: 5,
//                             fontSize: 30,
//                             textAlign: 'center',
//                             margin: '10px',
//                             outline: `2px dashed ${colorPrimaryBg}`,
//                         }}
//                     > + </span>}</Form>
//                 :

//                 <>    <Element ref={elementRef}
//                     index={index}
//                     node={state.node}
//                     hovering={hovering}
//                     hoverPosition={hoverPosition}
//                     parent={parent}
//                     states={states}
//                     props={props}
//                     setProps={setProps}
//                     docStates={docStates}
//                     docRelations={docRelations}
//                     setStates={setStates}
//                     colStates={colStates}
//                     setColStates={setColStates}
//                     formStates={formStates}
//                     setFormStates={setFormStates}
//                     element={element}

//                     mapValue={mapValue}
//                     mapIndex={mapIndex}
//                     onSelect={onSelect}
//                 >

//                     {hovering && <span

//                         style={{
//                             display: 'inherit',

//                             padding: '10px',
//                             borderRadius: 5,
//                             fontSize: 30,
//                             textAlign: 'center',
//                             margin: '10px',
//                             outline: `2px dashed ${colorPrimaryBg}`,
//                         }}
//                     > + </span>}</Element>
//                 </>
//     )}

//     </>



// };

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { getAllData, getData } from '@/lib/utils/db';
import ElementWrapper from './ElementWrapper';

import SettingServices from '@/lib/services/setting';

export function InlineSkeleton() {
  return (
    <div
      style={{
        height: '1em',
        margin: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: '0.25em',
        animation: ' ac-001-pulse 1s infinite ease-in-out',
      }}
    />
  );
}

function TreeNode(props) {


  let { _uid, pos, _id, pageUpdated, _states, _props, colStates } = props;



  const [children, setChildren] = useState([]);
  const [node, setNode] = useState({});

  const fetchNode = async () => {

    if (!_id || !_uid)
      return;

    const newNode = await getData(_id, _uid);
    if (newNode) {

      setNode(newNode);

      const unloadedNodes = newNode.childNodes.filter((key, i) => {
        return !children.some((child) => {
          const index = children.indexOf(child);
          return child.props._uid === key && index == i;
        });
      });

      const deletedNodes = children.filter((child) => {
        return !newNode.childNodes.includes(child.props._uid);
      });

      setChildren((prevChildren) => {
        const updatedChildren = prevChildren.filter((child) => !deletedNodes.includes(child));

        unloadedNodes.forEach((key, i) => {
          const index = newNode.childNodes.indexOf(key);
          const childNode = (
            <MemoizedTreeNode
              {...props}
              _uid={key}
              _id={_id}
              key={key}
            />
          );

          updatedChildren[index] = childNode;
        });

        return updatedChildren;
      });


    }




  }

  useEffect(() => {
    fetchNode();
  }, []);

  useEffect(() => {

    if (pageUpdated.parentId !== _uid && pageUpdated?.currentId !== _uid) return;
    fetchNode();

  }, [pageUpdated]);



  return (<ElementWrapper key={_uid}
    {...props}
    component={node.component}
    customPath={node.customPath}
    form={node.form}
    pos={pos}
    _id={_id}
    colStates={colStates}
    _states={_states}
    _props={_props}
    node={node}>
    {children.map((child, i) => React.cloneElement(child, {
      pos: pos + i,
      _states,
      _props,
      colStates,
      pageUpdated
    }))}
  </ElementWrapper>);
}
const MemoizedTreeNode = React.memo(TreeNode, (prevProps, nextProps) => {
  const pattern = new RegExp(prevProps.pos);
  const matched1 = pattern.test(nextProps.pageUpdated?.pos);
  const matched2 = pattern.test(nextProps.pageUpdated?.dragPos);
  const states = prevProps._states === nextProps._states &&
    prevProps._props === nextProps._props &&
    prevProps.colStates === nextProps.colStates

  return !matched1 && !matched2 && states;
});

export default function Elements({ pageUpdated, _id }) {

  const [setting, setSetting] = useState(null);
  const [states, setStates] = useState(null);

  useEffect(() => {

    const fetchNode = async () => {

      if (!_id)
        return;

      const page = await getAllData(_id);
      if (page) {
        setStates(page.states);
        const res = await SettingServices.get();
        const data = { name: page.name, creator: page.creator, ...(page.setting || {}), global: { ...res.setting } };
        setSetting(data)
      }

    }

    fetchNode();
  }, [_id]);

  return setting && <MemoizedTreeNode
    pageUpdated={pageUpdated}
    pos={""}
    _states={states}
    setting={setting}
    _id={_id}
    _uid={"0"} />
}