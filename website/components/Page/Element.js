
// import React, { useEffect, forwardRef, useState, useRef, useMemo, Children } from "react";
// import { theme } from "antd";

// import parse from 'html-react-parser';
// import dynamic from "next/dynamic";

// import NestedElements from './NestedElements';
// import { getStateValue, getStateRef, getCondtion, updateStateValue } from "../../../lib/utils/elementNode";

// const e = React.createElement;
// import ELements from "./Elements";


// const Element = forwardRef(({
//     parent,
//     node,
//     index,
//     element,
//     states,
//     docStates,
//     docRelations,
//     setStates,
//     formStates,
//     setFormStates,
//     props,
//     setProps,
//     colStates,
//     setColStates,
//     children,
//     hoverPosition,
//     mapValue,
//     mapIndex,
//     hovering,
//     onSelect
// }, ref) => {


//     const [child, setChild] = useState(true);


//     const {
//         token: { colorPrimary, colorPrimaryBg },
//     } = theme.useToken();


//     const onChange = (e) => {
//         e.preventDefault();

//         if (!states || states.length <= 0 || !setStates)
//             return;



//         if (element.onChange) {
//             const value = e.target.value;
//             const key = element.onChange.key;
//             let state = getStateRef(key, states);
//             if (state) {
//                 if (key[1] != undefined)
//                     state.defaultValue[key[1]] = value;
//                 else
//                     state.defaultValue = value;
//                 setStates([...states]);
//             }
//         }



//     };

//     const onClick = (e) => {
//         e.preventDefault();



//         if (element.onClick) {

//             const onClick = element.onClick;

//             if (onClick.key[0] == '__pagination__') {

//                 if (!setColStates)
//                     return;

//                 setColStates(prevState => {
//                     const page = prevState.page;
//                     const limit = prevState.limit;
//                     const maxPage = prevState.maxPage;
//                     const loadMore = prevState.loadMore;
//                     const minPage = 0;

//                     const key = onClick.key[1];

//                     let addition = key;
//                     if (key == '-1' && !loadMore)
//                         addition = '-1';

//                     let val = `${eval(`${page} ${addition}`)}`

//                     if (val >= maxPage || val >= (maxPage / limit) + 1)
//                         val = parseInt(maxPage / limit) + 1;
//                     else
//                         if (val <= minPage)
//                             val = minPage;


//                     return { ...prevState, page: val }

//                 })
//             }
//             else {


//                 if (!states || states.length <= 0 || !setStates)
//                     return;

//                 updateStateValue(
//                     element.onClick.key,
//                     element.onClick.withKey,
//                     states, element.onClick.value)
//                 setStates([...states]);
//             }
//         }



//     };

//     useEffect(() => {


//         if (element.wrapper) {
//             const length = Array.isArray(element.childNodes) ? element.childNodes.length : 0;
//             const slides = element.childNodes;//Array.from({ length }, (_, index) => index);

//             updateStateValue(["slideIndex"], '', states, length, 'max');
//             updateStateValue(["slides"], '', states, slides);

//             setStates([...states]);
//         }

//     }, [element.childNodes]);

//     const componentType = useMemo(() => {

//         let type = 'none';
//         if (element.wrapper || parent.wrapper)
//             type = getStateValue(['componentType'], states);



//         if (type == 'accordion' && parent.wrapper)
//             return type;
//         else
//             if (type !== 'accordion' && element.wrapper)
//                 return type;
//             else
//                 return 'none';



//     }, [element.wrapper, parent.wrapper]);


//     // useEffect(() => {

//     //     if (!ref)
//     //         return;


//     //     const observer = new IntersectionObserver((entries) => {
//     //         entries.forEach((entry) => {
//     //             if (entry.isIntersecting) {
//     //                 setChild(true)
//     //                 observer.unobserve(ref.current);
//     //             }
//     //         }),
//     //             { threshold: 1 }
//     //     });

//     //     if (ref.current) {
//     //         observer.observe(ref.current);
//     //     }

//     //     return () => {
//     //         if (ref.current) {
//     //             observer.unobserve(ref.current);
//     //         }
//     //     };
//     // }, [ref]);

