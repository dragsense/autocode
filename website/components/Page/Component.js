
import { debounce } from '@/lib/utils'

import React, { useEffect, useState, useMemo, useCallback } from "react";

import ElementMapping from './ElementMapping';

const e = React.createElement;
import { getStateValue, updateStateValue, getStateRef } from '@/lib/utils';

const Component = (props) => {

    const { component, node, pages, _states, children, _id } = props;


    const comp = pages[component._id];


    const [states, setStates] = useState(comp.states);
    const [colStates, setColStates] = useState({ ...comp.colStates, loading: 0 });



    const getValue = (elem, value = '') => {
        const type = elem.type;
        const key = elem.key;

        switch (type) {
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


            setColStates({ ...collection, documents, states, maxPage, loading: 0 });




        } catch (e) {
        } finally {
        }
    }



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

        const node = pages[_id].elements[id];
        if (node && node.onClick) {
            const onclick = node.onClick;
            setValue(onclick, stateValue.value ?? stateValue, withValue.value ?? withValue);
        }

    }, [states, colStates])

    const onChange = useCallback(async (id, value, all = false) => {

        const node = pages[_id].elements[id];

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

    }, [states])


    const onSubmit = useCallback((states) => {
        setStates({ ...states });
    }, [states])


    return <ElementMapping {...props} map={node.map}>

        {React.Children.map(children, (child) => {
            return child && React.cloneElement(child, {
                onChange: onChange,
                onClick: onClick,
                onSubmit: onSubmit,
                _id: component._id,
                _states: states,
                _props: _states,
                colStates: colStates
            })
        })}
    </ElementMapping>




};


export default Component;