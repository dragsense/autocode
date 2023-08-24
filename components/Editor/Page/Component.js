// import React, { useEffect, forwardRef, useState, useMemo } from "react";

// import ComponentServices from "@/lib/services/components";
// import Element from "./Element";

// const e = React.createElement;



// export default forwardRef(({
//     parent,
//     node,
//     index,
//     element,
//     props,
//     setProps,
//     formStates,
//     setFormStates,
//     docStates,
//     docRelations,
//     colStates,
//     setColStates,
//     children,
//     hoverPosition,
//     mapValue,
//     mapIndex,
//     hovering,
//     component = false,
//     onSelect
// }, ref) => {


//     const [states, setStates] = useState([]);
//     const [customComponent, setCustomComponent] = useState(null);


//     const load = async (path) => {


//         try {




//             const component = element.component;


//             const _id =component._id;
//             let newStates = [];

//             if (_id) {
//                 const res = await ComponentServices.get(_id);

//                 newStates = Array.isArray(res.component?.states) ? res.component.states : [];
//                 setStates([...newStates]);
//             }

//             if (component.custom) {
//                 setCustomComponent(true);
//             }

//             if (component.componentType) {
//             newStates.push({ key: 'componentType', defaultValue: component.componentType, type: 'wrapper'  });
//             newStates.push({ key: 'slideIndex', defaultValue: 0, type: 'number', min: 0,  });
//             newStates.push({ key: 'slides', defaultValue: [], type: 'ARRAY' });
//             newStates.push({ key: 'activeItem', defaultValue: 0, type: 'BOOLEAN' });
//             newStates.push({ key: 'slideHeight', defaultValue: '200px', type: 'TEXT' });

//             }




//             setStates([...newStates]);


//         } catch (e) {
//             console.log(e?.message)
//         } finally {
//         }

//     };

//     useEffect(() => {

//         if (!element.component)
//             return;

//             load();

//     }, [component.componentType]);


//     return <Element ref={ref}
//         index={index}
//         node={node}
//         hovering={hovering}
//         hoverPosition={hoverPosition}
//         parent={parent}
//         states={states}
//         props={props}
//         setProps={setProps}
//         docStates={docStates}
//         docRelations={docRelations}
//         setStates={setStates}
//         formStates={formStates}
//         setFormStates={setFormStates}
//         setColStates={setColStates}
//         colStates={colStates}
//         element={element}
//         component={component}
//         mapValue={mapValue}
//         mapIndex={mapIndex}
//         onSelect={onSelect}
//     >

//         {customComponent ? <>{`<Component>`}{children} {`</Component>`}</> : children}

//     </Element>



// });



// import React, { useEffect, forwardRef, useState, useMemo } from "react";

// import ComponentServices from "@/lib/services/components";
// import Element from "./Element";

// const e = React.createElement;



// const Component = ({}) => {


//     const [states, setStates] = useState([]);
//     const [customComponent, setCustomComponent] = useState(null);


//     const load = async (path) => {


//         try {

//             const component = element.component;


//             const _id =component._id;
//             let newStates = [];

//             if (_id) {
//                 const res = await ComponentServices.get(_id);

//                 newStates = Array.isArray(res.component?.states) ? res.component.states : [];
//                 setStates([...newStates]);
//             }

//             if (component.custom) {
//                 setCustomComponent(true);
//             }

//             setStates([...newStates]);

//         } catch (e) {

//         } finally {
//         }

//     };

//     useEffect(() => {

//         if (!element.component)
//             return;

//             load();

//     }, [component.componentType]);


//     return <Element ref={ref}
//         index={index}
//         node={node}
//         hovering={hovering}
//         hoverPosition={hoverPosition}
//         parent={parent}
//         states={states}
//         props={props}
//         setProps={setProps}
//         docStates={docStates}
//         docRelations={docRelations}
//         setStates={setStates}
//         formStates={formStates}
//         setFormStates={setFormStates}
//         setColStates={setColStates}
//         colStates={colStates}
//         element={element}
//         component={component}
//         mapValue={mapValue}
//         mapIndex={mapIndex}
//         onSelect={onSelect}
//     >

//         {customComponent ? <>{`<Component>`}{children} {`</Component>`}</> : children}

//     </Element>



// };


// export default Component;

import { debounce } from '@/lib/utils/utils'

import React, { useEffect, forwardRef, useState, useMemo, Children, useCallback } from "react";
import { message } from 'antd';
import ComponentServices from "@/lib/services/components";
import Element from "./Element";
import ElementMapping from './ElementMapping';

const e = React.createElement;
import { InlineSkeleton } from './Elements'
import { getData, storeData, getAllData } from "@/lib/utils/db";
import { getStateValue, updateStateValue, getStateRef } from '@/lib/utils/elementNode';
import DocumentServices from '@/lib/services/documents'

