import React, { useEffect, useState, useRef } from "react";
import { Spin, Alert, Layout } from "antd";
import { useMemo } from "react";
import { usePageStates } from "./PageProvider";
import Page from './Page';
import IFrame from "../Iframe";
import { ReloadOutlined } from "@ant-design/icons";
import Selection from "./Element/Selection";
const { Content } = Layout;
import { RightPanelComponent, LeftPanelComponent } from "../Panel";
import CanvasEditor from "./Canvas";

import { EditorNavLayout } from "../Layout/NavLayout";
import { generateTreeNodes, getParentNode, getData, updateTreeData, getAllData } from '@/lib/utils/db'



export default function Editor({ rootUid = "0" }) {

    const [windowWidth, setWindowWidth] = useState("100%");

    const [minMax, setMinMax] = useState('');
    const [orientation, setOrientation] = useState("");

    const { state,
        undo,
        redo,
        onClickElement,
        onSubmit,
        onAdd,
        onCopy,
        onDelete,
        onMove,
        onUpdate,
        onDeleteSelector,
        onSelectSelector,
        onUpdateSelector,
        onChangeMedia,
        onEdit } = usePageStates();

        useEffect(() => {
            onChangeMedia(minMax, orientation, windowWidth);
        }, [minMax, orientation, windowWidth])


    return <>

        <EditorNavLayout
            undo={undo}
            redo={redo}
            onSubmit={onSubmit}
            state={state}
            minMax={minMax}
            setMinMax={setMinMax}
            setOrientation={setOrientation}
            orientation={orientation}
            windowWidth={windowWidth}
            setWindowWidth={setWindowWidth} >
            <Layout style={{ marginTop: 0, minHeight: 'calc(100vh - 56px)' }}>
                <LeftPanelComponent />

                <Content>

                    {(!state.page && state.loading) && <Alert style={{ margin: '10px' }} message="Please Select the Page Or Component" />}
                    {state.error && <Alert message={state.error} style={{ margin: '10px' }} type="error" showIcon closable />}


                    <CanvasEditor windowWidth={windowWidth} setWindowWidth={setWindowWidth}>

                        <IFrame
                            onLoad={onEdit} node={state.node}
                            onClickElement={onClickElement}
                            onMove={onMove}
                            onDelete={onDelete}
                            onCopy={onCopy}
                            onAdd={onAdd}
                            state={state}
                            onUpdate={onUpdate}
                        >

                            {state.page &&
                                <Page page={state.page}
                                    pageUpdated={state.pageUpdated}
                                    loading={state.loading} />
                            }

                        </IFrame>


                    </CanvasEditor>
                </Content>

                <RightPanelComponent
                    onDeleteSelector={onDeleteSelector}
                    onUpdateSelector={onUpdateSelector}
                    onSelectSelector={onSelectSelector}
                    onMove={onMove}
                    onDelete={onDelete}
                    onCopy={onCopy}
                    onClickNavigator={onClickElement}
                    state={state}
                    onUpdate={onUpdate}
                />

            </Layout>

        </EditorNavLayout>

        {state.loading && <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0.5
            }}>

        </div>}
        <Spin tip="Loading" size="small" spinning={state.loading}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                
                transform: 'translate(-50%, -50%)'
            }}
        >
        </Spin>

    </>



};

