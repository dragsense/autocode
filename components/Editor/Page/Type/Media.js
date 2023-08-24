
import React, { useMemo } from 'react';
import { nanoid } from 'nanoid';

const Media = (props) => {
    const { tag, pos, _uid, value, children } = props;

    const poster =
        value.value ?
            { src: value.value, alt: value.label || tag } :
            { src: value, alt: tag };

    const srcs = Array.isArray(value.srcs) ? value.srcs : [];


    let sources = srcs.map((media, index) => {
        return <source key={index} src={media.src} type={media.mimetype} />
    });

    const key = useMemo(() => {

        return nanoid(4);

    }, [value.srcs])


     if (srcs.length <= 0 && tag == 'audio')
         sources = [<source key={'default'} src={poster.src} type="audio/mp3" />]

    const InputsElement = <div data-id={_uid}
            data-pos={pos} draggable={false} style={{
                border: '10px solid transparent',
                outline: '1px dashed #bdbdbd' ,
                 cursor: 'pointer',
                 display: 'inline-block'
            }} >
            {React.cloneElement(children, { key,
                customAttributes:
                    {  width: 320, height: 'auto', controls: true, 
                    poster: tag == 'video' ? poster.src : undefined, 
                    alt: poster.alt,
                     }
            }, [...sources, `Your browser does not support the ${tag} element.`])}

        </div>

    return InputsElement;

};

export default Media;