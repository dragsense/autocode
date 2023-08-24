
import React, { useMemo } from 'react';

const Image = (props) => {
    const { _uid, pos, value,name, children } = props;


    const image =
        value.value ?
            { src: value.value, alt: value.label || "image" } :
            { src: value, alt: "image" };

    const ImageElement = React.cloneElement(children, {
            customAttributes: {
                src: image.src, alt: image.alt,
                "data-id": _uid,
                "data-pos": pos,
                "data-name": name,
                "draggable": false,
            }
        })



    return ImageElement;

};

export default Image;