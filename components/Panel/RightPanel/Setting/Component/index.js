
import { Divider, Card } from 'antd';
import { useState, useEffect } from 'react';
import ElementComponent from './ElementComponent';

const COMPONENTS = ['none', 'slider', 'tabs', 'gallery', 'accordion', 'modal', 'menu', 'dropdown']

import { getAllData } from "@/lib/utils/db";

export default function Component({ state, cascaderStates }) {


    const [componentState, setState] = useState(null);

    const fetchComponent = async () => {


        if (state.node.type === 'component') {
            if (!state.node.states)
                return;
            setState({ states: state.node.states });

        } else {

            const _id = state.page._id;
            const node = await getAllData(_id);

            if (!node)
                return;

            setState({ ...node });
        }
    }


    useEffect(() => {

        if (!state.page)
            return;

        fetchComponent();

    }, [state.page, state.node]);



    return componentState ? <>
        <Divider orientation="center" orientationMargin="0">Tag: {state.node.tagName} </Divider>

        <div style={{ maxHeight: '62vh', overflow: 'auto' }}>
            <Card>

                <ElementComponent
                    state={componentState}
                />

            </Card>
        </div>
    </>
        : <span>Please Select the node</span>
}