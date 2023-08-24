

import React, { useEffect, useState } from 'react';
import { Select, Space } from 'antd';



export function Element({ element, setElement, elements, type }) {


    function onChange(value) {
        setElement(value);
    }


    return (
        <Space size={2} align='center'>
            <label className='styling-label' style={{ textTransform: 'capitalize' }}>{type}: </label>

                <Select placeholder="Select Element" value={element} onChange={onChange} style={{width: 150}}>
                    {elements.map(el => <Option value={el}>{el}</Option>)}
                </Select>
        </Space>
    );
}
