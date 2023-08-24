import React, { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic';
import { theme, Popover, Modal, Tag, Button, Slider, Tooltip, InputNumber, Layout } from "antd";
import { DeleteOutlined, BarsOutlined, SlidersOutlined, BarChartOutlined, ArrowsAltOutlined, ScissorOutlined, CaretRightFilled, CaretLeftFilled, SettingOutlined, EditOutlined } from "@ant-design/icons";
import ToolBar, { ToolBarButton } from './ToolBar';
import PropTypes, { element } from 'prop-types';

import AddElement from "./AddElemet";
import Element from ".";
import { useDrag } from 'react-dnd';

// import ResizePadding from "@//lib/utils/resizePadding";

import ResizePadding from '@/lib/utils/resizePadding';
import ResizeContent from '@/lib/utils/resizeContent';
import ResizeMargin from "@/lib/utils/resizeMargin";

const cursorStyle = ['w-resize',
    'n-resize',
    'w-resize',
    'n-resize',

];
const units = ['PX', '%'];

import {
    DragOutlined, ExclamationCircleFilled
} from "@ant-design/icons";
import { FaCompressAlt, FaExpand, FaExpandAlt, FaExpandArrowsAlt } from "react-icons/fa";
import { MdOpenWith } from "react-icons/md";
import { BsArrowLeft, BsArrowRight, BsArrowsMove } from "react-icons/bs";
import { RiArrowLeftFill, RiArrowRightFill } from "react-icons/ri";
import { transform } from "typescript";

import { ModalTemplate } from "./Template";
const { confirm } = Modal;

const UNITS = ['px', 'em', 'rem', '%'];

import LayoutStyle from '../Element/LayoutStyle';
import LayoutContent from '../Element/LayoutContent';
import Setting from "./Setting";
import { getData, updateData } from "@/lib/utils/db";

function ToolBarExpandButton({ selector, type, button, colorPrimaryBg }) {
    const [unit, setUnit] = useState({

        [`${type}-top`]: UNITS[0],
        [`${type}-bottom`]: UNITS[0],
        [`${type}-left`]: UNITS[0],
        [`${type}-right`]: UNITS[0],
        width: UNITS[0],
        height: UNITS[0]
    })


    const [values, setValues] = useState({

        [`${type}-top`]: 0,
        [`${type}-bottom`]: 0,
        [`${type}-left`]: 0,
        [`${type}-right`]: 0,
        width: 0,
        height: 0
    });

    useEffect(() => {

        if (!selector)
            return;

        let properties = selector.properties;

        if (!properties)
            properties = selector.properties = {};

        let top = properties[`${type}-top`];

        if (!top)
            top = selector.properties[`${type}-top`] = {}

        let bottom = properties[`${type}-bottom`];


        if (!bottom)
            bottom = selector.properties[`${type}-bottom`] = {}

        let right = properties[`${type}-right`]

        if (!right)
            right = selector.properties[`${type}-right`] = {}

        let left = properties[`${type}-left`]

        if (!left)
            left = selector.properties[`${type}-left`] = {}

        let width = properties[`width`]

        if (!width)
            width = selector.properties[`width`] = {}

        let height = properties[`height`]

        if (!height)
            height = selector.properties[`height`] = {}



        setUnit({
            [`${type}-top`]: top.unit || UNITS[0],
            [`${type}-bottom`]: bottom.unit || UNITS[0],
            [`${type}-left`]: left.unit || UNITS[0],
            [`${type}-right`]: right.unit || UNITS[0],
            width: width.unit || UNITS[0],
            height: height.unit || UNITS[0],

        });

        setValues({
            [`${type}-top`]: top.value || 0,
            [`${type}-bottom`]: bottom.value || 0,
            [`${type}-left`]: left.value || 0,
            [`${type}-right`]: right.value || 0,
            width: width.value || 0,
            height: height.value || 0,

        })

    }, [selector])

    const handleSliderChange = (key, value) => {
        setValues((prevState) => ({ ...prevState, [key]: value }));

        selector.style[`${key}`] = values[key] + unit[key];
        selector.properties[`${key}`].value = values[key];
    };

    const handleUnitChange = (key, value) => {
        setUnit((prevState) => ({ ...prevState, [key]: value }));

        selector.style[`${key}`] = values[key] + unit[key];
        selector.properties[`${key}`].unit = unit[key]

    };

    const getSliderTooltip = (key) => {
        return (<div style={{ padding: "10px" }}>
            <label>{key}</label>
            <br />

            <div style={{ marginTop: "10px", minWidth: 200, display: 'flex' }}>
                <Tooltip title={UNITS.map((u) => (

                    <Tag.CheckableTag onChange={() => handleUnitChange(key, u)} checked={unit[key] == u}>{u}</Tag.CheckableTag>

                ))} placement="top">
                    <Tag> {unit[key]}</Tag>
                </Tooltip>
                <div style={{ flex: 1, marginLeft: 10 }}>
                    <Slider
                        min={type == 'margin' ? -100 : 0}
                        max={100}
                        step={0.1}
                        value={values[key]}
                        onChange={(value) => handleSliderChange(key, value)}

                    />
                </div>
            </div>
        </div>
        );
    };

    const getTooltipContent = () => {
        switch (type) {
            case "padding":
            case "margin":
                return (
                    <>

                        {getSliderTooltip(`${type}-top`)}
                        {getSliderTooltip(`${type}-bottom`)}
                        {getSliderTooltip(`${type}-left`)}
                        {getSliderTooltip(`${type}-right`)}
                    </>
                );
            case "size":
                return (
                    <>
                        {getSliderTooltip("width")}
                        {getSliderTooltip("height")}
                    </>
                );
            default:
                return null;
        }
    };

    const getIcon = () => {
        switch (type) {
            case "padding":
                return <FaCompressAlt style={{ fontSize: "14px" }} />;
            case "margin":
                return <FaExpandAlt style={{ fontSize: "14px" }} />;
            case "size":
                return <FaExpand style={{ fontSize: "14px" }} />;
            default:
                return null;
        }
    };



    return (
        <div style={{ position: "relative" }}>
            <ToolBarButton type={button}>
                <Tooltip trigger="click" title={getTooltipContent()} placement="top" arrowPointAtCenter>
                    {getIcon()}
                </Tooltip>
            </ToolBarButton>
        </div>
    );
}



const SetToolBar = ({ node, children, isDragging, setIsDragging, colorPrimaryBg }) => {


    const [outterBox, setOutterBox] = useState(null);

    const resizeObserver = new ResizeObserver(entries => {
        const rect = node.node.getBoundingClientRect();
        setOutterBox({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });

    });

    useEffect(() => {

        if (!node.node) {
            setOutterBox(null);
            return;
        }

        resizeObserver.observe(node.node);

        return () => {
            resizeObserver.disconnect();
        }


    }, [node]);

    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const ref = useRef();

    const handleMouseDown = (e) => {
        setIsDragging(true);
        const rect = node.parentNode.getBoundingClientRect();
        setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseMove = (e) => {
        if (isDragging && node) {
            const newLeft = e.clientX - dragOffset.x;
            const newTop = e.clientY - dragOffset.y;
            node.style.left = newLeft + "px";
            node.style.top = newTop + "px";
            setOutterBox({ left: newLeft, top: newTop, width: outterBox.width });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
        }
    };

    const transitionStyle = {
        transition: "padding 0.2s ease-in-out",
    };


    return (<>   {(outterBox?.width > 0 && outterBox?.height > 0) && <>

        <div

            style={{
                display: "inline-block",
                zIndex: 1,
                pointerEvents: 'none',
                position: "absolute",
                top: outterBox.top,
                left: outterBox.left,
                width: outterBox.width,
                height: outterBox.height,
                border: `2px solid ${colorPrimaryBg}`,
            }}
        >
        </div>
        <div
            style={{
                display: "inline-block",
                zIndex: 99,
                position: "absolute",
                top: outterBox.top - 20,
                left: outterBox.left - 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: outterBox.width,
                minWidth: "fit-content",
                height: 4,
                ...transitionStyle,
            }}
        >

            <Button
                ref={ref}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: "move" }}
            >
                <DragOutlined style={{ fontSize: "14px", pointerEvents: "none" }} />
            </Button>
            {children}
        </div>
    </>}</>);
};