const Component = (props) => {

    const { component, node, _states, _setStates, children, _id } = props;

    const [states, setStates] = useState({});
    const [loading, setLoading] = useState(false);


    const [colStates, setColStates] = useState({ loading: 0 });

    const loadComponent = async (path) => {
        try {
            setLoading(true)
            const _id = component._id;

            if (_id) {

                const node = await getAllData(_id);
                if (node) {
                    if (node.collection) {
                        const collection = await getAllData(node.collection._id);
                        if (!node.collection.page)
                            node.collection.page = 1;
                        if (!node.collection.limit)
                            node.collection.limit = 10;
                        if (collection) {
                            await laodDocumnents({
                                ...node.collection,

                                states: collection.states,
                                relationships: collection.relationships,
                                setting: collection.setting
                            });
                        }
                    }

                    setStates({
                        ...node.states,
                        // __setting__: {
                        //     successMessage: node.setting.successMessage?.defaultValue,
                        //     errorMessage: node.setting.errorMessage?.defaultValue, error: 0, success: 0
                        // }
                    });

                }



            }
        } catch (e) {
            message.error("Something was wrong.")
        } finally {
            setLoading(false)

        }

    };


    const getValue = (elem, value = '') => {
        const type = elem.type;
        const key = elem.key;

        switch (type) {
            case 'PROPS':
                return getStateValue(key, _states);
            case 'STATES':
                return getStateValue(key, states);
            default:
                return value;
        }

    }


    const filters = useMemo(() => {

        let _filters = [];

        if (!colStates.filters)
            return _filters;

        _filters = Object.values(colStates.filters).map(filter => {
            // const key = filter.type ? [filter.type,
            // ...(Array.isArray(filter.key) ? filter.key : [])] : []
            const type = filter.triggerType;
            const key = filter.triggerKey;
            const value = filter.defaultValue;

            let defaultValue = getValue({ type, key }, value);


            // if (key[0] == '__relationship__')
            //     defaultValue = filter.defaultRelationshipsFilter?.map(val => val._id);

            return { filterKey: filter.filterKey, defaultValue }
        }
        )

        console.log(_filters)

        return _filters;

    }, [states]);


    const laodDocumnents = async (collection) => {
        try {
            const collectionId = collection._id;
            let limit = collection.limit;
            let page = collection.page;
            let loadMore = collection.loadMore;
            const withRelationship = collection.withRelationship;
            const docs = collection.docs;
            const selectedRelationships = collection.selectedRelationships;
            const states = collection.states;

            let documents = [];
            let maxPage = collection.maxPage || 0;
            setColStates({ ...collection, loading: 1 });


            if (Array.isArray(docs) && docs?.length > 0) {
                const res = await DocumentServices.getWithFilters(collectionId, { documentIds: docs.map(doc => doc._id), selectedRelationships, withRelationship });

                documents = Array.isArray(res.documents) ? res.documents : [];
                maxPage = res.total;

            }
            else {
                const res = await DocumentServices.getAllWithFilters(collectionId, { filters, withRelationship, selectedRelationships }, page, limit);
                documents = Array.isArray(res.documents) ? res.documents : [];
                maxPage = res.total;

                if (loadMore)
                    documents = [...collection.documents, ...documents];



            }

            setColStates({
                ...collection,

                documents,
                states,
                maxPage,
                loading: 0
            });






        } catch (e) {
            console.log(e?.message)
        } finally {
        }
    }



    useEffect(() => {
        loadComponent();
    }, [])


    useEffect(() => {
        if (!colStates.filters)
            return;

        //debounce((colStates) => {
        laodDocumnents(colStates);
        // }, 500);

    }, [filters])



    const setValue = async (elem, value, withValue) => {
        const type = elem.type;
        const key = elem.key;

        switch (type) {
            case 'PROPS':
                updateStateValue(key, withValue, _states, value);
                _setStates({ ..._states });
            case 'STATES':
                updateStateValue(key, withValue, states, value);
                setStates({ ...states });
            case 'COLSTATES':

                if (key[0] === 'page') {

                    if (isNaN(value))
                        value = colStates.page;

                    const totalPages = Math.ceil(colStates.maxPage / colStates.limit);



                    if (!colStates.loadMore) {
                        const page = { max: totalPages + 1, min: 1, defaultValue: colStates.page }

                        updateStateValue(key, withValue, { page }, value);

                        if (page.defaultValue >= totalPages + 1)
                            return;

                        laodDocumnents({ ...colStates, page: page.defaultValue });
                    }
                }

            case 'FORMSTATES':
                if (states[key[0]]) {
                    states[key[0]][key[1]] = value
                    setStates({ ...states });
                }
            default:
                return;
        }

    }


    const onClick = useCallback(async (id, stateValue, withValue) => {

        const node = await getData(_id, id);
        if (node && node.onClick) {
            const onclick = node.onClick;
            setValue(onclick, stateValue?.value || stateValue, withValue?.value || withValue);
        }

    }, [states, colStates])

    const onChange = useCallback(async (node, value, all = false) => {

        console.log(node.onChange)
        //const node = await getData(_id, id);
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

            setValue(node.onChange, value, '');

        }

    }, [states])


    const onSubmit = useCallback((states) => {
        setStates({ ...states });
    }, [states])


    return <div id="component"> {loading ?
        <InlineSkeleton />
        :
        <ElementMapping {...props} map={node.map}>

            {React.Children.map(children, (child) => {
                return child && React.cloneElement(child, {
                    onChange: onChange,
                    onClick: onClick,
                    onSubmit: onSubmit,
                    _id: component._id,
                    _states: states,
                    _props: _states,
                    _setStates: setStates,
                    colStates: colStates
                })
            })}
        </ElementMapping>}
    </div>



};


export default Component;