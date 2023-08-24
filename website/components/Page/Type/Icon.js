
import React, { Children, useMemo } from 'react';

const Icon = ({ onClick, value, layout, children, pos }) => {


    const clonedElement = React.cloneElement(children, {
        customAttributes: {
            dangerouslySetInnerHTML: { __html: layout === 'svg-icon' ? value : '' }
        }
    });


    return clonedElement;


};

export default Icon;