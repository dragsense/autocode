
import React, { useEffect, useRef, useState } from 'react';
import ElementToolbar from './ElementToolbar';

import { LeftOutlined, RightOutlined, SettingOutlined, SaveOutlined, DragOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Button, Modal, Tooltip } from 'antd';

import Draggable from 'react-draggable';
import { ModalElement } from '../../../Element';

import { ModalTemplate } from '../../../Element/Template';
import usePageStates, { useNodeStates } from '@/components/Editor/PageProvider';

import { isEmpty } from '@/lib/utils';

function ToolBar({ children, drag, onCopy, onDelete, onMargin, onPadding, onContent, type }) {

  const [show, setShow] = useState(false);

  const [openTemplate, setOpenTemplate] = useState(false);

  const { node } = useNodeStates();
  const {page} = usePageStates();

  const showTemplateModal = () => {
    setOpenTemplate(true);
  };
  const handleTemplateOk = (e) => {
    setOpenTemplate(false);
  };

  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = (e) => {
    setOpen(false);
  };

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



    <buttom style={{
      fontSize: '10px', color: '#fff',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    }}

      onClick={showModal}
    ><SettingOutlined size="10px" /></buttom>

{((isEmpty(node.parent) && page?.type === "template") || page?.type !== 'template') && <buttom style={{
      fontSize: '10px', color: '#fff',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer'
    }}

      onClick={showTemplateModal}
    ><SaveOutlined size="10px" /></buttom>}


    <a style={{ fontSize: 10, cursor: 'pointer' }} onClick={e => { e.preventDefault(); setShow(!show) }}>

      {show ? <LeftOutlined size="10px" /> : <RightOutlined size="10px" />}

    </a>



    {show && <ElementToolbar
      onMargin={onMargin} onPadding={onPadding} onContent={onContent} type={type}
      drag={drag} onCopy={onCopy}
      onDelete={onDelete}></ElementToolbar>}

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
      onOk={handleOk}

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

      
    ><ModalElement /></Modal>

<Modal
      title="Create New Template"
      
      open={openTemplate}
      onOk={handleTemplateOk}

      modalRender={(modal) => (
      
          <div>
            
          {modal}
         
          
          </div>
      )}

      
    ><div style={{marginTop: 30}}><ModalTemplate node={node} template={page?.type === 'template' ? page : null}/>  </div></Modal>


  </>

}

export default ToolBar;