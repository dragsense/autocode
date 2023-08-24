
import React, { useEffect, useMemo } from "react";

import { getStateValue, getStateStates, getPaginationRange } from '@/lib/utils/elementNode';
import ElementSetting from "./ElementSetting";

import ElementLayout from "./ElementLayout";

const ElementMapping = (props) => {

    const { map, node, _states, _props, setting, colStates, children, mapValue } = props;

    const getValue = (elem, value = []) => {
        const type = elem.type;
        const key = elem.key;

        switch (type) {
            case 'GLOBAL':
                if (key[0] === "PAGES") {
                    if (setting?.pages)
                        return setting.pages.map((value) => {
                            return {
                                type: "pages",
                                label: value.name,
                                value: value._id,
                                ...value
                            }
                        })
                }

            case 'PROPS':
                return getStateStates(key, _props);
            case 'STATES':

                if (key[0] === 'pages') {
                    const value = _states[key[0]];

                    if (value?.states)
                        return value.states.map((value) => {
                            return {
                                type: "pages",
                                label: value.name,
                                value: value._id,
                                ...value
                            }
                        })
                } else if (key[0] === 'items') {
                    const currentPage = _states['currentIndex'] ? _states['currentIndex'].defaultValue : 1;
                    const limit = _states['limit'] ? _states['limit'].defaultValue || 10 : 10;
                    const total = _states['total'] ? _states['total'].defaultValue : 1;

                    const totalPages = Math.ceil(total / limit);
                    const pagination = { leftRange: 1, rightRange: 1, nearRange: 4, dots: '...' }
                    const pages = getPaginationRange(currentPage, totalPages, pagination).map((value, index) => {

                        const val = parseInt(value);
                        const isNan = isNaN(val);
                        return {
                            label: value,
                            value: val,
                            notClickable: isNan,
                        }
                    });


                    return pages;
                }
                else
                    return getStateStates(key, _states);
            case 'COLSTATES':
                if (key[0] === 'STATES') {
                    const modifiedKey = [...key];
                    modifiedKey.shift();
                    return getStateStates(modifiedKey, colStates.states);;
                }
                else {

                    if (key[0] === 'DOCUMENTS' && colStates.documents) {
                        return colStates.documents.map((value) => {
                            return {
                                type: "docs",
                                label: value.name,
                                value: value._id,
                                ...value
                            }
                        })
                    } else
                        if (key[0] === 'RELATIONSHIPS' && colStates.relationships) {

                            return colStates.relationships.map((value) => {
                                return {
                                    label: value.name,
                                    value: value._id,
                                }
                            })
                        }
                    if (key[0] === 'RELATIONS' && colStates.relations) {

                        return colStates.relations.length > 0 ? colStates.relations.map((value) => {
                            return {
                                type: "docs",

                                label: value.name,
                                value: value._id,
                                ...value
                            }
                        }) : [{
                            label: '',
                            value: '',
                        }]
                    }
                    else
                        if (key[0] === 'PAGES') {
                            const currentPage = colStates.page || 1;
                            const totalPages = Math.ceil(colStates.maxPage / colStates.limit);
                            const pagination = colStates.pagination || { leftRange: 1, rightRange: 1, nearRange: 4 }
                            const pages = getPaginationRange(currentPage, totalPages, pagination).map((value, index) => {

                                const val = parseInt(value);
                                const isNan = isNaN(val);
                                return {
                                    label: value,
                                    value: val,
                                    notClickable: isNan,
                                }
                            });

                            return pages;
                        }
                        else {
                            if (key[0] === 'docsLength' && colStates.documents)
                                return colStates.documents.length;
                            else
                                return colStates[key[0]]
                        }
                }

            default:
                return value;
        }

    }


    let nodes = useMemo(() => {

        if (!map)
            return [];


        let values = getValue(map);

        return values || [];

    }, [map, _states, _props, colStates, mapValue]);

    let options = useMemo(() => {

        if (!node.options)
            return [];

        const options = node.options.split(",");
        return options.map((value) => {
            const val = value.split(":");
            return { label: val[1], value: val[0] }
        })

    }, [node.options]);

    // const childs = React.Children.map(children, (child) => {
    //     return React.cloneElement(child, {
    //         mapValue,
    //         mapIndex
    //     });
    // })




    // const elements = (node.layout == 'select' || node.tagName == 'select') ?
    //     element(mapValue, mapIndex, [...options, ...nodes].map((mapValue, mapIndex) => {

    //         return <ElementSetting
    //             key={mapIndex}
    //             states={states}
    //             node={{ _uid: mapIndex + 1, tagName: 'option' }}
    //             attributes={node.childAttributes}
    //             classes={{}}
    //             conditions={node.childConditions}
    //             mapValue={mapValue}
    //             mapIndex={mapIndex}
    //         />
    //     }
    //     ))

    //     : [...options, ...nodes].map((mapValue, mapIndex) => element(mapValue, mapIndex, React.Children.map(children, (child) => {
    //         return React.cloneElement(child, {
    //             key: mapIndex,
    //             mapValue,
    //             mapIndex,
    //             colStates: { ...colStates, ...mapValue }
    //         });
    //     })))



    // if ((node.layout == 'select' || node.tagName == 'select') && nodes.length > 0) {
    //     options = nodes;
    //     nodes = [];

    // }

    return <ElementLayout
        {...props}
        nodes={[...options, ...nodes]}
        layout={node.layout}
        options={options}
    >
        {children}
    </ElementLayout>


    //return [...options, ...nodes].length > 0 ? elements : element(mapValue, mapIndex, childs);


};

export default ElementMapping;