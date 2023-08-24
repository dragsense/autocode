
import { Collapse, Space, Select, Button } from 'antd';
const { Panel } = Collapse;
import { useEffect, useState } from 'react';


import { useCssNodeStates } from '../..';
import _Display from './_Display';
import Flex, { FlexChild } from './Flex';
import Grid, { GridChild } from './Grid';
import { isEmpty } from '@/lib/utils';

export default function Display({ style, properties, onChangeStyle }) {



    const [stylePriority, setStylePriority] = useState({
        display: '',
        opacity: '',
        visibility: '',
        rowGap: '',
        columnGap: '',
        flexDirection: '',
        flexWrap: '',
        justifyContent: '',
        alignItems: '',
        alignContent: '',
        justifyItems: '',
        alignSelf: '',
        flexGrow: '',
        flexShrink: '',
        flexBasis: '',
        order: '',
        justifySelf: '',
        gridRowStart: '',
        gridRowEnd: '',
        gridColumnStart: '',
        gridColumnEnd: ''
    });


    useEffect(() => {

        if (!properties) {
            return;
        }

        const priorities = {};

        for (const key in stylePriority) {
            const hyphenatedKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            if (properties[hyphenatedKey])
                priorities[key] = properties[hyphenatedKey].priority;
            else
                priorities[key] = '';

        }

        setStylePriority(priorities);


    }, [properties])


    const [avtiveTab, setActiveTab] = useState('0');

    useEffect(() => {

        if (!properties?.display?.value)
            return;

        const display = properties['display']?.value;

        if (display == 'flex' || display == 'inline flex' || display == 'inline-flex')
            setActiveTab("1");
        else
            if (display == 'grid' || display == 'inline grid' || display == 'inline-grid')
                setActiveTab("2");
            else
                setActiveTab("0");

    }, [properties?.display?.value]);


    return style ? <Collapse defaultActiveKey={['1']} accordion ghost>
        <Panel header="Display" key="1">
            <_Display type="display"  properties={properties} onChangeStyle={onChangeStyle} style={style} stylePriority={stylePriority} setStylePriority={setStylePriority}
            />
        </Panel>
        <Panel header="Flex" key="2">
            {avtiveTab === '1' && <Flex style={style}  properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority} setStylePriority={setStylePriority} />
            }
        </Panel>
        <Panel header="Flex Child" key="3">
            {avtiveTab === '0' && <FlexChild style={style} properties={properties} onChangeStyle={onChangeStyle}  stylePriority={stylePriority} setStylePriority={setStylePriority} />
            }
        </Panel>
        <Panel header="Grid" key="4">
            {avtiveTab === '2' && <Grid style={style}  properties={properties} onChangeStyle={onChangeStyle} stylePriority={stylePriority} setStylePriority={setStylePriority} />

            }
        </Panel>
        <Panel header="Grid CHild" key="5">
            {avtiveTab === '0' && <GridChild style={style} properties={properties} onChangeStyle={onChangeStyle}  stylePriority={stylePriority} setStylePriority={setStylePriority} />
            }
        </Panel>

    </Collapse>
        : <></>


}


