
import React, { useState, useRef, useEffect } from 'react';

import { PlusOutlined, DragOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

import Draggable from 'react-draggable';

import { TagComponent } from '@/components/Panel/LeftPanel/Tag';

import { useNodeStates, useCssNodeStates } from '@/components/Editor/PageProvider';

import { v4 as uuid } from 'uuid';

import Columns from './Columns';
import Table from './Table'
import { object } from 'prop-types';

function AddElement({ hoverClass, addCol, addTable, element, parent, index }) {

  const { setUState, node } = useNodeStates();
  const { setEditorSelector } = useCssNodeStates();

  const onSelectItem = (tag) => {

    const unique_id = uuid();
    const unique_id2 = uuid();

    const obj = {
      _uid: unique_id,
      tagName: tag.tag,
      type: tag.type,
      layout: tag.layout,
      setting: tag.setting,
      nodeValue: '',
      attributes: [...(tag.attributes || [])],
      childNodes: [{ _uid: unique_id2, nodeValue: tag.text ? tag.text : '' }]
    };

    if (tag.layout == 'list') {
      const unique_id = uuid();
      const unique_id2 = uuid();
      obj.childNodes.push({ 
        _uid: unique_id,
        tagName: 'li',
        childNodes:[{ _uid: unique_id2, nodeValue: tag.text ? tag.text : '' }]
      });
    }


    if (tag.layout == 'flex' || tag.layout == 'grid') {
      const unique_id3 = uuid();
      obj.childNodes = [{
        _uid: unique_id2,
        tagName: 'div',
        type: 'layout',
        layout: 'fg-child',
        setting: { width: '100%' },
        nodeValue: '',
        childNodes: [{ _uid: unique_id3, nodeValue: '' }]
      }
      ]
    }

   

    if (tag.layout == 'table') {


      obj.thead = {
        enable: true,
        cols: 1,
        rows: 1
      }

      obj.tbody = {
        cols: 1,
        rows: 1
      }

      obj.tfoot = {
        enable: true,
        cols: 1,
        rows: 1
      }

      const unique_id1 = uuid();
      const unique_id2 = uuid();
      const unique_id11 = uuid();
      const unique_id111 = uuid();

      const unique_id3 = uuid();
      const unique_id4 = uuid();
      const unique_id12 = uuid();
      const unique_id121 = uuid();

      const unique_id5 = uuid();
      const unique_id6 = uuid();
      const unique_id13 = uuid();
      const unique_id131 = uuid();

      obj.childNodes = [
        {
          _uid: unique_id1,
          tagName: 'thead',
          type: 'layout',
          layout: 'thead',
          nodeValue: '',
          childNodes: [
            {
              _uid: unique_id2,
              tagName: 'tr',
              type: 'layout',
              layout: 'tr',
              nodeValue: '', childNodes: [{
                _uid: unique_id11,
                tagName: 'th',
                type: 'layout',
                layout: 'th',
                nodeValue: '',
                childNodes: [{ _uid: unique_id111, nodeValue: 'Head 1 x 1' }]
              }]
            }]
        },
        {
          _uid: unique_id3,
          tagName: 'tbody',
          type: 'layout',
          layout: 'tbody',
          nodeValue: '',
          childNodes: [{
            _uid: unique_id4,
            tagName: 'tr',
            type: 'layout',
            layout: 'tr',
            nodeValue: '', childNodes: [{
              _uid: unique_id12,
              tagName: 'td',
              type: 'layout',
              layout: 'td',
              nodeValue: '',
              childNodes: [{ _uid: unique_id121, nodeValue: 'Body 1 x 1' }]
            }]
          }]
        },
        {
          _uid: unique_id5,
          tagName: 'tfoot',
          type: 'layout',
          layout: 'tfoot',
          nodeValue: '',
          childNodes: [{
            _uid: unique_id6, tagName: 'tr',
            type: 'layout',
            layout: 'tr',
            nodeValue: '', childNodes: [{
              _uid: unique_id13,
              tagName: 'td',
              type: 'layout',
              layout: 'td',
              nodeValue: '',
              childNodes: [{ _uid: unique_id131, nodeValue: 'Foot 1 x 1' }]
            }]
          }]
        },
      ]
    }


    if (tag.tag == 'option') {
      obj.childNodes = null
    }


    if (hoverClass) {

      setUState({
        fun: () => {
          parent.childNodes.splice(index, 1);
        }
      });
      parent.childNodes.splice(index, 0, obj);
    }
    else {
      setUState({
        fun: () => {
          parent.childNodes.pop();
        }
      })



      element.childNodes = [...element.childNodes, obj]
    }

    setEditorSelector('.ac-' + element.tagName + '-class-');

  }

  const onAddTable = (tag, colTag, rows, cols, text, enable, index) => {


    let obj = {};

    if (element.childNodes[index])
      obj = element.childNodes[index]
    else {
      const unique_id = uuid();

      obj = {
        _uid: unique_id,
        tagName: tag,
        type: 'layout',
        layout: tag,
        enable,
        nodeValue: '',
        childNodes: []
      };

      element.childNodes.push(obj);
    }


    if (enable) {
      for (let i = 0; i < rows; i++) {

        let row = {};
        if (obj.childNodes[i])
          row = obj.childNodes[i];
        else {
          const unique_id = uuid();

          row = {
            _uid: unique_id,
            tagName: 'tr',
            type: 'layout',
            layout: 'tr',
            nodeValue: '',
            childNodes: []
          };

          obj.childNodes.push(row);
        }

        for (let j = 0; j < cols; j++) {

          let col = {};
          if (row.childNodes[j])
            col = row.childNodes[j];
          else {
            const unique_id = uuid();
            const unique_id2 = uuid();

            col = {
              _uid: unique_id,
              tagName: colTag,
              type: 'layout',
              layout: colTag,
              nodeValue: '',
              childNodes: [{ _uid: unique_id2, nodeValue: text + " " + i + " x " + j }]
            };

            row.childNodes.push(col);
          }

        }

        row.childNodes.splice(cols, row.childNodes.length);

      }

    }else
    obj.childNodes = [];


    obj.childNodes.splice(rows, obj.childNodes.length);
    element.childNodes[index] = obj;


  }

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

    if (addTable) {


      onAddTable('thead', 'th', element.thead.rows, element.thead.cols, 'Head', element.thead.enable, 0);
      onAddTable('tbody', 'td', element.tbody.rows, element.tbody.cols, 'Body', true, 1);
      onAddTable('tfoot', 'td', element.tfoot.rows, element.tfoot.cols, 'Foot', element.tfoot.enable, 2);
    }

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

    <button style={{
      fontSize: '16px', color: '#f88a24',
      border: 'none',
      color: '#fff',
      backgroundColor: '#f88a24',
      lineHeight: 0.5,
      padding: 4,
      cursor: 'pointer'
    }}
      onClick={showModal}
    > <PlusOutlined /></button>

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


    >
      {addCol ? <Columns onSelect={onSelectItem} /> :
        addTable ? <Table onSelect={onSelectItem} element={element} /> :
          <TagComponent onSelect={onSelectItem} gridStyle={{ width: '100%', textAlign: 'center' }} />}</Modal>



  </>

}

export default AddElement;