//     const getValue = (type, key, value, mapValue, mapIndex, docStates) => {

//         switch (type) {
//             case 'STATES':
//                 return getStateValue(key, states);
//             case 'PROPS':
//                 return getStateValue(key, props);
//             case 'FORMSTATES':
//                 return getStateRef(key, formStates);
//             case 'DOCSTATES':
//                 return getStateValue(key, docStates);
//             case 'DOCRELATIONS':
//                 return Array.isArray(docRelations) ? docRelations : [];
//             case 'COLSTATES':
//                 return colStates ? colStates[key[0]] : value;
//             case 'MAPVALUE':
//                 return mapValue;
//             case 'MAPINDEX':
//                 return mapIndex;
//             case 'TOGGLE':
//                 return 1;
//             default:
//                 return value;
//         }
//     }


//     const computeStateValue = (type, key, value, mapValue, mapIndex, docStates) => {
//         // const val = useMemo(() => {
//         //   return getValue(type, key, value, mapValue, mapIndex);
//         // }, [key, type]);



//         const computedValue = getValue(type, key, value, mapValue, mapIndex, docStates);
//         return computedValue ? computedValue.toString() : '';
//     }

//     const stateValue = useMemo(() => {

//         let value = computeStateValue(
//             element.state?.type,
//             element.state?.key,
//             element.nodeValue,
//             mapValue,
//             mapIndex,
//             docStates,
//         );
//         return value;

//     }, [element.state, element.nodeValue, states, props, docStates, formStates]);

//     const mapValues = useMemo(() => {

//         if (!element.map)
//             return [];

//         let value = getValue(element.map.type, element.map.key, []);


//         if (value instanceof Array)
//             return value;



//         return [value];

//     }, [element.map, colStates, states, props]);

//     const conditions = useMemo(() => {

//         if (!element.conditions || !Array.isArray(element.conditions))
//             return true;

//         return element.conditions?.reduce((prev, condition) => {

//             let val = computeStateValue(condition.type, condition.key, true, mapValue, mapIndex);
//             let compareValue = computeStateValue(condition.valueState?.type, condition.valueState?.key, condition.value, mapValue, mapIndex);


//             return prev && getCondtion(condition.match, compareValue, val)
//         },
//             true);

//     }, [element.conditions, states, mapIndex, mapValue]);


//     let attributes = useMemo(() => {


//         if (!element.attributes || !Array.isArray(element.attributes))
//             return [];

//         return element.attributes.reduce((a, attribute) => {

//             let cond = false;

//             if (attribute.condition) {

//                 const condition = attribute.condition;

//                 let val = computeStateValue(condition.type, condition.key, true, mapValue, mapIndex);
//                 let compareValue = computeStateValue(condition.valueState?.type, condition.valueState?.key, condition.value, mapValue, mapIndex);


//                 cond = getCondtion(condition.match, compareValue, val);

//             }

//             const value = cond ? cond : computeStateValue(
//                 attribute.type,
//                 attribute.value,
//                 attribute.value,
//                 mapValue,
//                 mapIndex,
//                 docStates);

//             return { ...a, [attribute.key]: value }

//         }, {});

//     }, [element.attributes]);


//     const classes = useMemo(() => {

//         if (!Array.isArray(element.classes))
//             return '';

//         return element.classes.reduce((a, v) => {

//             let cond = true;

//             if (Array.isArray(v.conditions))
//                 cond = v.conditions.reduce((prev, condition) => {

//                     let val = computeStateValue(condition.type, condition.key, true, mapValue, mapIndex);
//                     let compareValue = computeStateValue(condition.valueState?.type, condition.valueState?.key, condition.value, mapValue, mapIndex);


//                     return prev && getCondtion(condition.match, compareValue, val)
//                 },
//                     true);


//             return a + " " + (cond && v.name)

//         }, '');

//     }, [element.classes])


//     const closeTag = element.tagName === 'img' || element.tagName === 'hr';

//     const elementInfoAttributes = {
//         "data-id": element._uid,
//         "data-index": index,
//     }



