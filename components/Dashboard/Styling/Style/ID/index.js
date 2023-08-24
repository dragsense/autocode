

import React, { useEffect, useState } from 'react';
import { AutoComplete, Input, Select, Divider, Space } from 'antd';
import Add from './add';

const { TextArea } = Input;
const { Option } = Select;

import { useCssNodeStates } from "../..";



export function IDs({setElement, _id, setId}) {

    const { getIds, addCssRule } = useCssNodeStates();
    const [ids, setIds] = useState([]);

    const [currentId, setCurrentId] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [newItem, setNewItem] = useState('');

    useEffect( () => {
        const _ids =  getIds();
        setIds(_ids);
    }, []);


    function handleChange(value) {
        setId(value);
        setElement('id');
    }

    let selectOptions = ids.map(item => <Option key={item.name} value={item.name}> {item.name} </Option>);

    const handleSearch = (value) => {
        const filteredOptions = ids.filter(item => item.name.includes(value));
        if (filteredOptions.length <= 0)
            setNewItem(value.trim());
        else
            setNewItem('');
    };


    return (
        <Space size={2} align='end'>
        <label className='styling-label' style={{ textTransform: 'capitalize' }}>IDs: </label>
            <Select
                allowClear
                showSearch
                style={{ width: '200px' }}
                loading={isLoading}
                placeholder="Please select"
                onChange={handleChange}
                onSearch={handleSearch}
                dropdownRender={menu => (
                    <div>
                        {newItem && <Add
                            addRule={addCssRule}
                            newItem={newItem}
                            setNewItem={setNewItem}
                            setIsLoading={setIsLoading} />}
                        {menu}
                    </div>
                )}
            >
                {selectOptions}
            </ Select>
        </Space>
    );
}
