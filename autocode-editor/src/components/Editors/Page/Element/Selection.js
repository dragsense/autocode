import React, { useEffect, useRef, useState } from "react";
import { theme, Popover, Modal, Tag, Button, Slider, Tooltip, InputNumber, Layout } from "antd";
import { CaretRightFilled, CaretLeftFilled, SettingOutlined, EditOutlined } from "@ant-design/icons";
import ToolBar, { ToolBarButton } from './ToolBar';

import AddElement from "./AddElemet";


import {
    DragOutlined, ExclamationCircleFilled
} from "@ant-design/icons";
import { BsArrowLeft, BsArrowRight, BsArrowsMove } from "react-icons/bs";


import { ModalTemplate } from "./Template";

import LayoutStyle from '../Element/LayoutStyle';
import LayoutContent from '../Element/LayoutContent';
import Setting from "./Setting";
import { getData, updateData } from "../../../../lib/db";


const { confirm } = Modal;



const SetToolBar = ({ node, children, isDragging, setIsDragging, colorPrimaryBg }) => {


    const [outterBox, setOutterBox] = useState(null);

    const resizeObserver = new ResizeObserver(entries => {
        const rect = node.node.getBoundingClientRect();
        setOutterBox({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });

    });

    useEffect(() => {

        if (!node.node) {
            setOutterBox(null);
            resizeObserver.disconnect();

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
                top: outterBox.top - 6,
                left: outterBox.left - 6,
                width: outterBox.width + 12,
                height: outterBox.height + 12,
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


const Selection = ({ state, onUpdate, onAddElement, onCopyElement, onDeleteElement,

    onUpdateSelector }) => {


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


        confirm({
            title: 'Please select?',
            icon: <ExclamationCircleFilled />,
            okText: 'Copy Selector',
            okType: 'danger',
            cancelText: 'Create Selector',
            onOk() {
                onCopyElement(state.node.node, false);
            },
            onCancel() {
                onCopyElement(state.node.node, true);

            },
        });


    }

    const createMenu = async (menus, childNodes) => {
        const menuPromises = menus.map(async (menu, i) => {
            if (childNodes[i]) {
                menu.childId = childNodes[i];
            } else
                menu.childId = null;


            if (menu.children) {
                const element = await getData(state.page._id, childNodes[i]);

                if (element?.nestedMenuId) {
                    const nested = await getData(state.page._id, element.nestedMenuId);

                    if (nested) {
                        const childNodes = nested.childNodes;
                        nested.menus = await createMenu(menu.children, childNodes);
                        await updateData(state.page._id, nested);

                    }
                }
            }

            return menu;
        });

        return Promise.all(menuPromises);
    };

    const onAddMenus = async (menus) => {


        if (!state.node?.node || state.node?.layout !== 'menu')
            return;

        confirm({
            title: `Cannot Be Undone: Please Confirm`,
            icon: <ExclamationCircleFilled />,
            okText: 'Continue',
            okType: 'danger',
            async onOk() {
                const pos = state.node.node.dataset.pos;

                const element = await getData(state.page._id, state.node._uid)
                const childNodes = element.childNodes;
                element.menus = await createMenu(menus, childNodes)
                await updateData(state.page._id, element);

                await onAddElement({ tag: 'li', addmenu: true }, state.node._uid, false, pos, null);
            },
            onCancel() {
            },
        });

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
                                {/* <Setting node={state.node} onUpdate={onUpdate}>
                                    <EditOutlined />
                                </Setting> */}
                            </span>

                            {/* <Element /> */}

                            <LayoutStyle
                                onUpdate={onUpdateSelector}
                                selector={state.selector}
                                layout={state.node.layout}>
                                <ToolBarButton type="dashed" title="setting">
                                    <SettingOutlined style={{ color: colorPrimary }} />
                                </ToolBarButton>
                            </LayoutStyle>

                            {/* <AddElement onAddElement={onAdd} currentElement={state.node} /> */}
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


export default Selection;