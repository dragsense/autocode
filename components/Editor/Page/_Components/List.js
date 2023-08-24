import React, { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import Router from 'next/router';

import ErrorBoundary from "@/components/ErrorBoundary";
import { useDrag, useDrop } from 'react-dnd';

import usePageStates, { useComponentsStates, useCssNodeStates, useNodeStates } from "../../PageProvider";
import Components from ".";
import { v4 as uuid } from 'uuid';
import { isEmpty } from "@/lib/utils";
import AddElement from "./Toolbar/AddElement";
import ToolBar from "./Toolbar/Toolbar";
import { Button, message, Tooltip } from "antd";
import { fetcher } from "@/lib/fetch";
import parse from 'html-react-parser';
import dynamic from "next/dynamic";
import NodeRect from "../../../../lib/utils/elementNode";
import { MdHideSource } from "react-icons/md";
import ResizeMargin from '../../../../lib/utils/resizeMargin';
import ResizePadding from "../../../../lib/utils/resizePadding";
import ResizeContent from "../../../../lib/utils/resizeContent";
import { MdArrowForward } from "react-icons/md";

import ThemeServices from "@/lib/services/theme";

const options = {
  selectorTypes: ['ID', 'Class', 'Tag', 'NthChild', 'Attributes']
}

import AddList from "./Toolbar/AddList";

const e = React.createElement;

const MODES = ["normal", "editing"];

const cursorStyle = ['w-resize',
  'n-resize',
  'w-resize',
  'n-resize',

];

const units = ['PX', '%'];



const getStateValue = (key, states) => {


  if (!states || !Array.isArray(states))
    return undefined;


  let value = states.find(state => state.key === key[0]);

  if (key[1] !== undefined && value) {

    value = value.defaultValue?.find((state, index) => state.key == key[1] || index == key[1]);

  }
  if (key[2] !== undefined && value)
    value = value.defaultValue.find(state => state.key === key[2]);



  return value?.defaultValue ?? value;
}


const getStateValue2 = (key, states) => {

  if (!states || !Array.isArray(states))
    return undefined;

  let value = states.find(state => state.key === key[0]);

  if (key[1] !== undefined)
    value = value.defaultValue.find(state => state.key === key[1]);

  if (key[2] !== undefined)
    value = value.defaultValue.find(state => state.key === key[2]);

  return value;
}


const updateStateValue = (key, withKey, states, _value, updateKey = "defaultValue") => {


  let value = getStateValue2(key, states);

  if (!value)
    return false;

  let withValue = '';
  if (withKey) {
    withValue = getStateValue(withKey, states)

  }

  try {


    let val = `${eval(`${withValue} ${_value}`)}`
    if (val >= value.max)
      val = value.max;
    else
      if (val <= value.min)
        val = value.min;


    console.log(val);
    value[updateKey] = val;


  } catch (e) {

    message.error(e.message);
  }



}


const updateStateValue2 = (key, states, _value, updateKey = "defaultValue") => {

  let value = getStateValue2(key, states);

  if (!value)
    return false;

  try {
    value[updateKey] = _value;
  } catch (e) {
    message.error(e.message);
  }


}


const getCondtion = (type, key, val, states) => {

  if (!states || !Array.isArray(states))
    return true;


  const value = getStateValue(key, states);
  switch (type) {
    case '=':
      return value == val
      break;
    case '!=':
      return value != val
      break;
    case '<':
      return value < val
      break;
    case '<=':
      return value <= val
      break;
    case '>':
      return value > val
      break;
    case '>=':
      return value >= val
      break;
    default:
      return value == val
  }


}

const BoundingBox = ({ setResizeIndex, resizeIndex, type, unit, setUnit, value, color, box, index }) => {

  const { setToolBar, toolBar } = usePageStates();


  const [showUnit, setShowUnit] = useState(false);

  const onMouseEnter = (e) => {
    e.preventDefault();
    setShowUnit(true);
    e.target.style.cursor = cursorStyle[index];
  }

  const onMouseLeave = (e) => {
    e.preventDefault();

    if (resizeIndex <= -1)
      setShowUnit(false);
    e.target.style.cursor = 'auto';
  }

  const onMouseDown = (i) => {

    setResizeIndex(index);
    setUnit(i);
    setToolBar({ ...toolBar, busy: true, is: false })
  }

  useEffect(() => {

    if (resizeIndex == index)
      setShowUnit(true);
    else
      setShowUnit(false);

  }, [resizeIndex]);


  return <div

    style={{
      zIndex: 1,
      position: 'absolute',
      top: box.y,
      left: box.x,
      width: 5,
      height: 5,
      borderRadius: 10,
      border: `2px solid ${color}`,
      background: 'white',
      pointerEvents: 'auto'
    }}>
    <div onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ position: 'relative', width: '300%', height: '300%', left: '-150%', top: '-150%' }}
    >

      <div
        style={{
          visibility: showUnit ? 'visible' : 'hidden',
          zIndex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          color,
          background: '#fff',
          zIndex: 2,
        }}>


        <button onMouseDown={(e) => {
          e.preventDefault();

          onMouseDown(0);
        }}
          style={{
            color: 0 == unit ? '#fff' : color,
            fontWeight: 600,
            border: 'none',
            cursor: cursorStyle[index],
            background: 0 == unit ? '#f88a24' : 'transparent',
            minWidth: 25,
            fontSize: 12,
          }}>{index == resizeIndex && 0 == unit ? value : units[0]}</button>

        {type === 'size' && <button onMouseDown={(e) => {
          e.preventDefault();

          onMouseDown(1);
        }}
          style={{
            color: 1 == unit ? '#fff' : color,
            fontWeight: 600,
            border: 'none',
            cursor: cursorStyle[index],
            background: 1 == unit ? '#f88a24' : 'transparent',
            minWidth: 25,
            fontSize: 12,
          }}>{index == resizeIndex && 1 == unit ? value : units[1]}</button>}

      </div>


    </div>
  </div>
}

