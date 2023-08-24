// import { Input, Space, Select, Checkbox, Tooltip, Button } from 'antd';
// import { element } from 'prop-types';
// import { useEffect, useState } from 'react';
// import { RgbaColorPicker } from "react-colorful";

// import {MdRestartAlt } from 'react-icons/md'
// import { transform } from 'typescript';


// const units = ['px', '%', 'em', 'rem'];
// const positions = ['static', 'fixed', 'sticky', 'relative', 'absolute'];

// export default function _Position({ type, style, uStyle, setUStyle, stylePriority, setStylePriority }) {

//     const [isLoading, onChangeStyle] = useState(false);

//     const [topUnit, setTopUnit] = useState(units[0]);
//     const [leftUnit, setLeftUnit] = useState(units[0]);
//     const [bottomUnit, setBottomUnit] = useState(units[0]);
//     const [rightUnit, setRightUnit] = useState(units[0]);

//     useEffect(() => {

//         if(!style)
//         return;

//         console.log(style);

//         if (style.top)
//             setTopUnit(style.top.replace(/\d/g, ""))

//         if (style.left)
//             setLeftUnit(style.left.replace(/\d/g, ""))

//         if (style.bottom)
//             setBottomUnit(style.bottom.replace(/\d/g, ""))

//         if (style.right)
//             setRightUnit(style.right.replace(/\d/g, ""))

//     }, [style]);


//     const onChangePosition = (value) => {
//         setUStyle(style, 'position', style.position, stylePriority.position);
//         style.setProperty('position', value, stylePriority.position);
//        onChangeStyle(); setStylePriority({ ...stylePriority });
//     }


//     const onChange = (e) => {

//         e.preventDefault();

//         let value = e.target.value;
//         let name = e.target.name;


//         if (name === 'top')
//             value = value + topUnit;
//         else
//             if (name === 'right')
//                 value = value + rightUnit;
//             else
//                 if (name === 'bottom')
//                     value = value + bottomUnit;
//                 else
//                     if (name === 'left')
//                         value = value + leftUnit;


//     setUStyle(style, name, style[name], stylePriority[name]);
//         style.setProperty([name], value, stylePriority[name]);
//        onChangeStyle(); setStylePriority({ ...stylePriority });
//     }


//     const onChangeTopUnit = (value) => {
//         setTopUnit(value);
//         const val = `${parseFloat(style.top ?? 0) + value}`;

//         style.setProperty('top', val, stylePriority.top);
//     }

//     const onChangeRightUnit = (value) => {
//         setRightUnit(value);
//         const val = `${parseFloat(style.right ?? 0) + value}`;

//         style.setProperty('right', val, stylePriority.right);
//     }


//     const onChangeBottomUnit = (value) => {
//         setBottomUnit(value);
//         const val = `${parseFloat(style.bottom ?? 0) + value}`;
//         style.setProperty('bottom', val, stylePriority.bottom);
//     }

//     const onChangeLeftUnit = (value) => {
//         setLeftUnit(value);
//         const val = `${parseFloat(style.left ?? 0) + value}`;

//         style.setProperty('left', val, stylePriority.left);
//     }

//     const onChangePriority = (e) => {

//         const name = e.target.name;
//         const priority = e.target.checked ? 'important' : '';
//         setUStyle(style, name, style[name], stylePriority[name]);
//         setStylePriority({ ...stylePriority, [name]: priority })
//         style.setProperty(name, style[name], priority);

//     }


//     return <>


//         <Space size={10} direction='vertical'>
//             <label className='styling-label' style={{ textTransform: 'capitalize' }}>{type}: <Tooltip placement="top" title="Reset">
//                         <Button
//                          style={{float: 'right'}}
//                             ghost
//                             size='small'
//                             icon={<MdRestartAlt size="small" />}
//                             onClick={(e) => {
//                                 e.preventDefault();
//                                onChangeStyle(); setStylePriority({ ...stylePriority });
//                                 style.removeProperty(type);
//                                 style.removeProperty('left');
//                                 style.removeProperty('top');
//                                 style.removeProperty('bottom');
//                                 style.removeProperty('right');
//                             }}
//                             className="ac-icons-btn"
//                         > </Button>
//                     </Tooltip></label>

//             <Space size={5} wrap>
//             <Select style={{ width: 150 }} placeholder="Select Font Weight" value={style.position} onChange={onChangePosition}>
//                 {positions.map(pos => <Option value={pos}>{pos}</Option>)}
//             </Select>

//             <Checkbox name='position' checked={stylePriority.position === 'important' || stylePriority[`${type}`] === 'important'} onChange={onChangePriority}>important</Checkbox>
//             </Space>

//         </Space>