//     if (closeTag)
//         if (element.tagName === 'img') {
//             attributes = { src: stateValue || element.src?.src || '/images/default/default-img.png', alt: element.src?.alt, ...attributes }
//         }


//     const ClosedElement = <span style={{
//         display: element.tagName === 'hr' ? 'block' : 'inline-block',
//     }}>{hoverPosition == 'above' && children}
//         <span  {...elementInfoAttributes} style={{

//             padding: '10px',
//             borderRadius: 5,
//             margin: '10px',
//             display: element.tagName === 'hr' ? 'block' : 'inline-block',
//             outline: '1px dashed #bdbdbd',
//             ...(node?._uid == element._uid || hovering ?
//                 { outline: `2px dashed ${colorPrimary}` } : {}),

//         }}>
//             {
//                 e(element.tagName,
//                     { ...attributes, ...(element.onChange ? { onChange } : {}), ...(element.onClick ? { onClick } : {}) },
//                     null)}
//         </span>{hoverPosition == 'end' && children}</span>


//     const selectTag = element.tagName === 'select';
//     const mediaTag = element.tagName === 'video' || element.tagName === 'audio';
//     const inputTag = element.tagName == 'input' || element.tagName === 'textarea';

//     const getOptions = () => {


//         if (element.state) {
//             let obj = getStateRef(element.state.key, formStates);

//             if (obj && Array.isArray(obj.options)) {
//                 return obj.options;
//             }
//         }

//         return Array.isArray(element.options) ? element.options : [];
//     }


//     const SelectElement = <span style={{ display: 'inline-block' }}>{hoverPosition == 'above' && children}
//         <span  {...elementInfoAttributes} style={{

//             padding: '10px',
//             borderRadius: 5,
//             margin: '10px',
//             display: 'inline-block',
//             outline: '1px dashed #bdbdbd',
//             ...(node?._uid == element._uid || hovering ?
//                 { outline: `2px dashed ${colorPrimary}` } : {}),

//         }}>
//             {
//                 e(element.tagName,
//                     { ...attributes, className: classes + " " + element.className, ...(element.onChange ? { onChange } : {}), ...(element.onClick ? { onClick } : {}) },


//                     (Array.isArray(mapValues) && element.map) ? mapValues.map((mapValue, index) => {

//                         let value = "";
//                         let label = "";
//                         if (element.map.type === 'COLSTATES' || element.map.type === 'DOCRELATIONS') {


//                             value = computeStateValue(
//                                 element.optionValue?.type,
//                                 element.optionValue?.key,
//                                 mapValue.name,
//                                 mapValue.name, index,
//                                 [...mapValue.states,
//                                 { key: '_id', defaultValue: mapValue._id },
//                                 { key: 'meta-name', defaultValue: mapValue.name }]);


//                             label = computeStateValue(
//                                 element.state?.type,
//                                 element.state?.key,
//                                 mapValue.name,
//                                 mapValue.name, index,
//                                 [...mapValue.states,
//                                 { key: '_id', defaultValue: mapValue._id },
//                                 { key: 'meta-name', defaultValue: mapValue.name }]);
//                         }
//                         else {
//                             const val = mapValue;
//                             value = val;//computeStateValue(element.optionValue?.type, element.optionValue?.key, val, val, index, []);
//                             // const lab = mapValue.label ? mapValue.label : mapValue;

//                             label = val//computeStateValue(element.state?.type, element.state?.key, lab, lab, index, []);
//                         }


//                         return <option value={value}>{label}</option>

//                     }) : getOptions(element).map((val, index) => <option key={index} selected={val.selected} value={val.value}>{val.label || val.value}</option>)



//                 )}
//         </span>{hoverPosition == 'end' && children}</span>


//     const InputsElement = <span style={{ display: 'inline-block' }}>{hoverPosition == 'above' && children}
//         <span  {...elementInfoAttributes} style={{

//             padding: '10px',
//             borderRadius: 5,
//             margin: '10px',
//             display: 'inline-block',
//             outline: '1px dashed #bdbdbd',
//             ...(node?._uid == element._uid || hovering ?
//                 { outline: `2px dashed ${colorPrimary}` } : {}),

