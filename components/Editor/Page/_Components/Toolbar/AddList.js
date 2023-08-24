
import React, { useState, useRef, useEffect } from 'react';

import { PlusOutlined, DragOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

import Draggable from 'react-draggable';

import { TagComponent } from '@/components/Panel/LeftPanel/Tag';

import { useNodeStates, useCssNodeStates } from '@/components/Editor/PageProvider';

import { v4 as uuid } from 'uuid';

import { object } from 'prop-types';

function AddList({ element }) {

 
    const onAddList = () => {


        let obj = {};


        const unique_id = uuid();
        const unique_id2 = uuid();

        obj = {
            _uid: unique_id,
            tagName: 'li',
            type: 'text',
            layout: 'list',
            childNodes: [{_uid: unique_id2, nodeValue: ''}]
        };

        element.childNodes.push(obj);


    }




    return <>

        <button style={{
            fontSize: '16px', color: '#f88a24',
            border: 'none',
            color: '#fff',
            backgroundColor: '#f88a24',
            lineHeight: 0.5,
            padding: 4,
            cursor: 'pointer'
        }}
            onClick={onAddList}
        > <PlusOutlined /></button>



    </>

}

export default AddList;