//         <br />
//         <br />
//         <Space size={10} direction='vertical'>
//             <label className='styling-label' style={{ textTransform: 'capitalize' }}>At: </label>
//             <Space>
//                 <Space size={1} direction='vertical'>
//                     <div>
//                         {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeTopUnit(u) }} style={{ color: u === topUnit ? '#f88a24' : '', cursor: 'pointer' }}>
//                             {u.toUpperCase()}
//                         </span>)}
//                     </div>
//                     <Input type='number' name="top" value={parseFloat(style.top ?? 0)} onChange={onChange} />
//                     <Checkbox name='top' checked={stylePriority.top === 'important' || stylePriority[`${type}`] === 'important'} onChange={onChangePriority}>important</Checkbox>

//                 </Space>
//                 <Space size={1} direction='vertical'>
//                     <div>
//                         {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeRightUnit(u) }} style={{ color: u === rightUnit ? '#f88a24' : '', cursor: 'pointer' }}>
//                             {u.toUpperCase()}
//                         </span>)}
//                     </div>
//                     <Input type='number' name="right" value={parseFloat(style.right ?? 0)} onChange={onChange} />
//                     <Checkbox name='right' checked={stylePriority.right === 'important' || stylePriority[`${type}`] === 'important'} onChange={onChangePriority}>important</Checkbox>

//                 </Space>
//             </Space>
//             <Space>
//                 <Space size={1} direction='vertical'>
//                     <div>
//                         {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeBottomUnit(u) }} style={{ color: u === bottomUnit ? '#f88a24' : '', cursor: 'pointer' }}>
//                             {u.toUpperCase()}
//                         </span>)}
//                     </div>
//                     <Input type='number' name="bottom" value={parseFloat(style.bottom ?? 0)} onChange={onChange} />
//                     <Checkbox name='bottom' checked={stylePriority.bottom === 'important' || stylePriority[`${type}`] === 'important'} onChange={onChangePriority}>important</Checkbox>

//                 </Space>
//                 <Space size={1} direction='vertical'>
//                     <div>
//                         {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeLeftUnit(u) }} style={{ color: u === leftUnit ? '#f88a24' : '', cursor: 'pointer' }}>
//                             {u.toUpperCase()}
//                         </span>)}
//                     </div>
//                     <Input type='number' name="left" value={parseFloat(style.left ?? 0)} onChange={onChange} />
//                     <Checkbox name='left' checked={stylePriority.left === 'important' || stylePriority[`${type}`] === 'important'} onChange={onChangePriority}>important</Checkbox>

//                 </Space>
//             </Space>
//         </Space>
//     </>


// }


import { useState, useEffect } from "react";
import { Input, Space, Select, Checkbox, Tooltip, Button, InputNumber } from "antd";
import { MdRestartAlt } from "react-icons/md";
import { RgbaColorPicker } from "react-colorful";

const units = ["px", "%", "em", "rem"];
const positions = ["static", "fixed", "sticky", "relative", "absolute"];