//         }}>
//             {Array.isArray(mapValue) ? mapValues.map((mapValue, index) => {

//                 let value = "";
//                 let label = "";
//                 if (element.map.type == 'COLSTATES' || element.map.type == 'DOCRELATIONS') {


//                     value = computeStateValue(
//                         element.optionValue?.type,
//                         element.optionValue?.key,
//                         mapValue.name,
//                         mapValue.name, index,
//                         [...mapValue.states,
//                         { key: '_id', defaultValue: mapValue._id },
//                         { key: 'meta-name', defaultValue: mapValue.name }]);


//                     label = computeStateValue(
//                         element.state?.type,
//                         element.state?.key,
//                         mapValue.name,
//                         mapValue.name, index,
//                         [...mapValue.states,
//                         { key: '_id', defaultValue: mapValue._id },
//                         { key: 'meta-name', defaultValue: mapValue.name }]);
//                 }
//                 else {
//                     const val = mapValue.value ? mapValue.value : mapValue;
//                     value = computeStateValue(element.optionValue?.type, element.optionValue?.key, val, val, index, []);
//                     const lab = mapValue.label ? mapValue.label : mapValue;

//                     label = computeStateValue(element.state?.type, element.state?.key, lab, lab, index, []);
//                 }

//                 return <label> {element.labelPos == 0 && label} {e(element.tagName,
//                     { ...attributes, className: classes + " " + element.className, value, ...(element.onChange ? { onChange } : {}), ...(element.onClick ? { onClick } : {}) })}
//                     {element.labelPos == 1 && label} </label>



//             }) : Array.isArray(element.options) ?
//                 element.options.map((s, index) => <label> {element.labelPos == 0 && (s.label || s.value)} {e(element.tagName,
//                     { ...attributes, className: classes + " " + element.className, value: s.value, checked: s.selected == 1, ...(element.onChange ? { onChange } : {}), ...(element.onClick ? { onClick } : {}) })}

//                     {element.labelPos == 1 && (s.label || s.value)}
//                 </label>) : <label>{element.labelPos == 0 && element.label}
//                     {e(element.tagName,
//                         { value: stateValue, ...attributes, className: classes + " " + element.className, ...(element.onChange ? { onChange } : {}), ...(element.onClick ? { onClick } : {}) },
//                         null)} {element.labelPos == 1 && element.label} </label>

//             }
//         </span>{hoverPosition == 'end' && children}</span>


//     const Medialement = <span style={{ display: 'inline-block' }}>{hoverPosition == 'above' && children}
//         <span  {...elementInfoAttributes} style={{

//             padding: '10px',
//             borderRadius: 5,
//             margin: '10px',
//             display: 'inline-block',
//             outline: '1px dashed #bdbdbd',
//             ...(node?._uid == element._uid || hovering ?
//                 { outline: `2px dashed ${colorPrimary}` } : {}),
//         }}>
//             {
//                 e(element.tagName,
//                     { width: 320, height: 240, controls: true, poster: element.poster, ...attributes, className: classes + " " + element.className, ...(element.onChange ? { onChange } : {}), ...(element.onClick ? { onClick } : {}) },
//                     [Array.isArray(element.srcs) && element.srcs.map(src => <source src={src.src} type={src.mimetype} />),
//                     parse(element.nodeValue)])

//             }
//         </span>{hoverPosition == 'end' && children}</span>


//     const SingleElement = ({ value, mapValue, mapIndex, docStates, docRelations }) => {


//         let childs = Array.isArray(element.childNodes) ? element.childNodes : [];

//         if (element.state?.key == 'activeItem') {
//             const slides = getStateValue(['slides'], states);
//             const index = getStateValue(['slideIndex'], states);

//             if (Array.isArray(slides) && parseInt(index) >= 0)

//                 childs = childs.concat([slides[index]]);

//         }