const BoundingBoxes = ({ nodeRect, type, color, rect, Resize }) => {

  const { setToolBar, toolBar } = usePageStates();
  const { selector } = useCssNodeStates();
  const itemRef = useRef();
  const { document } = useNodeStates();

  const [resizeIndex, setResizeIndex] = useState(-1);
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState(0);

  useEffect(() => {

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizeIndex]);

  const handleMouseMove = (e) => {
    if (resizeIndex <= -1 || selector?.type == 'HTML') return;

    Resize.Action(itemRef.current, rect, resizeIndex, nodeRect, selector, { x: e.pageX, y: e.pageY }, setValue, units[unit]);

  };

  const handleMouseUp = () => {


    nodeRect.update(document);
    setResizeIndex(-1)

    setToolBar({ ...toolBar, busy: false, is: true })
  };

  return <>
    <div
      ref={itemRef}
      style={{

        position: 'absolute',
        left: rect.x - 2,
        top: rect.y,
        width: rect.width + 2,
        height: rect.height - 2,
        border: `1px solid ${color}`,
        pointerEvents: 'none'

      }}>

      <div style={{ position: 'relative', width: '100%', height: '100%' }}> {rect.boundingBoxes.map((box, index) =>
        <>

          {!(type === 'size' && (index == 1 || index == 0)) && <BoundingBox
            value={value}
            box={box}
            type={type}
            setUnit={setUnit}
            unit={unit}
            resizeIndex={resizeIndex}
            setResizeIndex={setResizeIndex}
            index={index}
            color={color} />}</>)}

      </div>

    </div></>

}

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));


