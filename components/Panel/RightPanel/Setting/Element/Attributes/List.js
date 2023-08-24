import { useState } from "react";
import { Button, Form, Input, Select, Cascader, Popconfirm, List, Typography, Popover } from "antd";
import { PlusOutlined, MinusCircleOutlined, EditOutlined } from '@ant-design/icons';

const initialAttribute = { key: '', value: '', type: '', conditions: {} };
const initialCondition = { key: '', match: '', value: '' };
import AddAttribute from "./Add";


export default function ElementAttribute({ cascaderStates, label, _attributes, state, setState, setIsChange }) {
  const [currentAttribute, setCurrentAttribute] = useState(null);

  const attributes = state.attributes || {};

  const onAdd = (attribute) => {
    setState((prevState) => ({
      ...prevState,
      attributes: { ...prevState.attributes, [attribute.key]: attribute },
    }));
    setCurrentAttribute(null);
    setIsChange(true);

  };

  const onRemove = (key) => {
    const updatedAttributes = { ...state.attributes };
    delete updatedAttributes[key];
    setState((prevState) => ({
      ...prevState,
      attributes: updatedAttributes,
    }));
    setIsChange(true);

  };

  const onEdit = (key) => {
    setCurrentAttribute(attributes[key]);
    setIsChange(true);

  };

  return currentAttribute ? (
    <AddAttribute
      current={currentAttribute}
      onAdd={onAdd}
      label={label}
      attributes={_attributes}
      states={cascaderStates}
      setIsChange={setIsChange}
      setCurrent={setCurrentAttribute}
    />
  ) : (
    <>
      <List
        dataSource={Object.entries(attributes)}
        renderItem={([key, attr], idx) => (
          <List.Item key={key}>
            <Typography.Text strong>{key} = </Typography.Text>
            <Typography.Text>{attr.type ? `[${attr.value.toString()}]` : attr.value}</Typography.Text>
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(key)} />
            <Popconfirm
              title="Delete"
              description={`Are you sure to delete this ${label?.toLowerCase()}?`}
              onConfirm={() => onRemove(key)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" icon={<MinusCircleOutlined />} />
            </Popconfirm>
          </List.Item>
        )}
      />

      <Button type="dashed" onClick={() => setCurrentAttribute(initialAttribute)} block icon={<PlusOutlined />}>
        Add {label}
      </Button>
    </>
  );
}

