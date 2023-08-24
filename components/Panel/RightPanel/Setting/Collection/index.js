
import { Button, Divider, Card } from 'antd';
import { useState, useEffect, Children } from 'react';
import ElementCollection from './ElementCollection';

import { generateCascader, generateCascaderCollStates } from '@/lib/utils/elementNode';
import { getAllData, storePage } from "@/lib/utils/db";


export default function Collection({ state, onUpdate, cascaderStates }) {

    const [collectionState, setState] = useState(null);
    const [isChange, setIsChange] = useState(false);

    const fetchCollection = async () => {
        const _id = state.page._id;
        const node = await getAllData(_id);

        if (!node) {
            setState({});
        }
        if (node.collection) {
            const collection = await getAllData(node.collection._id);
            if (collection) {
                setState({
                    ...node.collection,
                    relationships: collection.relationships,
                    states: undefined
                });
            }
        }

    }


    useEffect(() => {
        fetchCollection();
    }, []);


    const onElementUpdate = async () => {

        if (!collectionState)
            return;

        const _id = state.page._id;
        const element = await getAllData(_id);

        if (element) {
            element["collection"] = { ...collectionState };
            await storePage(element);
        }

        setIsChange(false);
    }

    return state.node ? <>
        <Divider orientation="center" orientationMargin="0">Tag: {state.node.tagName} </Divider>

        <div style={{ maxHeight: '62vh', overflow: 'auto' }}>
            <Card>
                {collectionState ? <ElementCollection
                    cascaderStates={cascaderStates}
                    setIsChange={setIsChange}
                    state={collectionState}
                    setState={setState} /> :
                    <span>Collection not attached.</span>}

            </Card>
        </div>
        <Divider orientation="center" orientationMargin="0"></Divider>

        <div style={{ textAlign: 'right' }}>
            <Button disabled={!isChange} onClick={onElementUpdate} type='primary'>Update</Button>
        </div>
    </>
        : <span>Please Select the node</span>
}