
import React, { useState, useRef, useEffect } from 'react';

import { PlusOutlined, DragOutlined, SaveOutlined } from '@ant-design/icons';
import { Modal, theme, Button } from 'antd';

import Draggable from 'react-draggable';

import { TagComponent } from '@/components/Panel/LeftPanel/Tag';


import { ToolBarButton } from "./ToolBar";
import Table from './Table'
import Columns from './Columns';



function AddTemplate({ onAddTEmplate, currentElement }) {

    const draggleRef = useRef(null);

    const {
        token: { colorPrimary, colorBgElevated },
    } = theme.useToken();



    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    });

    const showModal = async () => {

        setOpen(true);
    };



    const onCancel = () => setOpen(false);



    const onStart = (_event, uiData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    return <>

        <ToolBarButton colorPrimary={colorPrimary} onClick={showModal} colorPrimaryBg={colorBgElevated}>
            <SaveOutlined
                style={{ fontSize: "14px", color: colorPrimary }}

            />
        </ToolBarButton>

        <Modal
            title={
                <div
                    style={{
                        width: '100%',
                        cursor: 'move',
                    }}
                    onMouseOver={() => {
                        if (disabled) {
                            setDisabled(false);
                        }
                    }}
                    onMouseOut={() => {
                        setDisabled(true);
                    }}

                    onFocus={() => { }}
                    onBlur={() => { }}

                >
                    <DragOutlined />
                </div>
            }
            open={open}
            closable
            onCancel={onCancel}

            footer={
                <div style={{ padding: 5 }}>
                    <Button onClick={onCancel}>Cancel</Button>
                </div>
            }

            modalRender={(modal) => (
                <Draggable
                    disabled={disabled}
                    bounds={bounds}
                    onStart={(event, uiData) => onStart(event, uiData)}
                >
                    <div ref={draggleRef}>
                        {modal}
                    </div>
                </Draggable>
            )}


        >

            <div style={{ height: '60vh', overflow: 'auto' }}>

                {currentElement.layout == 'table' ? <Table onSelect={onSelect} element={currentElement} /> :
                    currentElement.layout == 'flex' || currentElement.layout == 'grid' ?
                        <Columns setCols={setCols} />
                        :
                        <TagComponent
                            onSelect={onSelect}
                            tag={tag}
                            gridStyle={{ width: '100%', textAlign: 'center' }} />}
            </div>
        </Modal>



    </>

}

export default AddTemplate;