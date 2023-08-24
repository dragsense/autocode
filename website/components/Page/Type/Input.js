
import React, { useEffect, useMemo, useState } from 'react';

const Input = (props) => {
    const { _uid, onChange, value, children } = props;

    const [v, setV] = useState(value);

    const onChangeValue = (e) => {
        if(onChange)
        onChange(_uid, e.target.value);
        else
        setV(e.target.value);

    }


    useEffect(() => {
        setV(value);
    }, [value])


    const InputElement = React.cloneElement(children, { customAttributes: { onChange: onChangeValue, value: v } });

    return InputElement;

};

export default Input;