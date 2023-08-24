import React, { Children, useEffect, useState } from 'react';

import { Collapse, Layout, Space, Tooltip, Button, theme, Modal } from 'antd';

import { } from 'react-icons/md'
import { ExclamationCircleFilled, ClearOutlined, DeleteOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { Panel } = Collapse;

const { confirm } = Modal;

import SearchableSelector from '../Selector';
import SearchableMediaQuery from '../MediaQuery';
import { State } from '../State';
import { Pseudo } from '../Pseudo';

import Typography from '../Typography';
import Size from '../Size';
import Spacing from '../Spacing';
import Border from '../Border';
import Background from '../Background';
import Position from '../Position';
import Display from '../Display';
import Shadow from '../Shadow';
import Transition from '../Transition';
import Animation from '../Animation';
import Transform from '../Transform';
import Filter from '../Filter';
import Svg from '../Svg';
import List from '../List';

import { RiDeleteBin2Line, RiRestartLine } from 'react-icons/ri';



export default function RigthSideBar({
    children,
    selector,
    selectorKey,
    onChange,
    onSelect,
    onDelete,
    onSubmit,
    animation = false,
    width = 250,
    mode = "dark",
    menuKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'] }) {

    const {
        token: { colorError, colorWarning, colorBorder },
    } = theme.useToken();



    const [keys, setKeys] = useState(menuKeys);
    const [state, setState] = useState('');



    const handleMenuOpenChange = (key) => {


        setKeys(key.length > 0 ? key : menuKeys);
    };

    const onSelectState = (state, value) => {

        if (!selector)
            return;

        const newSelectorText = selector.selectorText.replace(new RegExp(value, 'g'), "");
        console.log(newSelectorText, state)

        onSelect({ selectorText: newSelectorText, properties: {} }, state);

        setState(newSelectorText + state);

    }

    useEffect(() => {
        if (selector?.selectorText == state)
            return;
        setState('');
    }, [selector])


    return <>



        <Sider width={width} theme={mode} style={{ border: `1px solid ${colorBorder}`, borderRadius: 10 }}>

            <div style={{ padding: 5 }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>

                        <SearchableSelector

                            selectorKey={selectorKey}
                            selector={selector}
                            animation={animation}
                            onSelect={onSelect} />
                    </div>


                    <Tooltip placement="left" title="Delete Selector">
                        <Button
                            size='small'
                            ghost
                            icon={<RiDeleteBin2Line style={{ color: colorError }} />}
                            onClick={(e) => {
                                e.preventDefault();

                                confirm({
                                    title: 'Are you sure to delete this selector?',
                                    content: "This action can't be undo.",

                                    icon: <ExclamationCircleFilled />,
                                    okText: 'Yes',
                                    okType: 'danger',
                                    cancelText: 'No',
                                    onOk() {
                                        onDelete({ ...selector, key: selectorKey });
                                    },
                                    onCancel() {

                                    },
                                });
                            }}
                        > </Button>
                    </Tooltip>




                </div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'end', justifyContent: 'space-between' }}>
                    <div>{!animation && <><State state={state} onSelectState={onSelectState} />
                        <Pseudo state={state} onSelectState={onSelectState} /></>}</div>

                    <Tooltip placement="left" title="Reset Current Style">
                        <Button
                            ghost
                            size='small'
                            icon={<RiRestartLine style={{ color: colorWarning }} />}
                            onClick={(e) => {
                                e.preventDefault();

                                confirm({
                                    title: 'Are you sure to reset the class style?',
                                    content: "This action can't be undo.",
                                    icon: <ExclamationCircleFilled />,
                                    okText: 'Yes',
                                    okType: 'danger',
                                    cancelText: 'No',
                                    onOk() {
                                        onSubmit({ ...selector, properties: {} });
                                    },
                                    onCancel() {

                                    },
                                });

                            }}

                        > </Button>
                    </Tooltip>
                </div>
            </div>


            <Collapse
                style={{
                    maxHeight: '100%',
                    overflow: 'auto',
                }}
                onChange={handleMenuOpenChange}
                theme="light"

                accordion
            >

                {keys.includes('1') && <Panel showArrow={false}
                    header="Typeography"
                    key="1">
                    <Typography style={selector?.style}  properties={selector?.properties} onChangeStyle={onChange} />
                </Panel>}
                {keys.includes('2') && <Panel showArrow={false}
                    header="Size"
                    key="2">
                    <Size style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                </Panel>}
                {keys.includes('3') && <Panel showArrow={false}
                    header="Space"
                    key="3">
                    <Spacing style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                </Panel>}
                {keys.includes('4') && <Panel showArrow={false}
                    header="Border"
                    key="4">
                    <Border style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                </Panel>}
                {keys.includes('5') && <Panel showArrow={false}
                    header="Background"
                    key="5">
                    <Background style={selector?.style} 
                    properties={selector?.properties}
                     onChangeStyle={onChange} />
                </Panel>}
                {keys.includes('6') && <Panel showArrow={false}
                    header="Position"
                    key="6">
                    <Position style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                </Panel>}
                {keys.includes('7') && <Panel showArrow={false}
                    header="Display"
                    key="7">
                    <Display style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                </Panel>}

                {keys.includes('8') && <Panel showArrow={false}
                    header="Shadow"
                    key="8">
                    <Shadow style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                </Panel>}

                {keys.includes('9') && <Panel showArrow={false}
                    header="Transform"
                    key="9">
                    <Transform style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                </Panel>}

                {keys.includes('10') && <Panel showArrow={false}
                    header="Transition"
                    key="10">
                    <Transition style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                </Panel>}

                {(keys.includes('11') && !animation) && <Panel showArrow={false}
                    header="Animation"
                    key="11">
                    <Animation style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                </Panel>}

                {(keys.includes('12')) && <Panel showArrow={false}
                    header="Filter"
                    key="12">
                    <Filter style={selector?.style} properties={selector?.properties} onChangeStyle={onChange} />
                </Panel>}
                {(keys.includes('13')) && <Panel showArrow={false}
                    header="Svg"
                    key="13">
                    <Svg style={selector?.style} onChangeStyle={onChange}  properties={selector?.properties}  />
                </Panel>}
                {(keys.includes('14')) && <Panel showArrow={false}
                    header="List"
                    key="14">
                    <List style={selector?.style} onChangeStyle={onChange}  properties={selector?.properties}  />
                </Panel>}

            </Collapse>

            {children}

        </Sider>
    </>

}

