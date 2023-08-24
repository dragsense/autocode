
import React, { useEffect, useState } from 'react';
import { Popover, Input, Select, Checkbox, Slider, InputNumber } from 'antd';
import { Typography, Button } from 'antd';
import { AiOutlineLink } from 'react-icons/ai';

const { Text } = Typography;
const { Option } = Select;

const properties = [
  { key: 'color', value: '#1890ff' },
  { key: 'text-decoration', value: 'none' },
];

function Link({ children, style, properties }) {
  const [values, setValues] = useState({});

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
    <div style={{ maxWidth: 200, zIndex: 10 }}>
      <div style={{ margin: '10px 0' }}>
        <label>Color</label>
        <Input
          type="color"
          value={values['color']}
          onChange={(e) => handleInputChange('color', e.target.value)}
        />
     
        <Checkbox
          checked={values['color'] === 'inherit'}
          onChange={(e) =>
            handleInputChange(
              'color',
              e.target.checked ? 'inherit' : 'none'
            )
          }
        >
          Inherit
        </Checkbox>
      </div>
      <div>
        <Checkbox
          checked={values['text-decoration'] === 'underline'}
          onChange={(e) =>
            handleInputChange(
              'text-decoration',
              e.target.checked ? 'underline' : 'none'
            )
          }
        >
          Underline
        </Checkbox>
      </div>
    </div>
  );

  return (
    <>
      <Popover content={content} title="Link" trigger="click">
        <a href="#" style={{ color: values['color'], textDecoration: values['text-decoration'] }}>
          {children}
        </a>
      </Popover>
    </>
  );
}

export default Link;