import { Form, Input, Button, Select, Divider, Popconfirm, Checkbox, Cascader, } from "antd";
const { Option } = Select;

import { useEffect, useState } from "react";

import { PlusOutlined, CloseOutlined, EditOutlined, MinusCircleOutlined } from '@ant-design/icons';

import AddCondition from '../Condition/Add';

const initialCondtion = {
    cKey: '', key: null, value: '', type: ''
}

import PageServices from "@/lib/services/pages";

import ElementCondition from "../Condition";

import properties from './properties.json'
import List from "./List";

export default function AddAttribute({ current, attributes, label, setCurrent, onAdd, states }) {


    const [newState, setNewState] = useState(current);
    const [pages, setPages] = useState([]);

    const type = current.type ? '1' : '0';
    const [valueType, setValueType] = useState(type);

    const onChangeValue = (event) => {
        event.preventDefault();

        const value = event.target.value;

        setNewState({ key: newState.key, value: value.trim(), type: '' })
    }

    const onChangeKey = (value) => {

        setNewState({ ...newState, key: value.trim() })
    }

    const load = async () => {

        try {

            const res = await PageServices.search(newState.value);

            const data = Array.isArray(res.layouts) ? res.layouts : [];
            setPages(data);


        } catch (e) {
        } finally {

        }
    }


    useEffect(() => {

        if (!newState.value)
            return;

        load();
    }, [newState.value]);

    const onSubmit =
        async (e) => {
            e.preventDefault();
            await onAdd(newState);

        }




    const onChangeState = (keys) => {


        if (keys === undefined || keys[0] === undefined)
            setNewState({ ...newState, valueState: undefined })
        else {
            const value = [...keys];
            const first = value[0];
            value.shift()



            setNewState({ ...newState, valueState: { key: value, type: first } })
        }
    }



    return (
        <>
            <Divider orientation="left" orientationMargin="0">Set {label}: </Divider>

            <Form layout="vertical"
                initialValues={{}}
               >
                <Form.Item label={label} className="font-500">

                    <Select onChange={onChangeKey}
                        value={newState.key}
                        showSearch
                        style={{ width: '100%' }} placeholder={`Select ${label}`}>
                        <Option value=""></Option>
                        {attributes.map(val =>
                            <Option value={val}>
                                {val}
                            </Option>
                        )}

                    </Select>
                </Form.Item>

                {newState.key === 'style' ?

                    <List
                        label={"Property"}
                        _attributes={properties}
                        cascaderStates={states}
                        state={newState}
                        setState={setNewState}
                        setIsChange={() => { }}

                    />

                    :

                    <Form.Item label="Value" className="font-500">

                        <Cascader
                            options={states}
                            onChange={onChangeState}
                            value={[newState.valueState?.type, ...(Array.isArray(newState.valueState?.key) ? newState.valueState.key : [])]}
                            placeholder="Select State"
                            expandTrigger="hover"
                            style={{ marginBottom: 10, width: '100%' }}
                        />


                        <Input placeholder="Custom Value" name="value"
                            onChange={onChangeValue}
                            value={newState.value}
                        />
                    </Form.Item>}

                <ElementCondition setIsChange={() => { }} cascaderStates={states} state={newState} setState={setNewState} />




                <div style={{ width: '100%', textAlign: 'end', marginTop: 10 }}>
                    <Button type="default" onClick={() => { setCurrent(null) }}>Cancel</Button>
                    &nbsp;
                    <Button type="primary" onClick={onSubmit} disabled={!newState.key}> Add </Button>
                </div>


            </Form>

        </>

    );
};

