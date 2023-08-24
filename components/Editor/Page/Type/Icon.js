
import React, { Children, useMemo } from 'react';

const Icon = ({ _uid, conds, onClick, value, layout, classes, children, pos }) => {


    const disabledStyles = {
        pointerEvents: 'none',
        opacity: 0.2,
    };

 

    const clonedElement = React.cloneElement(children, {
        customAttributes: {
            onClick,
            dangerouslySetInnerHTML:{ __html: layout === 'svg-icon' ? value : '' },
            "data-id": _uid,
            "data-pos": pos,
            "draggable": false,
            style: { ...(conds ? {} : disabledStyles) }
        }
    });


    return clonedElement;


};

export default Icon;