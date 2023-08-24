import React, { useEffect, useState } from 'react';
import { PlusOutlined, DragOutlined, SettingOutlined } from '@ant-design/icons';
import { Popover, Input, Select, Checkbox, Slider, InputNumber } from 'antd';

const { Option } = Select;


const properties = [
    { key: 'max-width', value: 0 },
    { key: 'position', value: 'static' },
    { key: 'margin-left', value: 0 },
    { key: 'margin-right', value: 0 },
    { key: 'padding-left', value: 0 },
    { key: 'padding-right', value: 0 }]

function Container({ children, style, properties }) {

     const [values, setValues] = useState({})


    useEffect(() => {

        if (!properties)
            return

     

    }, [properties]);

  

    const handleInputChange = (key, value) => {


        setValues({ ...values, [key]: value });

        style.setProperty(key, value);
if (!properties[key]) 
      properties[key] = {};

        properties[key].value = value;

        if (key !== 'postion')
            properties[key].unit = 'px';
    };


    const content = (
        <div style={{ maxWidth: 200, zIndex: 10 }}>
            <InputNumber value={parseFloat(values['max-width'])} onChange={(v) => handleInputChange('max-width', v + 'px')} addonBefore="Max Width (PX)" />
            <div style={{ margin: '10px 0' }}>
                <label>Position</label>
                <Select value={values['position']} onChange={(v) => handleInputChange('position', v)} style={{ width: '100%' }}>
                    <Option value="static">Static</Option>
                    <Option value="relative">Relative</Option>
                    <Option value="absolute">Absolute</Option>
                    <Option value="fixed">Fixed</Option>
                </Select>
            </div>
            <div>
                <Checkbox checked={values['margin-left'] == 'auto'} onChange={(v) => {

                    let val = 'auto';
                    if (values['margin-left'] == 'auto')
                        val = null;



                    handleInputChange('margin-left', val)
                }
                }
                >
                    Margin Left Auto
                </Checkbox>

            </div>
            <div>
                <Checkbox checked={values['margin-right'] == 'auto'} onChange={(v) => {

                    let val = 'auto';
                    if (values['margin-right'] == 'auto')
                        val = null;

                    handleInputChange('margin-right', val)
                }} >
                    Margin Right Auto
                </Checkbox>

            </div>
            <div>
                <div style={{ margin: '10px 0' }}>
                    <label>Padding Left</label>
                    <Slider min={10} max={30} value={parseFloat(values['padding-left'])} onChange={(v) => handleInputChange('padding-left', v + 'px')} />

                </div>
                <div style={{ margin: '10px 0' }}>
                    <label>Padding Right</label>
                    <Slider min={10} max={30} value={parseFloat(values['padding-right'])} onChange={(v) => handleInputChange('padding-right', v + 'px')} />

                </div>
            </div>
        </div>
    );

    return <>
        <Popover content={content} title="Container" trigger="click">
            {children}
        </Popover>

    </>

}

export default Container;