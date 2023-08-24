import { useEffect, useState } from 'react';
import { Select, Divider, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;



export default function Add({ addRule, newItem, setNewItem,  setIsLoading }) {

    const addItem = async () => {

        setIsLoading(true);

        if (newItem) {
            const name = newItem.replace(/\s{2,}/g, ' ').trim().toLowerCase();
           
            await addRule(name, {},  1, null, null);
        }
        setNewItem('');
        setIsLoading(false);
    }

    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                <Input style={{ flex: 'auto' }} value={newItem} />
                <a
                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                    onClick={addItem}
                >
                    <PlusOutlined />
                </a>
            </div>
            <Divider style={{ margin: '4px 0' }} />
        
        </>

    );
}