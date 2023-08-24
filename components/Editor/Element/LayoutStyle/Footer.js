import React, { useEffect, useState } from 'react';
import { Popover, InputNumber, Slider, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

const properties = [
    { key: 'margin', value: '10px' },
    { key: 'padding', value: '10px' },
];

function Footer({ children, style, properties }) {
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
            <div style={{ margin: '10px 0' }}>
                <label>Margin</label> <br />
                <Slider
                    min={0.3}
                    max={50}
                    step={0.1}
                    value={parseFloat(properties['margin']?.value || 16)}
                    onChange={(v) =>
                        handleInputChange('margin',
                            `${v}${properties['margin']?.unit || 'px'}`, properties['margin']?.unit)}
                />
                <InputNumber
                    value={parseFloat(properties['margin']?.value || 10)}
                    onChange={(v) =>
                        handleInputChange('margin', `${v}${properties['margin']?.unit || 'px'}`,
                            properties['margin']?.unit)
                    }
                    addonAfter={
                        <Select
                            value={properties['margin']?.unit}
                            onChange={(unit) =>
                                handleInputChange('margin',

                                    parseFloat(properties['margin']?.value) + unit, unit)
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
        <Popover content={content} title="Footer Style" trigger="click">
            {children}
        </Popover>
    );
}

export default Footer;