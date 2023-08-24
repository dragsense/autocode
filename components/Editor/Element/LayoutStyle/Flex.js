import React, { useEffect, useState } from 'react';
import { Popover, InputNumber, Slider, Select } from 'antd';

const { Option } = Select;

const properties = [
  { key: 'padding', value: '10px' },
  { key: 'margin', value: '10px' },
  { key: 'flex-direction', value: 'row' },
  { key: 'justify-content', value: 'flex-start' },
  { key: 'gap', value: '10px' },

  { key: 'align-items', value: 'stretch' },
  { key: 'flex-wrap', value: 'nowrap' },
];

function Flex({ children, style, properties }) {
  const [values, setValues] = useState({});

  useEffect(() => {
   

    if (!properties) return;

   
  }, [properties]);

  const handleInputChange = (key, value, unit) => {
    setValues({ ...values, [key]: value });
    style.setProperty(key, value);
if (!properties[key]) 
      properties[key] = {};
    if (!properties[key]) {
      properties[key] = {};
    }
    properties[key].value = value;
    properties[key].unit = unit;

  };

  const content = (
    <div style={{ maxWidth: 230, zIndex: 10 }}>
     
      <div style={{ margin: '10px 0' }}>
        <label>Padding</label> <br />
        <Slider
          min={0.3}
          max={50}
          step={0.1}
          value={parseFloat(properties['padding']?.value || 16)}
          onChange={(v) =>
            handleInputChange(
              'padding',
              `${v}${properties['padding']?.unit || 'px'}`,
              properties['padding']?.unit
            )
          }
        />
        <InputNumber
          value={parseFloat(properties['padding']?.value || 10)}
          onChange={(v) =>
            handleInputChange(
              'padding',
              `${v}${properties['padding']?.unit || 'px'}`,
              properties['padding']?.unit
            )
          }
          addonAfter={
            <Select
              value={properties['padding']?.unit}
              onChange={(unit) =>
                handleInputChange(
                  'padding',
                  parseFloat(properties['padding']?.value) + unit,
                  unit
                )
              }
              style={{ width: 70 }}
            >
              <Option value="px">px</Option>
              <Option value="em">em</Option>
              <Option value="rem">rem</Option>
            </Select>
          }
        />
      </div>
      <div style={{ margin: '10px 0' }}>
        <label>Margin</label> <br />
        <Slider
          min={0.3}
          max={50}
          step={0.1}
          value={parseFloat(properties['margin']?.value || 0)}
          onChange={(v) =>
            handleInputChange(
              'margin',
              `${v}${properties['margin']?.unit || 'px'}`,
              properties['margin']?.unit
            )
          }
        />
        <InputNumber
          value={parseFloat(properties['margin']?.value || 10)}
          onChange={(v) =>
            handleInputChange(
              'margin',
              `${v}${properties['margin']?.unit || 'px'}`,
              properties['margin']?.unit
            )
          }
          addonAfter={
            <Select
              value={properties['margin']?.unit}
              onChange={(unit) =>
                handleInputChange(
                  'margin',
                  parseFloat(properties['margin']?.value) + unit,
                  unit
                )
              }
              style={{ width: 70 }}
            >
              <Option value="px">px</Option>
              <Option value="em">em</Option>
              <Option value="rem">rem</Option>
            </Select>
          }
        />
      </div>
      {/* Flex Properties */}
      <div style={{ margin: '10px 0' }}>
        <label>Flex Direction</label> <br />
        <Select
          value={properties['flex-direction']?.value}
          onChange={(value) => handleInputChange('flex-direction', value)}
          style={{ width: '100%' }}

        >
          <Option value="row">Row</Option>
          <Option value="column">Column</Option>
          <Option value="row-reverse">Row Reverse</Option>
          <Option value="column-reverse">Column Reverse</Option>
        </Select>
      </div>
      <div style={{ margin: '10px 0' }}>
                <label>Items Gap</label> <br />
                <Slider
                    min={0.3}
                    max={400}
                    step={0.1}
                    value={parseFloat(properties['gap']?.value)}
                    onChange={(v) => {
                        const u = properties['gap']?.unit || 'px';
                        handleInputChange('gap', `${v}${u}`, u)
                    }
                    }
                />
                <InputNumber
                    value={parseFloat(properties['gap']?.value)}
                    onChange={(v) => {
                        const u = properties['gap']?.unit || 'px';
                        handleInputChange('gap', `${v}${u}`, u)
                    }
                    }
                    addonAfter={
                        <Select
                            value={properties['gap']?.unit}
                            onChange={(unit) => {
                                const v = parseFloat(properties['gap']?.value);
                                handleInputChange('gap', `${v}${unit}`, unit)
                            }
                            }
                            style={{ width: 70 }}
                        >
                            <Option value="px">px</Option>
                            <Option value="em">em</Option>
                            <Option value="rem">rem</Option>
                        </Select>} />
            </div>
      <div style={{ margin: '10px 0' }}>
        <label>Justify Content</label> <br />
        <Select
          value={properties['justify-content']?.value}
          onChange={(value) => handleInputChange('justify-content', value)}
          style={{ width: '100%' }}

        >
          <Option value="flex-start">Flex Start</Option>
          <Option value="flex-end">Flex End</Option>
          <Option value="center">Center</Option>
          <Option value="space-between">Space Between</Option>
          <Option value="space-around">Space Around</Option>
          <Option value="space-evenly">Space Evenly</Option>
        </Select>
      </div>
       
      <div style={{ margin: '10px 0' }}>
        <label>Align Items</label> <br />
        <Select
          value={properties['align-items']?.value}
          onChange={(value) => handleInputChange('align-items', value)}
          style={{ width: '100%' }}

        >
          <Option value="stretch">Stretch</Option>
          <Option value="flex-start">Flex Start</Option>
          <Option value="flex-end">Flex End</Option>
          <Option value="center">Center</Option>
          <Option value="baseline">Baseline</Option>
        </Select>
      </div>
  
    </div>
  );

  return (
    <Popover content={content} title="Flex Style" trigger="click">
      {children}
    </Popover>
  );
}

export default Flex;