//         return selectTag ? React.cloneElement(SelectElement, { ref }) : inputTag ? React.cloneElement(InputsElement, { ref }) : mediaTag ? React.cloneElement(Medialement, { ref }) :
//             closeTag ?
//                 React.cloneElement(ClosedElement, { ref }) : e(element.tagName,
//                     { ...attributes, className: classes + " " + element.className, ...(element.onChange ? { onChange } : {}), ...(element.onClick ? { onClick } : {}) },
//                     [
//                         hoverPosition == 'above' && children,
//                         <span
//                             {...elementInfoAttributes}
//                             className="ac-000-yrbQEpZzT"
//                             style={{

//                                 padding: 5,
//                                 margin: 5,
//                                 width: 'auto',
//                                 height: 'calc(100% - 20px)',
//                                 outline: '1px dashed #0000002b',
//                                 ...(hovering ?
//                                     { outline: `1px solid ${colorPrimary}` } : {}),


//                             }}
//                         >{parse(value ? value : `<span style=" user-select: none; color: #cccccc;">${element.layout || element.tagName}</span>`)}
//                             {child && childs.length > 0 && <><NestedElements
//                                 componentType={componentType}
//                                 mapValue={mapValue}
//                                 mapIndex={mapIndex}
//                                 parent={element}
//                                 states={states}
//                                 props={props}
//                                 index={index}
//                                 setProps={setProps}
//                                 docStates={docStates}
//                                 docRelations={docRelations}
//                                 formStates={formStates}
//                                 setFormStates={setFormStates}
//                                 setStates={setStates}
//                                 colStates={colStates}
//                                 setColStates={setColStates}

//                                 childs={childs} /></>}  {hoverPosition == 'end' && children}</span>,]
//                 )
//     }


//     const isMapping = element.map ? true : false;

//     const render = isMapping && !selectTag ? mapValues.map((mapValue, idx) => {


//         const isobj = mapValue instanceof Object ? true : false;
//         return <>
//             <Element
//                 key={idx}
//                 ref={ref}
//                 parent={parent}
//                 node={node}
//                 index={index}
//                 element={{ ...element, map: undefined }}
//                 states={states}
//                 docStates={isobj ? [...mapValue.states,
//                 { key: '_id', defaultValue: mapValue._id },
//                 { key: 'meta-name', defaultValue: mapValue.name }] : docStates}
//                 docRelations={docRelations}
//                 setStates={setStates}
//                 formStates={formStates}
//                 setFormStates={setFormStates}
//                 props={props}
//                 setProps={setProps}
//                 colStates={colStates}
//                 setColStates={setColStates}
//                 children={children}
//                 hoverPosition={hoverPosition}
//                 mapValue={isobj ? mapValue.name : mapValue}
//                 mapIndex={idx}
//                 hovering={hovering}
//                 onSelect={onSelect}
//             />
//         </>

//         // let value = '';
//         // if (element.map.type === 'COLSTATES' || element.map.type === 'DOCRELATIONS') {


//         //     value = computeStateValue(
//         //         element.state?.type,
//         //         element.state?.key,
//         //         element.nodeValue,
//         //         mapValue.name, index,
//         //         [...mapValue.states,
//         //         { key: '_id', defaultValue: mapValue._id },
//         //         { key: 'meta-name', defaultValue: mapValue.name }]);
//         // }
//         // else
//         //     value = computeStateValue(element.state?.type, element.state?.key, element.nodeValue, mapValue, index, docStates);


//         // return React.cloneElement(SingleElement({ value, mapValue, mapIndex: index, docStates, docRelations: mapValue.relations }), { key: index, ref: index == 0 ? ref : null })


//     }) : React.cloneElement(SingleElement({ value: stateValue, mapValue, mapIndex, docStates, docRelations }), { ref: ref })



//     //const _uid = getStateValue(['slides'], states)[getStateValue(['slideIndex'], states)];

//     return <>{conditions && render}
//     </>;



// });

// export default Element;


import React, { useMemo } from 'react';


const Element = ({   tagName, customAttributes = {}, attributes, classes, children = null }) => {


    return tagName ? React.createElement(
        tagName,
        {
            ...customAttributes,
            ...attributes,
            className: classes
        },
        children
    ) : <InlineSkeleton />
};

export default Element;