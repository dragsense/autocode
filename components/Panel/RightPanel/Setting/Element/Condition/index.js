import { useState } from "react";
import { Button, Popconfirm, List, Typography } from "antd";
import {
    ExclamationCircleFilled,
    PlusOutlined,
    MinusCircleOutlined,
    EditOutlined
} from "@ant-design/icons";
import AddCondition from "./Add";

const initialCondition = { key: '', match: '', value: '', relation: 'AND', valueState: undefined };

export default function ElementCondition({ cascaderStates, state, setState, setIsChange }) {

    const [currentCondition, setCurrentCondition] = useState(null);

    const conditions = state.conditions || {};

    const onAdd = (newCondition) => {

        const key =  "cond-" + Object.keys(state.conditions || {}).length; 
        setState((prevState) => ({
            ...prevState,
            conditions: { ...prevState.conditions, [key]: newCondition },
        }));
        setCurrentCondition(null);
        setIsChange(true);

    };

    const onRemove = (key) => {
        const updatedConditions = { ...state.conditions };
        delete updatedConditions[key];
        setState((prevState) => ({
            ...prevState,
            conditions: updatedConditions,
        }));
        setIsChange(true);

    };

    const onEdit = (key) => {
        setCurrentCondition(conditions[key]);
        setIsChange(true);

    };



    return currentCondition ? (
        <AddCondition
            states={cascaderStates}
            current={currentCondition}
            onAdd={onAdd}
            setCurrent={setCurrentCondition}
        />
    ) : (
        <>
            <List
                dataSource={Object.entries(conditions)}
                renderItem={([key, condition], idx) => (
                    <List.Item key={key}>
                     
                        <Typography.Text>{condition.key.join("->")} <em>{condition.match}</em> {condition.value}</Typography.Text>
                        <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(key)} />
                        <Popconfirm
                            title="Delete"
                            description="Are you sure to delete this condition?"
                            onConfirm={() => onRemove(key)}
                            onCancel={() => { }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="text" icon={<MinusCircleOutlined />} />
                        </Popconfirm>
                    </List.Item>
                )}
            />

            <Button type="dashed" onClick={() => setCurrentCondition(initialCondition)} block icon={<PlusOutlined />}>
                Add Condition
            </Button>
        </>
    );
}