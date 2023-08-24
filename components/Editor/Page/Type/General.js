
import React, { Children, useMemo } from 'react';

const General = ({ _uid, conds, onClick, name, innerWraaper, value, children, pos }) => {


    const disabledStyles = {
        pointerEvents: 'none',
        opacity: 0.2,
        border: '1px dashed #ccc',
    };

    const spanElement = !innerWraaper ? [] : ([<>
        {React.isValidElement(value) ? value : value && <div
            dangerouslySetInnerHTML={{ __html: value }}
            data-child={true}
            style={{ pointerEvents: 'none',
             display: 'inline-block' }}
        />
        }
        {innerWraaper}</>
    ]);

    const clonedElement = React.cloneElement(children, {
        customAttributes: {
            onClick,
            "data-id": _uid,
            "data-pos": pos,
            "data-name": name,
            "draggable": false,
            style: conds ? {} :  disabledStyles
        }
    }, spanElement);


    return clonedElement;


};

export default General;