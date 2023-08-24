
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from '@/lib/utils'

const Select = (props) => {
    const { onChange, value, _uid, children, innerWraaper } = props;

    const ref = useRef(null);

    const onChangeValue = (e) => {

        const fun = (e) => {
            const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);
            
            onChange(_uid, selectedValues.join(','), selectedValues.includes("all"));
        }
        debounce(fun(e), 500)
    }

    useEffect(() => {

        if (!ref.current)
            return;
        const selectElement = ref.current;
        const selectedOptions = value.split(',');
        if (selectElement) {
            const optionsLength = selectElement.options.length;
            const selectedLength = selectedOptions.length;

             if (selectedLength > 0) {
                for (let i = optionsLength - 1; i > -1; i--) {
                    selectElement.options[i].selected = selectedOptions.includes(selectElement.options[i].value);
                }
            }
        }

    }, [value, ref.current])

    const SelectElement = React.cloneElement(children, { customAttributes: { ref, onChange: onChangeValue } }, innerWraaper)

    return SelectElement;

};

export default Select;