const Wrraper = ({ children,
  parent,
  element,
  component,
  index,
  setStates,
  docValue,
  states,
}) => {
  const ref = useRef();

  const { modify, page, setToolBar, toolBar } = usePageStates();
  const { get, setCurrentComponent, getCurrentComponent } = useComponentsStates();
  const { node, setCurrentNode, document,
    setUState, undoStyle, redoStyle } = useNodeStates();
  const { setEditorSelector } = useCssNodeStates();

  const [nodeRect, setNodeRect] = useState(null);
  const [content, setContent] = useState(false);
  const [margin, setMargin] = useState(false);
  const [padding, setPadding] = useState(false);
  const [activeClass, setActiveClass] = useState('');

  const [value, setValue] = useState('');

  const isPage = page.type === 'page';

  // const o = new MutationObserver(() => {


  //   const length = ref.current.style.length;
  //   if (length <= 0) {
  //     element.style = undefined;
  //     return;
  //   }

  //   for (let i = length; i--;) {
  //     const nameString = ref.current.style[i];
  //     element.style = { ...element.style, [nameString]: ref.current.style[nameString] }
  //   }
  // });

  // useEffect(() => {
  //   if (!ref.current) return;

  //   o.observe(ref.current, { attributes: true, attributeFilter: ["style"] });


  //   return () => {
  //     o.disconnect();
  //   }
  // }, []);

  useEffect(() => {
    if (!ref.current || !document) return;

    const _nodeRect = new NodeRect();
    _nodeRect.node = ref.current;
    _nodeRect.update(document);
    setNodeRect(_nodeRect);

    return () => {

    }
  }, [document]);

  const onMouseClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (element.tagName === 'select') {
      const uid = e.target.options[e.target.selectedIndex].getAttribute("data-uid");
      const elem = element.childNodes.find(c => c._uid == uid)

      if (elem) {
        setCurrentNode({ element: elem, ref: null, parent: null });

      }

    }

    if (element.onClick) {

      if (component &&
        element.onClick.key[0] == 'pagination' &&
        component.page &&
        component.page[element.onClick?.rel]
      ) {

        try {
          const page = component.page[element.onClick.rel];
          const limit = component.limit[element.onClick.rel];
          const maxPage = component.maxPage[element.onClick.rel];
          const minPage = component.minPage;

          let val = `${eval(`${page} ${element.onClick.value}`)}`

          if (val >= maxPage || val >= (maxPage / limit) + 1)
            val = parseInt(maxPage / limit) + 1;
          else
            if (val <= minPage)
              val = minPage;

          component.page[element.onClick.rel] = val;
          component.refresh = { collection: element.onClick.rel }
        } catch (e) {
          message.error(e?.message);
        }

      } else {

        updateStateValue(element.onClick.key, element.onClick.withKey, states, element.onClick.value)

        setStates([...states]);
      }


    }

    if (component, component?.filter && component.filter[element.onFilterClick?.rel]) {

      // updateStateValue(element.onClick.key, element.onClick.withKey, states, element.onClick.value)

      let value = '';
      if (element.onFilterClick.key &&
        element.onFilterClick.key[0] === 'relationship') {
        value = getStateValue(element.onFilterClick.value, docValue);

      }
      else
        value = element.onFilterClick.value;



      component.filter[element.onFilterClick.rel].filterValue = value;
      component.filter[element.onFilterClick.rel].filterKey = element.onFilterClick.key;

      component.refresh = { collection: element.onFilterClick.rel }

    }


  }

  const onDoubleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (component && isPage) {
      setCurrentComponent(component);

      setCurrentNode({ element: parent, ref: null, parent: parent ? parent : {} });


    }
    else {

      setCurrentComponent(component);
      setCurrentNode({ element, ref: ref.current, parent: parent ? parent : {} });

    }
  }

  const onChange = (e) => {
    e.preventDefault();
    e.stopPropagation();


    const value = e.target.value;

    if (element.onChange) {
      let obj = getStateValue2(element.onChange.key, states);

      if (e.target.getAttribute("type") == 'checkbox') {

        obj.defaultValue = !obj.defaultValue;
      } else
        obj.defaultValue = value;


      setStates([...states]);
    } else
      setValue(value);


    if (component && component?.filter && component.filter[element.onFilterChange?.rel]) {



      component.filter[element.onFilterChange.rel].filterValue = value;
      component.filter[element.onFilterChange.rel].filterKey = element.onFilterChange.key;
      component.refresh = { collection: element.onFilterChange.rel };


    }


  };

  const onSubmit = async (e) => {


    e.preventDefault();

    let responseBody = {};
    let action = '';
    let method = '';
    let headers = '';

    let sMessage = '';
    let eMessage = '';
    let redirect = '';


    if (component && component.form) {
      const id = localStorage.getItem("project");
      const response = await fetcher('/api/projects/' + id, {
        method: 'GET'
      });

      action = `http://${response.project.domain}:${response.project.port}/api/form/${component._id}`;
      method = 'POST';
      headers = { 'Content-Type': 'application/json', 'x-api-key': response.project.apikey }

      responseBody = JSON.stringify(component.states);

      redirect = getStateValue('redirect', component.setting);

      sMessage = getStateValue('successMessage', component.setting);
      eMessage = getStateValue('errorMessage', component.setting);

    } else {
      const formData = new FormData(e.currentTarget);
      formData.forEach((value, property) => responseBody[property] = value);

      action = element.setting.action;
      method = element.setting.method;
      headers = { 'Content-Type': 'multipart/form-data' }


      redirect = element.setting.redirect;

      sMessage = element.setting.successMessage;
      eMessage = element.setting.errorMessage;
    }

    const messgaeID = element.setting.messgaeID;

    const loadingId = element.setting.loadingId;
    const errorId = element.setting.errorId;

    const loadingElem = document.querySelector('#' + loadingId);

    if (loadingElem)
      loadingElem.style.display = 'block';


    try {
      const response = await fetcher(action, {
        method: method,
        headers: headers,
        body: responseBody
      });

      if (redirect)
        Router.push(redirect);

      if (message) {
        const element = document.querySelector('#' + messgaeID);
        element.innerText = message || 'Successfuly Submit. Thank You!';
      }

    } catch (e) {

      const errorElem = document.querySelector('#' + errorId);

      if (errorElem)
        errorElem.innerText = eMessage || 'Something went wrong. Please try again!';

    } finally {
      if (loadingElem)
        loadingElem.style.display = 'none';
    }




  };

  useEffect(() => {

    if (!ref.current)
      return;

    //isEditable ? ref.current.contentEditable = true : ref.current.contentEditable = false;

    if (node?.element === element) {

      const _nodeRect = new NodeRect();
      _nodeRect.node = ref.current;
      _nodeRect.update(document);
      setNodeRect(_nodeRect);
      const outterBox = _nodeRect.boxModel.margin;
      const contentBox = _nodeRect.boxModel.content;
      const innerBox = _nodeRect.rect;


      // setActiveClass('elem-drag-container-hover');
      const _toolBar = (is) => <><div style={{
        zIndex: 100000,
        padding: '0 5px',
        position: 'absolute', backgroundColor: '#2fc1ff',
        top: outterBox.y - 24,
        left: (outterBox.x) - 2,
        display: is ? 'inline-block' : 'none',
        // transform: 'rotate(180deg)',
        // transformOrigin: 'top',
        width: 'max-content'
      }}>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', columnGap: 5 }}>
          {parent && <div className="ac-003-Dk2sy6ph96ryxdOy9vMtlosyrbQEpZzT" style={{ width: 'auto', top: -24, left: -2, textAlign: 'right' }}>
            <AddElement title="Preppend" hoverClass={true} addCol={false} element={element} parent={parent} index={index} />
          </div>}
          <span style={{ fontSize: '14px', textTransform: 'uppercase' }}>{element.tagName + ' as ' + element.name}</span>
          <div style={{ dsiplay: 'inline-block', height: '22px', border: '1px solid #fff' }}>
            <div className="ac-003-Dk2sy6ph96ryxdOy9vMtlosyrbQEpZzT" style={{ position: 'relative', padding: 0, height: 'auto', left: 0, bottom: 1 }}>
              {(element.layout == 'table') && <AddElement title="Table Setting" addTable={true} hoverClass={false} element={element} parent={parent} index={index} />}
              
              {(element.layout == 'list') && <AddList title="Add List Items" element={element} />}
           
              {(element.layout == 'flex' || element.layout == 'grid') && <AddElement title="Add Columns" addCol={true} hoverClass={false} element={element} parent={parent} index={index} />}
            </div>
          </div>


          <ToolBar drag={drag} onCopy={onCopy} onDelete={onDelete} type={{ content, margin, padding }}
            onContent={() => {

              if (!content) {
                setMargin(false);
                setPadding(false);
              }

              setContent(!content);

            }}

            onMargin={() => {

              if (!margin) {
                setContent(false);
                setPadding(false);
              }

              setMargin(!margin);



            }}

            onPadding={() => {

              if (!padding) {
                setMargin(false);
                setContent(false);
              }


              setPadding(!padding);
            }}

          />

        </div>
      </div>
        <div style={{
          display: is ? 'inline-block' : 'none',
          border: '1px solid #2fc1ff',
          position: 'absolute',
          width: outterBox.width + 2,
          height: outterBox.height - 2,
          top: outterBox.y,
          left: (outterBox.x) - 2,
          pointerEvents: 'none'
        }}>



        </div>



        <div style={{
          position: 'absolute',
          display: is ? 'inline-block' : 'none',
          width: outterBox.width + 2,
          height: 10,
          top: (innerBox.y + innerBox.height) - 10,
          left: (outterBox.x) - 2,
        }}>


          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div className="ac-003-Dk2sy6ph96ryxdOy9vMtlosyrbQEpZzT" style={{ left: -5, textAlign: 'right' }}>
              {(element.layout !== 'flex' && element.layout !== 'grid' && element.layout !== 'table') && <AddElement addCol={false} hoverClass={false} title="Append" element={element} parent={parent} index={index} />}
            </div>
          </div>
        </div>



        <div style={{
          display: 'inline-block',
          position: 'absolute',

          width: outterBox.width + 2,
          height: innerBox.y - outterBox.y,
          top: outterBox.y,
          left: (outterBox.x) - 2,
        }}>

        </div>

        {margin && <BoundingBoxes color={'#f1c79a'}
          type={'margin'}
          nodeRect={_nodeRect}
          rect={outterBox}
          Resize={ResizeMargin} />}

        {padding && <BoundingBoxes color={'#bec988'}
          type={'padding'}
          nodeRect={_nodeRect}
          rect={innerBox} Resize={ResizePadding} />}

        {content && <BoundingBoxes color={'#19274b'}
          type={'size'}
          nodeRect={_nodeRect}
          rect={contentBox} Resize={ResizeContent} />}


      </>


      setEditorSelector(element.selector ? element.selector : '.ac-' + element.tagName + '-class-');

      setToolBar({ is: true, full: _toolBar });
    } //else setActiveClass('');

  }, [node, content, padding, margin])

  const onMouseEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (component && index > 0 && isPage)
      return;



    if (!nodeRect || toolBar.busy)
      return;

    nodeRect.update(document);

    if (node?.element !== element) {
      const innerBox = nodeRect.boxModel.content;

      const _toolBar = <div style={{
        zIndex: 100000,
        padding: '0 5px',
        display: 'inline-block',
        position: 'absolute', backgroundColor: '#f88a24',
        top: innerBox.y - 16,
        left: (innerBox.x) + 3,
        // transform: 'rotate(180deg)',
        // transformOrigin: 'top',
        width: 'max-content'
      }}>
        <div style={{/*transform: 'scale(-1,-1)'*/display: 'flex', alignItems: 'center', columnGap: 5 }}>
          <span style={{ fontSize: '14px', textTransform: 'uppercase' }}>{element.tagName + ' as ' + element.name}</span>
        </div>
      </div>

      //ref.current.style.outline = '1px dashed #f88a24'

      setToolBar({ ...toolBar, is: false, partial: _toolBar });
    }

  };

  const onMouseExit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (component && index > 0 && isPage)
      return;

    if (!nodeRect || toolBar.busy)
      return;
    //ref.current.style.outline = '1px dashed #bdbdbd'

    setToolBar({ ...toolBar, is: true, partial: null });
  };




  const onCopy = () => {

    const unique_id = uuid();
    // if (component)
    //   component.elements.splice(index + 1, 0, { ...element, _uid: unique_id });
    // else

    if (element.can) {
      const index = element.can[1];
      if (index == -1) {
        message.error("Sorry! can't duplicate this item!")
        return;
      }
    }



    if (component?.formelements)
      if (component.formelements.includes(element.formelment)) {
        message.error("Already Exist");
        return;
      }



    let newObj = JSON.parse(JSON.stringify(element));
    newObj._uid = unique_id;
    parent.childNodes.splice(index + 1, 0, newObj);

    setUState({
      fun: () => {
        parent.childNodes.splice(index + 1, 1);
      }
    });


    modify();
  }

  const onDelete = () => {

    // if (component)
    //   component.elements.splice(index, 1);
    // else

    if (element.can) {
      const index = element.can[2];
      if (index == -1) {
        message.error("Sorry! can't delete this item!")
        return;
      }
    }

    if (component?.formelements) {
      const index = component.formelements.indexOf(element.formelment);
      if (index !== -1)
        component.formelements.splice(index, 1);
    }



    setUState({
      fun: () => {
        parent.childNodes.splice(index + 1, 0, element);
      }
    });

    parent.childNodes.splice(index, 1);



    modify();
  }

  const onEdit = () => {

  }


  const [isDragging, drag, preview] = useDrag({
    item: () => { return { element, index, parent } },
    type: 'moveItem',
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
    }

  });

  preview(ref);

  const isSingle = element.tagName === 'option' || element.tagName === 'thead' || element.tagName === 'tfoot' || element.tagName === 'tbody';

  const isInput = element.type === 'input';

  const isForm = element.type === 'form';

  const isSubmit = element.type === 'submit';


  // const Render = children ? (
  //   e(element.tagName, { ...attributes, ...events,  className: classes + " " + element.classes.join(' '), ref }, children)
  // ) : (
  //   <>
  //   {toolBar &&
  //     <div style={{
  //       position: 'absolute', backgroundColor: '#f88a24',
  //       padding: 5
  //     }}><ToolBar drag={drag} onCopy={onCopy} onDelete={onDelete} /></div>}
  //   {value}</>
  // );


  return <>{isSingle ? children : React.cloneElement(children, {
    ref: ref,
    onClick: isSubmit ? undefined : onMouseClick,
    onDoubleClick: onDoubleClick,
    onChange: onChange,
    onMouseOver: onMouseEnter,
    onMouseOut: onMouseExit,
    onSubmit: isForm ? onSubmit : undefined
  })}

  </>
};