export default function Position({ type, style, properties, onChangeStyle, stylePriority, setStylePriority }) {

    const [topUnit, setTopUnit] = useState(units[0]);
    const [leftUnit, setLeftUnit] = useState(units[0]);
    const [bottomUnit, setBottomUnit] = useState(units[0]);
    const [rightUnit, setRightUnit] = useState(units[0]);

    useEffect(() => {
        if (!properties) return;

        setTopUnit(getUnit(`top`) || 'px');
        setLeftUnit(getUnit(`left`) || 'px');
        setBottomUnit(getUnit(`bottom`) || 'px');
        setRightUnit(getUnit(`right`) || 'px');
    }, [properties]);

    const getUnit = (property) => {
        return properties[property]?.unit;
    };


    const onChangePosition = (value) => {

        if (!properties['position'])
            properties['position'] = {};

        properties['position'].value = value;

        style.setProperty("position", value, stylePriority.position);
       onChangeStyle(); setStylePriority({ ...stylePriority });
    };

    const onChange = (value, name) => {


        let unit = ''
        if (name === "top") {
            value = value + topUnit;
            unit = topUnit;
        }
        else if (name === "right") {
            value = value + rightUnit;
            unit = rightUnit;

        }
        else if (name === "bottom") {
            value = value + bottomUnit;
            unit = bottomUnit;

        }
        else if (name === "left") {
            value = value + leftUnit;
            unit = leftUnit;

        }

        if (!properties[name])
            properties[name] = {};

        properties[name].value = value;
        properties[name].unit = unit;


        style.setProperty(name, value, stylePriority[name]);
       onChangeStyle(); setStylePriority({ ...stylePriority });
    };

    const onChangeUnit = (unit, setValue, propName) => {
        const val = `${parseFloat(style[propName] ?? 0) + unit}`;

        if (!properties[propName])
            properties[propName] = {};

        properties[propName].unit = unit;
        setValue(unit);

        style.setProperty(propName, val, stylePriority[propName]);
       onChangeStyle(); setStylePriority({ ...stylePriority });

    };

    const onChangePriority = (e) => {
        const name = e.target.name;
        const priority = e.target.checked ? "important" : "";


        if (!properties[name])
            properties[name] = {};

        properties[name].priority = priority;
        setStylePriority({ ...stylePriority, [name]: priority });
        style.setProperty(name, style[name], priority);
       onChangeStyle(); 

    };

    const resetStyle = (e) => {
        e.preventDefault();

        if (properties['position'])
        properties['position'] = {};

        style.removeProperty('position');

        if (properties['left'])
        properties['left'] = {};

        style.removeProperty("left");

        if (properties['top'])
        properties['top'] = {};


        style.removeProperty("top");

        if (properties['bottom'])
        properties['bottom'] = {};

        style.removeProperty("bottom");

        if (properties['right'])
        properties['right'] = {};

        style.removeProperty("right");

       onChangeStyle(); setStylePriority({ ...stylePriority });

    };

    return (
        <>

            <div>
                <div style={{ marginBottom: "10px" }}>
                    <Select
                        style={{ width: '70%' }}
                        size="small"
                        value={style.position}
                        onChange={onChangePosition}


                    >
                        {positions.map((position, i) => (
                            <Option key={i} value={position}>
                                {position}
                            </Option>
                        ))}
                    </Select>
                    <Checkbox
                                name="position"
                                size="small"
                                checked={stylePriority.position === "important"}
                                onChange={onChangePriority}
                            >
                                !
                            </Checkbox>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}

                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={resetStyle}
                        ></Button>
                    </Tooltip>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <InputNumber
                        name="top"
                        size="small"
                        placeholder="top"
                        value={parseFloat(style.top)}
                        onChange={(value) => onChange(value, 'top')}
                        addonAfter={<>
                            <Select
                                style={{ width: 60 }}
                                size="small"
                                value={topUnit}
                                onChange={(value) => onChangeUnit(value, setTopUnit, "top")}
                            >
                                {units.map((unit, i) => (
                                    <Option key={i} value={unit}>
                                        {unit}
                                    </Option>
                                ))}
                            </Select>
                            {"  "}
                            <Checkbox
                                name="top"
                                size="small"
                                checked={stylePriority.top === "important"}
                                onChange={onChangePriority}
                            >
                                !
                            </Checkbox>
                        </>
                        }
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>

                    <InputNumber
                        name="right"
                        size="small"
                        placeholder="right"
                        value={parseFloat(style.right)}
                        onChange={(value) => onChange(value, 'right')}
                        addonAfter={<>
                            <Select
                                style={{ width: 60 }}
                                size="small"
                                value={rightUnit}
                                onChange={(value) => onChangeUnit(value, setRightUnit, "right")}
                            >
                                {units.map((unit, i) => (
                                    <Option key={i} value={unit}>
                                        {unit}
                                    </Option>
                                ))}
                            </Select>
                            {"  "}
                            <Checkbox
                                name="right"
                                size="small"
                                checked={stylePriority.right === "important"}
                                onChange={onChangePriority}
                            >
                                !
                            </Checkbox>
                        </>
                        }
                    />

                </div>

                <div style={{ marginBottom: "10px" }}>


                    <InputNumber
                        name="bottom"
                        size="small"
                        placeholder="bottom"
                        value={parseFloat(style.bottom)}
                        onChange={(value) => onChange(value, 'bottom')}
                        addonAfter={<>
                            <Select
                                style={{ width: 60 }}
                                size="small"
                                value={bottomUnit}
                                onChange={(value) => onChangeUnit(value, setBottomUnit, "bottom")}
                            >
                                {units.map((unit, i) => (
                                    <Option key={i} value={unit}>
                                        {unit}
                                    </Option>
                                ))}
                            </Select>
                            {"  "}
                            <Checkbox
                                name="bottom"
                                size="small"
                                checked={stylePriority.bottom === "important"}
                                onChange={onChangePriority}
                            >
                                !
                            </Checkbox>
                        </>
                        }
                    />

                </div>
                <InputNumber
                    name="left"
                    size="small"
                    placeholder="left"
                    value={parseFloat(style.left)}
                    onChange={(value) => onChange(value, 'left')}
                    addonAfter={
                        <>
                            <Select
                                style={{ width: 60 }}
                                size="small"
                                value={leftUnit}
                                onChange={(value) => onChangeUnit(value, setLeftUnit, "left")}
                            >
                                {units.map((unit, i) => (
                                    <Option key={i} value={unit}>
                                        {unit}
                                    </Option>
                                ))}
                            </Select>
                            {"  "}
                            <Checkbox
                                name="left"
                                size="small"
                                checked={stylePriority.left === "important"}
                                onChange={onChangePriority}
                            >
                                !
                            </Checkbox>

                        </>
                    }
                />

            </div>
        </>
    );
}