import React, { useEffect, useState } from 'react';
import { Popover, InputNumber, Slider, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const properties = [
    { key: 'height', value: '100px' },
    { key: 'background-color', value: 'lightblue' },
    { key: 'padding', value: '10px' },
    // Add more properties as needed
];

function Header({ children, style, properties }) {
     const [values, setValues] = useState({})

    useEffect(() => {
       

        if (!properties) return;

        
    }, [properties]);

    const handleInputChange = (key, value) => {
        setValues({ ...values, [key]: value });
        style.setProperty(key, value);
if (!properties[key]) 
      properties[key] = {};
        properties[key].value = value;
    };


    const content = (
        <div style={{ maxWidth: 230, zIndex: 10 }}>
            <div style={{ margin: '10px 0' }}>
                <label>Background Color</label> <br />
                <input
                    type="color"
                    value={properties['background-color']?.value}
                    onChange={(e) => handleInputChange('background-color', e.target.value)}
                />
            </div>
            <div style={{ margin: '10px 0' }}>
                <label>Height</label> <br />
                <Slider
                    min={0.3}
                    max={100}
                    step={0.1}
                    value={parseFloat(properties['height']?.value || 16)}
                    onChange={(v) =>
                        handleInputChange('height',
                            `${v}${properties['height']?.unit || 'px'}`, properties['height']?.unit)}
                />
                <InputNumber
                    value={parseFloat(properties['height']?.value || 16)}
                    onChange={(v) =>
                        handleInputChange('height', `${v}${properties['height']?.unit || 'px'}`,
                            properties['height']?.unit)
                    }
                    addonAfter={
                        <Select
                            value={properties['height']?.unit}
                            onChange={(unit) =>
                                handleInputChange('height',

                                    parseFloat(properties['height']?.value) + unit, unit)
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
                <label>Padding</label> <br />
                <Slider
                    min={0.3}
                    max={50}
                    step={0.1}
                    value={parseFloat(properties['padding']?.value || 16)}
                    onChange={(v) =>
                        handleInputChange('padding',
                            `${v}${properties['padding']?.unit || 'px'}`, properties['padding']?.unit)}
                />
                <InputNumber
                    value={parseFloat(properties['padding']?.value || 10)}
                    onChange={(v) =>
                        handleInputChange('padding', `${v}${properties['padding']?.unit || 'px'}`,
                            properties['padding']?.unit)
                    }
                    addonAfter={
                        <Select
                            value={properties['padding']?.unit}
                            onChange={(unit) =>
                                handleInputChange('padding',

                                    parseFloat(properties['padding']?.value) + unit, unit)
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
        </div>
    );

    return (
        <Popover content={content} title="Nav Style" trigger="click">
            {children}
        </Popover>
    );
}

export default Header;