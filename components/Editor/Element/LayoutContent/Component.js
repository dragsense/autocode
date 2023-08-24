import React, { useState } from 'react';
import { Slider, Form, Input, InputNumber, Checkbox, Button, Popover, Select } from 'antd';

const { Option } = Select;

const Component = ({ children, node, onSave, name, skippedProperties }) => {

  const [propertyValues, setPropertyValues] = useState(node.states);

  const handlePropertyChange = (property, value) => {
    setPropertyValues((prevValues) => ({
      ...prevValues,
      [property]: {
        ...prevValues[property],
        defaultValue: value,
      },
    }));
  };

  const handleSave = () => {
    node.states = propertyValues;
    onSave();
  };


  const content = (
    <div style={{maxHeight: 400, overflow: 'auto'}}>
    <Form layout="vertical">
      {Object.values(propertyValues)
        .filter((property) => !skippedProperties.includes(property.key))
        .map((property) => (
          <Form.Item key={property.key} label={property.key}>
            {property.type === 'number' ? (
              <InputNumber
                value={property.defaultValue}
                onChange={(value) => handlePropertyChange(property.key, value)}
                min={property.min !== undefined ? property.min : 0}
                max={property.max !== undefined ? property.max : Infinity}
              />
            ) : property.type === 'dropdown' ? (
              <Select
                defaultValue={property.defaultValue}
                onChange={(value) => handlePropertyChange(property.key, value)}
              >
                {property.values.map(val =>
                  <Option value={val}>{val}</Option>)}
              </Select>
            ) : property.type === 'boolean' ? (
              <Checkbox
                defaultChecked={property.defaultValue}
                onChange={(e) => handlePropertyChange(property.key, e.target.checked)}
              />
            ) : property.type === 'slider' ? (
              <Slider
                defaultValue={parseFloat(property.defaultValue)}
                step={property.step || 0.1}
                min={property.min !== undefined ? property.min : 0}
                max={property.max !== undefined ? property.max : 100}
                onChange={(value) => handlePropertyChange(property.key, value)}
              />
            ) : <Input
              value={property.defaultValue}

              onChange={(e) => handlePropertyChange(property.key, e.target.value)}
            />}
          </Form.Item>
        ))}
      <Button type="primary" size="small" onClick={handleSave}>
        Save
      </Button>
    </Form>
    </div>
  );

  return (
    <Popover content={content} title={`${name} Settings`} trigger="click">
      {children}
    </Popover>
  );
};

export default Component;