
import React, { useMemo } from 'react';

const CloseTag = (props) => {
    const { _uid, pos, children } = props;




    const CloseElement = <div><div data-id={_uid}
        data-pos={pos} draggable={false} style={{
            padding: '10px',
        }}>
        {React.cloneElement(children)}


    </div>
    </div>



    return CloseElement;

};

export default CloseTag;