export default ({ state, onUpdate, onAddElement, onCopyElement, onDeleteElement, onAddTemplate }) => {


    const {
        token: { colorPrimary, colorBorder, colorBgElevated, colorPrimaryBg, colorError },
    } = theme.useToken();

    const [isDragging, setIsDragging] = useState(false);

    const [showLeftBar, setLeftBar] = useState(false);
    const [showRightBar, setRightBar] = useState(false);



    const toggleLeftBar = () => {

        if (showRightBar && !showLeftBar)
            setRightBar(false);

        setLeftBar(!showLeftBar);
    };


    const toggleRightBar = () => {

        if (!showRightBar && showLeftBar)
            setLeftBar(false);

        setRightBar(!showRightBar);
    };

    const onCopyNodes = (event) => {
        event.preventDefault();
        onCopyElement(state.node.node);
    }

    const onAddMenus = async (menus) => {


        if (!state.node?.node || state.node?.layout !== 'menu')
            return;

        const pos = state.node.node.dataset.pos;

        const element = await getData(state.page._id, state.node._uid)
        element.menus = menus;
        await updateData(state.page._id, element);

        await onAddElement({ tag: 'li', addmenu: true }, state.node._uid, false, pos, null);
    }

    const onAdd = async (tag, addToAbove) => {


        if (!state.node?.node)
            return;

        const pos = state.node.node.dataset.pos;
        await onAddElement(tag, state.node._uid, addToAbove, pos, null);
    }


    const onUpdateNNodes = (type, data) => {

        if (type === 'menu')
            onAddMenus(data);
        else
            onUpdate(data);

    }


    const onDeleteNodes = (event) => {
        event.preventDefault();

        confirm({
            title: 'Are you sure to delete this element?',
            icon: <ExclamationCircleFilled />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                onDeleteElement(state.node.node);
            },
            onCancel() {

            },
        });



    }



    const onDragStart = (e) => {

        if (!state.node?.node)
            return;

        const pos = state.node.node.dataset.pos;
console.log({ _uid: state.node._uid, dragPos: pos, move: true })
        e.dataTransfer.setData('text/plain', JSON.stringify({ _uid: state.node._uid, dragPos: pos, move: true }));
    };



    return <>


        {state.node && <SetToolBar node={state.node} isDragging={isDragging} setIsDragging={setIsDragging} colorPrimaryBg={colorPrimaryBg}>


            <div style={{ display: 'flex', alignItems: 'center' }}>
                <ToolBarButton type="ghost" title="move" onClick={toggleLeftBar}>
                    {showLeftBar ? <CaretLeftFilled style={{ color: colorPrimary }} />
                        : <CaretRightFilled style={{ color: colorBgElevated }} />}
                </ToolBarButton>

                <div style={{ width: `${showLeftBar ? "100%" : "0px"}`, display: 'inline-block', verticalAlign: 'middle', overflow: 'hidden' }}>
                    <div

                        style={{

                            width: 'max-content',
                            transition: "transform  0.2s ease-in-out",
                            transform: `translateX(${showLeftBar ? "0%" : "-100%"})`
                        }}
                    >

                        <div style={{
                            marginLeft: 2,
                            gap: 4,
                            display: 'inline-flex', color: '#fff',
                            textTransform: 'uppercase', fontSize: '14px', fontWeight: 500
                        }}>
                            <span style={{
                                background: colorPrimary,
                                padding: 5,
                                borderRadius: 5,

                            }}>{state.node.name || state.node.tagName}
                                {" "} 
                                <Setting node={state.node} onUpdate={onUpdate}>
                                    <EditOutlined />
                                </Setting>
                            </span>

                            {/* <Element /> */}

                            <LayoutStyle selector={state.selector} layout={state.node.layout}>
                                <ToolBarButton type="dashed" title="setting">
                                    <SettingOutlined style={{ color: colorPrimary }} />
                                </ToolBarButton>
                            </LayoutStyle>

                             <AddElement onAddElement={onAdd} currentElement={state.node} />
                            {/* <ToolBarExpandButton selector={state.selector} type="margin" button={"dashed"}>

                            </ToolBarExpandButton>
                            <ToolBarExpandButton selector={state.selector} type="padding" button={"dashed"} >

                            </ToolBarExpandButton>
                            <ToolBarExpandButton selector={state.selector} type="size" button={"dashed"}>

                            </ToolBarExpandButton> */}
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ flex: 1, pointerEvents: 'none', height: '100%', width: 10 }}></div>
            <div style={{ display: 'flex', alignItems: 'center' }}>

                <div style={{ width: `${showRightBar ? "100%" : "0px"}`, display: 'inline-block', verticalAlign: 'middle', overflow: 'hidden' }}>
                    <div

                        style={{
                            width: 'max-content',
                            transition: "transform  0.2s ease-in-out",
                            transform: `translateX(${showRightBar ? "0%" : "100%"})`

                        }}
                    >



                        <div style={{ marginRight: 2 }}>

                            <LayoutContent state={state} onUpdate={onUpdateNNodes}>
                                <ToolBarButton type="dashed" title="setting">
                                    <EditOutlined style={{ color: colorPrimary }} />
                                </ToolBarButton>
                            </LayoutContent>



                            <ToolBar
                                onCopy={onCopyNodes}
                                onDelete={onDeleteNodes}
                                colorPrimary={colorPrimary}
                                colorPrimaryBg={colorPrimaryBg}
                                colorError={colorError} />
                        </div>


                    </div>
                </div>

                <ToolBarButton type="ghost" title="move" onClick={toggleRightBar}>

                    {showRightBar ? <CaretRightFilled style={{ color: colorPrimary }} />
                        : <CaretLeftFilled style={{ color: colorBgElevated }} />}


                </ToolBarButton>
                <div style={{ marginRight: 2 }}>
                    <ModalTemplate
                        element={state}
                    />
                </div>


                <Button type="primary"
                    draggable={true}
                    onDragStart={onDragStart}
                    title="move"><BsArrowsMove style={{ fontSize: "14px", }} /></Button>

            </div>

        </SetToolBar>}


    </>
}