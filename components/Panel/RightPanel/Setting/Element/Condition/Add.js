import { Form, Radio, Divider, Input, Button, Cascader, Select, } from "antd";
import { useState, useCallback, useEffect } from "react";

export default function AddCondition({ current, setCurrent, onAdd, states }) {


    const [newState, setNewState] = useState(current);


    const onChangeValue = (event) => {
        event.preventDefault();
        const value = event.target.value;
        setNewState({ ...newState, value: value.trim() })
    }

    const onChangekey = (keys) => {


        if (keys === undefined || keys[0] === undefined)
            setNewState({ ...newState, value: [], type: undefined })
        else {
            const value = [...keys];

            const first = value[0];
            value.shift();
            setNewState({ ...newState, key: value, type: first })
        }
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


    const onChangeMatch = (value) => {
        setNewState({ ...newState, match: value })
    }


    const onChangeRelation = (e) => {
        setNewState({ ...newState, relation: e.target.value });
    };

    const onSubmit =
        async (e) => {
            e.preventDefault();

            await onAdd(newState);

        }


    return (
        <>
            <Divider orientation="left" orientationMargin="0">Set Condition: </Divider>

            <Form layout="vertical"
                initialValues={{}}
            >
                <Form.Item label="States" className="font-500">

                    <Cascader options={states}
                        value={[newState.type, ...(Array.isArray(newState.key) ? newState.key : [])]}
                        onChange={onChangekey} style={{ width: '100%' }}>
                    </Cascader>
                </Form.Item>
            
                <Form.Item label="Match" className="font-500">

                <Input placeholder="Expression" name="match"
                        onChange={(e) => onChangeMatch(e.target.value)}
                        value={newState.match}
                    />
                    </Form.Item>

                <Form.Item label="Relation" className="font-500">
                    <Radio.Group value={newState.relation} onChange={onChangeRelation}>
                        <Radio value="AND">AND</Radio>
                        <Radio value="OR">OR</Radio>
                    </Radio.Group>
                </Form.Item>

                <Cascader
                    options={states}
                    onChange={onChangeState}
                    value={[newState.valueState?.type, ...(Array.isArray(newState.valueState?.key) ? newState.valueState.key : [])]}
                    placeholder="Select State"
                    expandTrigger="click"
                    style={{ marginBottom: 10, width: '100%' }}
                />


                <Input placeholder="Value" name="value"
                    onChange={onChangeValue}
                    value={newState.value}
                    required />





                <div style={{ width: '100%', textAlign: 'end', marginTop: 5 }}>
                    <Button type="default" onClick={() => { setCurrent(null) }}>Cancel</Button>
                    &nbsp;
                    <Button type="primary" onClick={onSubmit} disabled={(!newState.key || !newState.value)}> Add </Button>
                </div>
            </Form>
        </>

    );
};

