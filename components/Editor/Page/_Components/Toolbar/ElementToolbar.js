import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import { DeleteOutlined,
     CopyOutlined, 
    DragOutlined,BorderOuterOutlined, 
    BorderInnerOutlined, ExpandOutlined } from "@ant-design/icons";
import {TbBoxMargin, TbBoxPadding, TbResize} from 'react-icons/ti'
import { useNodeStates } from '@/components/Editor/PageProvider';

export function ToolBarButton({ children, drag, onDoubleClick, title, active }) {


    const [show, setShow] = useState(false);

    const [style, setStyle] = useState({
        color: '#fff',
        fontWeight: 600,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: 10,
        position: 'relative'
    });

    return <><button ref={drag} onDoubleClick={onDoubleClick}
        onMouseEnter={() => {setShow(true); setStyle({ ...style, color: '#f88a24' })}}
        onMouseLeave={() => {setShow(false); setStyle({ ...style, color: '#fff' })}}
        style={{...style, color: active ? '#f88a24' : '#fff' }}>
        {children}

        {show && <div style={{
        width: 'fit-content',
        backgroundColor: '#f88a24',
        color: '#fff',
        textAlign: 'center',
        padding: '3px',
        fontSize: 12,
        borderRadius: '6px',
        position: 'absolute',
        top: '-26px',
    left: '-50%',
        zIndex: 1}}>{title}</div>}
    </button> </>
}

function ElementToolbar({ drag, onCopy, onDelete, onMargin, onPadding, onContent, type }) {

    const {  onModifyNodeContent } = useNodeStates();

    const OnSaveContent = (event) => {
        event.preventDefault();
        event.stopPropagation();
       // onModifyNodeContent(info, selection.parentRef);
    }
    const onCopyNodes = (event) => {

        event.preventDefault();
        event.stopPropagation();

       
        onCopy();
    }

    const onDeleteNodes = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onDelete();
    }

    const _onMargin = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onMargin();
    }


    const _onPadding = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onPadding();
    }


    const _onContent = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onContent();
    }


    



    return (
        <>
         
            
                <ToolBarButton  drag={drag} title="move"><DragOutlined size="10px" /></ToolBarButton>
               

            <ToolBarButton active={false} onDoubleClick={onCopyNodes} title="duplicate"><CopyOutlined size="10px" /></ToolBarButton>
            <ToolBarButton active={false} onDoubleClick={onDeleteNodes} title="delete"><DeleteOutlined size="10px" /></ToolBarButton>
            <ToolBarButton active={type.margin} onDoubleClick={_onMargin} title="margin"><BorderOuterOutlined size="10px" /></ToolBarButton>
            <ToolBarButton active={type.padding} onDoubleClick={_onPadding} title="padding"><BorderInnerOutlined size="10px" /></ToolBarButton>
            <ToolBarButton active={type.content} onDoubleClick={_onContent} title="size"><ExpandOutlined size="10px" /></ToolBarButton>
      

        </>
    )
}

export default ElementToolbar;