function ChildWrapper({ children,
  parent,
  element,
  component,
  index }) {

  const { modify, page, setToolBar, toolBar } = usePageStates();

  const { setUState, node } = useNodeStates();

  const ref = useRef();



  const isPage = page.type === 'page';
  const accept = isPage ? (
    (!component) ? ['component', 'tag', 'template', 'moveItem'] : []) :
    ['tag', 'moveItem', 'template', 'form'];



  const [hoverClass, setHoverClass] = useState('');

  const [{ hovering, shallowHovering }, drop] = useDrop({
    accept: accept,

    hover: (item, monitor) => {
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = 20;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the 

      // setToolBar({full: () => {}});

      if (hoverClientY < hoverMiddleY) {
        setHoverClass('ac-002-Dk2sy6ph96ryxdOy9vMtlosyrbQEpZzT');

        return;
      }


      setHoverClass('');

    },
    drop: async (item, monitor) => {
      setToolBar({ ...toolBar, is: true });

      if (!hoverClass && element.componentBlock || (hoverClass && !parent))
        return;



      if (monitor.isOver({ shallow: true })) {
        const itemType = monitor.getItemType();

        if (itemType === 'component') {

          const { component } = item;

          const unique_id = uuid();
          const unique_id2 = uuid();

          const obj = {
            _uid: unique_id,
            tagName: "div",
            nodeValue: '',
            componentBlock: true,
            childNodes: [{
              _uid: unique_id2,
              name: component?.name,
              id: component?._id,
              component: true
            }]
          };


          if (hoverClass) {
            setUState({
              fun: () => {
                parent.childNodes.splice(index, 1);
              }
            })
            parent.childNodes.splice(index, 0, obj);
          }
          else {
            setUState({
              fun: () => {
                parent.childNodes.pop();
              }
            })
            element.childNodes = [...element.childNodes, obj];

          }
          modify();
        } else
          if (itemType === 'tag') {


            const { tag } = item;
            const unique_id = uuid();
            const unique_id2 = uuid();




            const obj = {
              _uid: unique_id,
              tagName: tag.tag,
              type: tag.type,
              layout: tag.layout,
              nodeValue: '',
              childNodes: [{ _uid: unique_id2, nodeValue: tag.text ? tag.text : '' }]
            };

            if (tag.layout == 'flex' || tag.layout == 'grid') {
              const unique_id3 = uuid();
              const unique_id4 = uuid();
              const unique_id5 = uuid();
              obj.childNodes = [{
                _uid: unique_id2,
                tagName: 'div',
                type: tag.type,
                nodeValue: '',
                childNodes: [{ _uid: unique_id3, nodeValue: '' }]
              },
              {
                _uid: unique_id4,
                tagName: 'div',
                type: tag.type,
                nodeValue: '',
                childNodes: [{ _uid: unique_id5, nodeValue: '' }]
              }
              ]
            }

            if (tag == 'option') {
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
            //setEditorSelector('.ac-' + element.tagName + '-class-');
            modify();

          } else if (itemType === 'form') {



            const { tag } = item;


            if (component.formelements)
              if (component.formelements.includes(tag.key)) {
                message.error("Already Exist");
                return;
              }


            const unique_id = uuid();
            const unique_id2 = uuid();

            const unique_id3 = uuid();
            const unique_id4 = uuid();

            const unique_id5 = uuid();
            const unique_id6 = uuid();

            const obj = {
              _uid: unique_id,
              tagName: 'div',
              formelment: tag.key,
              can: [1, -1, 1],
              childNodes: [
                { _uid: unique_id2, nodeValue: '' },
                { _uid: unique_id3, tagName: 'label', childNodes: [{ _uid: unique_id5, nodeValue: tag.label }] },
                {
                  _uid: unique_id4, tagName: 'input',
                  can: [-1, -1, -1],
                  attributes: [
                    {
                      "key": "type",
                      "nodeValue": tag.type
                    },
                    {
                      "key": "placeholder",
                      "nodeValue": tag.defaultValue
                    },
                    {
                      "key": "required",
                      "nodeValue": tag.required
                    }
                  ],
                  "onChange": {
                    "key": [
                      tag.key
                    ]
                  },
                  childNodes: [{ _uid: unique_id6, nodeValue: '' }]
                }
              ]
            };



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
            component.formelements = [...(component.formelements ?? []), tag.key];
            // setEditorSelector('.ac-' + element.tagName + '-class-');
            modify();

          } else if (itemType === 'template') {

            const { template } = item;

            const id = localStorage.getItem("project");
            const response = await fetcher('/api/projects/' + id, {
              method: 'GET'
            });

            const url = `http://${response.project.domain}:${response.project.port}`;
            const apikey = response.project.apikey;

            const res = await ThemeServices.getTemplate(template._id, url, apikey);

            let newObj = JSON.parse(JSON.stringify(res.body[0]));

            if (hoverClass) {

              setUState({
                fun: () => {
                  parent.childNodes.splice(index, 1);
                }
              });
              parent.childNodes.splice(index, 0, newObj);
            }
            else {
              setUState({
                fun: () => {
                  parent.childNodes.pop();
                }
              })

              element.childNodes = [...element.childNodes, newObj]
            }

          } else if (itemType === 'moveItem') {


            if (item.parent === element)
              return;

            if (item.element.can) {
              const index = item.element.can[0];
              if (index == -1) {
                message.error("Sorry! can't move this item!")
                return;
              }
            }

            if (hoverClass) {

              setUState({
                fun: () => {
                  item.parent.childNodes.splice(item.index + 1, 0, { ...item.element });
                  parent.childNodes.splice(index, 1);
                }
              })


              parent.childNodes.splice(index, 0, { ...item.element });

              item.parent.childNodes.splice(item.index + 1, 1);
            }
            else {
              setUState({
                fun: () => {
                  item.parent.childNodes.splice(item.index, 0, { ...item.element });
                  parent.childNodes.pop();
                }
              })

              element.childNodes.push({ ...item.element });
              item.parent.childNodes.splice(item.index, 1);
            }

            modify();

          }

      }

    },
    collect: monitor => ({
      hovering: !!monitor.isOver({ shallow: false }),
      shallowHovering: !!monitor.isOver({ shallow: true }),
    }),
  });


  const classes = shallowHovering ? (hoverClass ? hoverClass :
    'ac-001-Dk2sy6ph96ryxdOy9vMtlosyrbQEpZzT ')
    : '';





  drop(ref);

  const isSingle = element.tagName === 'select' || element.tagName === 'thead' || element.tagName === 'tfoot' || element.tagName === 'tbody';

  return <>
    {isSingle ? children : React.cloneElement(e('span', {}, children),
      {
        key: element._uid,
        ref,
        className: classes + ' ac-000-yrbQEpZzT',
        style: {
          minWidth: '20px',
          width: 'calc(100% - 20px)',
          height: 'calc(100% - 20px)',
          minHeight: '30px',
          padding: '5px',
          margin: '5px',
          cursor: 'pointer',
          outline: '1px dashed #bdbdbd'
        }
      })}



  </>

}

function Element({
  children,
  parent,
  element,
  component,
  mapValue,
  docValue,
  relValue,
  props,
  setStates,
  states,
  setPgination,
  index
}) {


  const [Component, setComponent] = useState(null);

  const events = element.events?.reduce((obj, item) => {
    const func = item[item["key"]];
    return {
      ...obj,
      [item["key"]]: new Function(func.arguments, func.body)
    };
  }, {});

  const getMapKeyValue = (key, value) => {
    return getStateValue(key, value);
  };

  const getValue = (element) => {
    let value = element.state ? getStateValue(element.state, states) ?? element.nodeValue : element.nodeValue;
    value = element.prop ? props[element.prop[0]] ?? value : value;

    value = element.docKey ? getMapKeyValue(element.docKey, docValue) ?? value : value;
    value = element.relKey ? getMapKeyValue(element.relKey, relValue) ?? value : value;
    value = element.mapKey ? mapValue ?? value : value;

    return value;
  }


  const closeTag = element.tagName === 'input' || element.tagName === 'img' || element.tagName === 'hr';
  let value = getValue(element);



  

  let _classes = element.classes?.reduce((a, v) => {

    let cond = true;

    if (v.condition)
      cond = getCondtion(v.condition.type,
        v.condition.key,
        v.condition.value,
        states)


    return a + " " + (cond && v.value)

  }, '');

  _classes = element.selector?.substring(1) + ' ' + _classes;


  let optionValue = '';
  if (element.tagName === 'input') {

    attributes = { value, ...attributes }
    children = true
  } else
    if (element.tagName === 'img') {
      attributes = { src: value || '/images/default/default-img.png', ...attributes, }
    }
    else if (element.tagName === 'option') {

      attributes = { ...attributes, 'data-uid': element._uid }
      optionValue = value;
      children = true
    }

  

  const style = { ...element.style };


  const _states = states?.reduce((a, v) => {

    let val = v.defaultValue;

    if (Array.isArray(val))
      val = v.defaultValue.reduce((na, nv, index) =>
        ({ ...na, [nv.key ? nv.key : index]: nv.defaultValue ? nv.defaultValue : nv }),
        {});
    return { ...a, [v.key]: val }

  }, {});


  const setProp = (key, withKey, value) => {
    updateStateValue(key, withKey, states, value);
  }

  let pagination = null;

  if (element.collection && component && component.page)
    pagination = {
      page: component?.page[element.collection],
      pageSize: component?.limit[element.collection],
      pageCount: component?.maxPage ? component?.maxPage[element.collection] : 0,
      setPage: (value) => {
        component.page[element.collection] = value;
      }
    }

  const Render = children ? (

    e(element.tagName,
      {
        ...attributes, style, ...events, className: _classes ?? ''
      },

      !closeTag ? Component ?
        <div>{`<Component>`}{children}{`</Component>`}</div> : 
        optionValue ? optionValue : <ChildWrapper parent={parent}
          element={element}
          component={component}
          index={index}>{children}</ChildWrapper> : null)
  ) : (
    <> {parse(value ? value : '')}

    </>
  );


  useEffect(() => {



    if (!element.import) {

      setComponent(false);
      return;
    }

    const load = async (path) => {
      if (path) {
        //const comp = dynamic(() => import(`../../../${path}`));

        setComponent(true);
      }
    };


    load(element.import);
  }, [element.import]);


  return <Wrraper
    parent={parent}
    element={element}
    component={component}
    setStates={setStates}
    states={states}
    docValue={docValue}
    setPgination={setPgination}
    index={index}>
    {Render}
  </Wrraper>;
}

function List({
  element,
  parent,
  docValue = [],
  relValue = [],
  mapValue,
  component,
  props,
  states,
  setStates,
  index }) {

  const [documents, setDocuments] = React.useState([]);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);


  useEffect( () => {

    if (!element.collection) {
      setDocuments([])
      return;
    }


    // try {


    //   updateStateValue2(['__loading__'], states, true);

    //   if (element.collection && element.document) {



    //     const id = localStorage.getItem("project");
    //     const response = await fetcher('/api/projects/' + id, {
    //       method: 'GET'
    //     });

    //     const url = `http://${response.project.domain}:${response.project.port}`;
    //     const apikey = response.project.apikey;
    //     let filterkey = component?.filter ? component?.filter[element.collection]?.filterKey : undefined;
    //     let filterVal = component?.filter ? component?.filter[element.collection]?.filterValue : undefined;


    //     if (filterkey &&
    //       filterkey &&
    //       filterkey[0] !== 'relationship')
    //       filterVal = getStateValue(filterVal, states);

    //     const res = await fetcher(`${url}/api/documents/${element.document}/document`, {
    //       method: 'PATCH',
    //       headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
    //       body: JSON.stringify({
    //         filterKey: filterkey,
    //         filterValue: filterVal,
    //         relationship: element.relationship
    //       })
    //     });
    //     if (res)
    //       setDocuments([res]);
    //     else
    //       setDocuments([]);
    //   } else
    //     if (element.collection) {
    //       const id = localStorage.getItem("project");
    //       const response = await fetcher('/api/projects/' + id, {
    //         method: 'GET'
    //       });



    //       const url = `http://${response.project.domain}:${response.project.port}`;
    //       const apikey = response.project.apikey;

    //       let limit = component?.limit ? component.limit[element.collection] : 10;
    //       let page = component?.page ? component.page[element.collection] : 1;


    //       if (!page || page <= 0)
    //         page = 1;

    //       if (!limit || limit <= 0)
    //         limit = 1;


    //       let filterkey = component?.filter ? component?.filter[element.collection]?.filterKey : undefined;
    //       let filterVal = component?.filter ? component?.filter[element.collection]?.filterValue : undefined;


    //       if (filterkey &&
    //         filterkey &&
    //         filterkey[0] !== 'relationship')
    //         filterVal = getStateValue(filterVal, states);



    //       const res = await fetcher(`${url}/api/documents/${element.collection}/document?limit=${limit}&page=${page}`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
    //         body: JSON.stringify({
    //           filterKey: filterkey,
    //           filterValue: filterVal,
    //           relationship: element.relationship
    //         })
    //       });



    //       const more = component?.mode ? component.mode[element.collection] : false;

    //       if (more)
    //         setDocuments([...documents, ...res.docs]);
    //       else
    //         setDocuments(res.docs);


    //       if (component) {
    //         component.maxPage = { ...component.maxPage, [element.collection]: res.count };
    //         component.minPage = 1;

    //       }

    //     }
    // } catch (e) {
    //   setError(e.message);
    // } finally {
    //   updateStateValue2(['__loading__'], states, false);
    // }

  }, []);

  useEffect( () => {



    if (!element.collection) {
      setDocuments([])
      return;
    }

    if (!component && component?.refresh?.collection !== element.collection)
      return;


    // try {


    //   updateStateValue2(['__loading__'], states, true);
    //   setStates([...states]);

    //   if (element.collection && element.document) {



    //     const id = localStorage.getItem("project");
    //     const response = await fetcher('/api/projects/' + id, {
    //       method: 'GET'
    //     });

    //     const url = `http://${response.project.domain}:${response.project.port}`;
    //     const apikey = response.project.apikey;


    //     let filterkey = component?.filter ? component?.filter[element.collection]?.filterKey : undefined;
    //     let filterVal = component?.filter ? component?.filter[element.collection]?.filterValue : undefined;


    //     if (filterkey &&
    //       filterkey &&
    //       filterkey[0] !== 'relationship')
    //       filterVal = getStateValue(filterVal, states);

    //     const res = await fetcher(`${url}/api/documents/${element.document}/document`, {
    //       method: 'PATCH',
    //       headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
    //       body: JSON.stringify({
    //         filterKey: filterkey,
    //         filterValue: filterVal,
    //         relationship: element.relationship
    //       })
    //     });
    //     if (res)
    //       setDocuments([res]);
    //     else
    //       setDocuments([]);
    //   } else
    //     if (element.collection) {
    //       const id = localStorage.getItem("project");
    //       const response = await fetcher('/api/projects/' + id, {
    //         method: 'GET'
    //       });



    //       const url = `http://${response.project.domain}:${response.project.port}`;
    //       const apikey = response.project.apikey;


    //       let limit = component?.limit ? component.limit[element.collection] : 10;
    //       let page = component?.page ? component.page[element.collection] : 1;


    //       if (!page || page <= 0)
    //         page = 1;

    //       if (!limit || limit <= 0)
    //         limit = 1;


    //       let filterkey = component?.filter ? component?.filter[element.collection]?.filterKey : undefined;
    //       let filterVal = component?.filter ? component?.filter[element.collection]?.filterValue : undefined;



    //       if (filterkey &&
    //         filterkey &&
    //         filterkey[0] !== 'relationship')
    //         filterVal = getStateValue(filterVal, states);


    //       const res = await fetcher(`${url}/api/documents/${element.collection}/document?limit=${limit}&page=${page}`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
    //         body: JSON.stringify({
    //           filterKey: filterkey,
    //           filterValue: filterVal,
    //           relationship: element.relationship
    //         })
    //       });



    //       const more = component?.mode ? component.mode[element.collection] : false;

    //       if (more)
    //         setDocuments([...documents, ...res.docs]);
    //       else
    //         setDocuments(res.docs);


    //       if (component) {
    //         component.maxPage = { ...component.maxPage, [element.collection]: res.count };
    //         component.minPage = 1;

    //       }

    //     }
    // } catch (e) {
    //   setError(e.message);
    // } finally {
    //   updateStateValue2(['__loading__'], states, false);
    //   setStates([...states]);
    // }

  }, [component?.refresh]);


  const itemChildren = (mapValue, docValue, relValue) =>
    element.childNodes?.map((child, index) => {
      if (child.component) {

        return (
          <Components
            parent={element}
            key={child._uid}
            block={child}
            props={props}
          />
        );
      }
      return <List
        key={child._uid}
        parent={element}
        mapValue={mapValue}
        docValue={docValue}
        relValue={relValue}
        component={component}
        element={child}
        props={props}
        states={states}
        setStates={setStates}
        index={index}
      />
    });

  const isMapping = element.map ? true : false;

  const mapping = (states) => {


    const value = getStateValue(element.map, states);

    if (value instanceof Array)
      return value;

    return [value];
  };


  const conditions = !element.conditions
    ? true
    : element.conditions?.reduce((prev, current) => {


      return prev && getCondtion(current.type, current.key, current.value, states)


    }, true);

  const RenderElement = (mapValue, docValue, relValue) => {
    return (
      <Element mapValue={mapValue}
        docValue={docValue}
        relValue={relValue}
        parent={parent}
        component={component}
        element={element}
        props={props}
        setStates={setStates}
        states={states}

        index={index}>
        {itemChildren(mapValue, docValue, relValue)}
      </Element>
    );
  };

  const Render = documents.length > 0 ? documents.map((val) => {

    val.states.push({ key: '_id', defaultValue: val._id });

    if (val.relation)
      val.relation.states.push({ key: '_id', defaultValue: val.relation._id });

    return isMapping
      ? mapping(states)
        .map((s) => RenderElement(s, val.states, val.relation && val.relation.states)) :
      RenderElement(mapValue, val.states, val.relation && val.relation.states)
  }) : isMapping
    ? mapping(states)
      .map((s) => RenderElement(s, docValue, relValue)) : RenderElement(mapValue, docValue, relValue);

  if (error)
    return (
      <div>
        <span style={{ color: "red" }}>An Error Has Occured.</span>
        <details>{error && error.toString()}</details>
      </div>
    );



  return <>{conditions && <ErrorBoundary>{Render}</ErrorBoundary>}</>;
}

export default List;
