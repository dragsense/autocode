import { Input, Slider, Select, InputNumber, Button, Checkbox, Tooltip, message, Dropdown, Menu, Collapse, Space } from 'antd';
const { Panel } = Collapse;
import { CgGlobeAlt } from 'react-icons/cg';
import { useEffect, useState } from 'react';
import { RgbaColorPicker } from "react-colorful";
import { SketchPicker } from 'react-color';


import { FaAlignJustify, FaAlignLeft, FaAlignRight, FaAlignCenter } from 'react-icons/fa'
import { MdRestartAlt } from 'react-icons/md';
import { fetcher } from "@/lib/fetch";
import ThemeServices from '@/lib/services/theme';
import { useCssNodeStates } from '../..';

const units = ['px', '%', 'em', 'rem'];
const weights = ['normal', 'regular', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const styles = [{ label: 'N', value: 'normal' }, { label: 'I', value: 'italic' }, { label: 'O', value: 'oblique' }];

const alignments = [{ icon: <FaAlignLeft size="1.5rem" />, value: 'left' },
{ icon: <FaAlignCenter size="1.5rem" />, value: 'center' },
{ icon: <FaAlignRight size="1.5rem" />, value: 'right' },
{ icon: <FaAlignJustify size="1.5rem" />, value: 'justify' }];
const transforms = [{ label: 'Cap', value: "capitalize" }, { label: 'ABC', value: 'uppercase' },
{ label: 'abc', value: 'lowercase' }];
const decorations = ['none', 'underline', 'overline '];
const whiteSpacings = ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap'];

import { isEmpty } from '@/lib/utils';

import List from '../List';
import { SaveOutlined } from '@ant-design/icons';

export default function Typography({ style, properties, onChangeStyle }) {


    const [unit, setUnit] = useState(units[0]);


    const [lineHeightUnit, setLineHeightUnit] = useState('');
    const [content, setContent] = useState(null);

    const [fonts, setFonts] = useState([]);
    const [colors, setColors] = useState([]);
    const [variables, setVariables] = useState([]);

    const [color, setColor] = useState(null);


    const [stylePriority, setStylePriority] = useState({
        color: '',
        fontFamily: '',
        fontSize: '',
        fontWeight: '',
        fontStyle: '',
        textAlign: '',
        textTransform: '',
        textDecoration: '',
        lineHeight: '',

    })

    const load = async () => {
        try {
            const resFonts = await ThemeServices.getFonts();
            const resColors = await ThemeServices.getColors();
            const resVaraibles = await ThemeServices.getVariables();

            setFonts(resFonts.fonts);
            setColors(resColors.colors);
            setVariables(resVaraibles.variables)

        } catch (e) {
            message.error(e?.message || 'Something went wrong');
        } finally {
        }
    }

    useEffect(() => {
        load();
    }, []);



    useEffect(() => {


        if (!properties) {
            return;
        }

        const priorities = {};

        for (const key in stylePriority) {
            const hyphenatedKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            if (properties[hyphenatedKey])
                priorities[key] = properties[hyphenatedKey].priority;
            else
                priorities[key] = '';

        }

        setStylePriority(priorities);

        setUnit(properties["font-size"]?.unit || 'px')

        const c = properties["color"];
        if (c)
            setColor(c.color || c.value);

        setLineHeightUnit(properties["line-height"]?.unit)


    }, [properties])



    const onChangeGlobalColor = ({ key }) => {


        const item = colors[key];

        const { value, color } = item;

        if (!properties['color'])
            properties['color'] = {};

        properties['color'].value = `var(${value})`;
        properties['color'].color = color;
        style.setProperty('color', `var(${value})`, stylePriority.color);
        setColor(color);
        onChangeStyle(); setStylePriority({ ...stylePriority });



    }

    const onChange = (dataName, name, value, unit = undefined, label = undefined) => {


        if (!properties[dataName])
            properties[dataName] = {};

        console.log(dataName, value)

        properties[dataName].value = value;
        properties[dataName].unit = unit;
        properties[dataName].label = label;

        style.setProperty(dataName, value, stylePriority.color);

        if (name === 'color') {
            properties['color'].color = value;
            setColor(value);
        }

        onChangeStyle();
        setStylePriority({ ...stylePriority });

    }


    const onChangeUnit = (value) => {

        if (!properties['font-size'])
            properties['font-size'] = {};

        properties['font-size'].unit = value;

        style.setProperty('font-size', parseFloat(style.fontSize) + value, stylePriority.fontSize);
        setUnit(value);
        onChangeStyle(); setStylePriority({ ...stylePriority });



    }

    const onChangeLineHeightUnit = (value) => {
        const v = value === lineHeightUnit ? '' : value;

        if (!properties['line-height'])
            properties['line-height'] = {};

        properties['line-height'].unit = v;

        style.setProperty('line-height', parseFloat(style.lineHeight) + v, stylePriority.lineHeight);
        setLineHeightUnit(v);

        onChangeStyle(); setStylePriority({ ...stylePriority });


    }

    const onChangeFont = (value, option) => {


        if (!properties['font-family'])
            properties['font-family'] = {};

        properties['font-family'].value = `var(${value})`;
        properties['font-family'].name = option.label;


        style.setProperty('font-family', `var(${value})`, stylePriority.fontFamily);
        onChangeStyle(); setStylePriority({ ...stylePriority });


    }



    const onChangeContent = (value) => {
        setContent(value);
        onChangeStyle(); setStylePriority({ ...stylePriority });


    }


    const onChangePriority = (e) => {

        const name = e.target.name;
        const _name = e.target['data-name'];
        const priority = e.target.checked ? 'important' : '';

        if (!properties[_name])
            properties[_name] = {}

        properties[_name].priority = priority;

        style.setProperty(_name, style[name], priority);
        setStylePriority({ ...stylePriority, [name]: priority });
        onChangeStyle();



    }




    const items = colors.map((c, i) => { return { label: c.name, key: i } });

    const fontSzies = variables.filter((variable) => variable.type === 'font').map((v, i) => { return { label: v.name, key: i } });
   

    return !isEmpty(style) ? <>
        <Collapse defaultActiveKey={['1']} accordion ghost>
            <Panel header="Color" key="1">

                <div style={{ marginBottom: "10px" }}>
                    <strong >Color:     </strong>

                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }}
                            name="color"
                            data-name="color"
                            checked={stylePriority.color === 'important'}
                            onChange={onChangePriority}
                        >
                            i
                        </Checkbox>
                    </Tooltip>

                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}

                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();

                                if (properties['color'])
                                    delete properties['color'];

                                style.removeProperty('color');
                                onChangeStyle();


                                setStylePriority({ ...stylePriority });


                            }}
                        ></Button>
                    </Tooltip>
                </div>


                <input

                    style={{
                        width: 40,
                        height: 40
                    }}
                    type='color' value={color} onChange={(e) => {
                        onChange('color', 'color', e.target.value)
                    }}

                />


                {colors && (
                    <Dropdown menu={{ items, onClick: onChangeGlobalColor }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <CgGlobeAlt
                                    size="35"
                                    color={color}
                                />
                            </Space>
                        </a>
                    </Dropdown>
                )}

            </Panel>
            <Panel header="Font" key="2">


                <div style={{ marginBottom: "10px" }}>
                    <strong >Font Family:   </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='fontFamily' data-name="font-family" checked={stylePriority.fontFamily === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}

                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle(); setStylePriority({ ...stylePriority });


                                style.removeProperty('font-family');
                            }}
                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <Select
                        style={{ width: '100%' }}
                        showSearch
                        value={properties['font-family']?.value}
                        onChange={onChangeFont}
                        placeholder="Select a Font"
                    >
                        {fonts?.map(item => (
                            <Option key={item.value} value={item.value} label={item.fontFamily}>{item.name}</Option>
                        ))}
                    </Select>


                </div>


                <div style={{ marginBottom: "10px" }}>
                    <strong >Font Size:     </strong>

                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='fontSize' data-name="font-size" checked={stylePriority.fontSize === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}

                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle(); setStylePriority({ ...stylePriority });


                                style.removeProperty('font-size');
                            }}
                        ></Button>
                    </Tooltip>

                </div>
                <div style={{ marginBottom: "10px" }}>
                    <div>
                        {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeUnit(u) }}
                            style={{ color: u === unit ? '#f88a24' : '', cursor: 'pointer' }}>
                            {u.toUpperCase()}
                        </span>)}
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Slider
                            min={0.3}
                            max={72}
                            step={0.1}
                            value={parseFloat(properties['font-size']?.value)}
                            onChange={(value) => {
                                onChange('font-size', 'fontSize', value + unit, unit)
                            }}
                            style={{ width: '70%' }}
                        />

                        <InputNumber
                            value={parseFloat(properties['font-size']?.value)}
                            onChange={(value) => {
                                onChange('font-size', 'fontSize', value + unit, unit)
                            }}
                            style={{ width: '30%' }}

                        />

                        {fontSzies && (
                            <Dropdown menu={{
                                fontSzies, onClick: ({ key }) => {
                                    const variable = fontSzies[key]
                                    onChange('font-size', 'fontSize', variable, unit)
                                }
                            }}
                                trigger={['click']}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        <CgGlobeAlt
                                            size="35"
                                        />
                                    </Space>
                                </a>
                            </Dropdown>
                        )}
                    </div>



                </div>


                <div style={{ marginBottom: "10px" }}>

                    <strong >Font Weight:   </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='fontWeight' data-name="font-weight" checked={stylePriority.fontWeight === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}

                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle(); setStylePriority({ ...stylePriority });


                                style.removeProperty('font-weight');
                            }}
                        ></Button>
                    </Tooltip>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <Select style={{ width: '100%' }}
                        placeholder="Select Font Weight" value={style.fontWeight}
                        onChange={(value) => {
                            onChange('font-weight', 'fontWeight', value)
                        }}
                    >
                        {weights.map(w => <Option value={w}>{w}</Option>)}
                    </Select>

                    {fontSzies && (
                        <Dropdown menu={{
                            fontSzies, onClick: ({ key }) => {
                                const variable = fontSzies[key]
                                onChange('font-weight', 'fontWeight', variable)
                            }
                        }}
                            trigger={['click']}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <CgGlobeAlt
                                        size="35"
                                    />
                                </Space>
                            </a>
                        </Dropdown>
                    )}


                </div>

                <div style={{ marginBottom: "10px" }}>
                    <strong >Style:    </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='fontStyle' data-name="font-style" checked={stylePriority.fontStyle === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle('');
                                style.removeProperty('font-style');
                            }}

                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    {styles.map(s => <Button

                        style={{ fontStyle: s.value, marginRight: "5px" }}
                        onClick={(e) => {
                            e.preventDefault();
                            if (style.fontStyle === s.value)
                                onChange('font-style', 'fontStyle', null)
                            else
                                onChange('font-style', 'fontStyle', s.value)
                        }}
                        type={s.value === style.fontStyle ? 'primary' : 'default'}>
                        {s.label}
                    </Button>)}

                </div>

                <div style={{ marginBottom: "10px" }}>

                    <strong >Line Height:   </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='lineHeight' data-name="line-height" checked={stylePriority.lineHeight === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle(); setStylePriority({ ...stylePriority });

                                style.removeProperty('line-height');
                            }}

                        ></Button>
                    </Tooltip> </div>
                <div style={{ marginBottom: "10px" }}>

                    <div style={{ marginBottom: "10px" }}>
                        <div>
                            {units.map(u => <span onClick={(e) => { e.preventDefault(); onChangeLineHeightUnit(u) }} style={{ color: u === lineHeightUnit ? '#f88a24' : '', cursor: 'pointer' }}>
                                {u.toUpperCase()}
                            </span>)}
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Slider
                                min={0.3}
                                max={72}
                                step={0.1}
                                value={parseFloat(style.lineHeight)}
                                onChange={(value) => {
                                    onChange('line-height', 'lineHeight', value, lineHeightUnit)
                                }} style={{ width: '70%' }}
                            />
                            <InputNumber
                                value={parseFloat(style.lineHeight)}
                                onChange={(value) => {
                                    onChange('line-height', 'lineHeight', value, lineHeightUnit)
                                }}
                                style={{ width: '30%' }}

                            />

                            {fontSzies && (
                                <Dropdown menu={{
                                    fontSzies, onClick: ({ key }) => {
                                        const variable = fontSzies[key]
                                        onChange('line-height', 'lineHeight', variable, lineHeightUnit)
                                    }
                                }}
                                    trigger={['click']}
                                >
                                    <a onClick={(e) => e.preventDefault()}>
                                        <Space>
                                            <CgGlobeAlt
                                                size="35"
                                            />
                                        </Space>
                                    </a>
                                </Dropdown>
                            )}

                        </div>



                    </div>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <strong>Word Spacing:  </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }}
                            name='wordSpacing'
                            data-name="word-spacing"
                            checked={stylePriority.wordSpacing === 'important'}
                            onChange={onChangePriority}
                        >i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle(); setStylePriority({ ...stylePriority });

                                style.removeProperty('word-spacing');
                            }}
                        ></Button>
                    </Tooltip>
                </div>


                <div style={{ marginBottom: "10px" }}>
                    <Slider
                        min={0}
                        max={100}
                        step={0.1}
                        value={parseFloat(style.wordSpacing)}

                        onChange={(value) => {
                            onChange('word-spacing', 'wordSpacing', value, 'px')
                        }}
                    />
                    {fontSzies && (
                        <Dropdown menu={{
                            fontSzies, onClick: ({ key }) => {
                                const variable = fontSzies[key]
                                onChange('word-spacing', 'wordSpacing', variable, 'px')
                            }
                        }}
                            trigger={['click']}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <CgGlobeAlt
                                        size="35"
                                    />
                                </Space>
                            </a>
                        </Dropdown>
                    )}

                </div>

                <div style={{ marginBottom: "10px" }}>

                    <strong >Letter Spacing:   </strong>

                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='letterSpacing' data-name="letter-spacing" checked={stylePriority.letterSpacing === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle('');
                                style.removeProperty('letter-spacing');
                            }}

                        ></Button>
                    </Tooltip>

                </div>
                <div style={{ marginBottom: "10px" }}>

                    <Slider
                        min={0}
                        max={100}
                        step={0.1}
                        value={parseFloat(style.letterSpacing)}

                        onChange={(value) => {
                            onChange('letter-spacing', 'letterSpacing', value, 'px')
                        }}
                    />

                    {fontSzies && (
                        <Dropdown menu={{
                            fontSzies, onClick: ({ key }) => {
                                const variable = fontSzies[key]
                                onChange('letter-spacing', 'letterSpacing', variable, 'px')
                            }
                        }}
                            trigger={['click']}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <CgGlobeAlt
                                        size="35"
                                    />
                                </Space>
                            </a>
                        </Dropdown>
                    )}


                </div>

                <div style={{ marginBottom: "10px" }}>
                    <strong >Transform:    </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='textTransform' data-name="font-transform" checked={stylePriority.textTransform === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle(); setStylePriority({ ...stylePriority });

                                style.removeProperty('text-transform');
                            }}

                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    {transforms.map(t => <Button
                        style={{ marginRight: "5px" }}

                        onClick={(e) => {
                            e.preventDefault();
                            if (style.textTransform === t.value)
                                onChange('text-transform', 'textTransform', null, undefined)
                            else
                                onChange('text-transform', 'textTransform', t.value, undefined)
                        }}

                        type={t.value === style.textTransform ? 'primary' : 'default'}>
                        {t.label}
                    </Button>)}



                </div>

            </Panel>

            <Panel header="Alignment" key="3">

                <div style={{ marginBottom: "10px" }}>
                    <strong >Alignment:     </strong>

                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='textAlign' data-name="text-align" checked={stylePriority.textAlign === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>

                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle('');

                                style.removeProperty('text-align');
                            }}
                        />
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>


                    {alignments.map(align => <Button
                        icon={align.icon}
                        onClick={(e) => {
                            e.preventDefault();

                            onChange('text-align', 'textAlign', align.value, undefined)

                        }}
                        style={{ marginRight: "5px" }}
                        type={align.value === style.textAlign ? 'primary' : 'default'}></Button>)}



                </div>


            </Panel>


            <Panel header="Other" key="4">
                <div style={{ marginBottom: "10px" }}>
                    <strong >Content:   </strong>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle(); setStylePriority({ ...stylePriority });


                                style.removeProperty('content');
                            }}

                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px", display: 'flex', alignItems: 'center' }}>

                    <Input style={{ marginRight: "5px" }} type='text' value={content}
                        onChange={(e) => { const value = e.target.value; onChangeContent(value); }} />

                    <Button icon={<SaveOutlined size="1.5rem" />}
                        onClick={() => style.setProperty('content', content, stylePriority.content)} />
                </div>


                <div style={{ marginBottom: "10px" }}>
                    <strong>White Space:  </strong>

                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }}
                            name='whiteSpace'
                            data-name="white-space"
                            checked={stylePriority.whiteSpace === 'important'}
                            onChange={onChangePriority}
                        >i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle(); setStylePriority({ ...stylePriority });

                                style.removeProperty('white-space');
                            }}
                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <Select
                        style={{ width: '100%' }}
                        showSearch
                        value={style.whiteSpace}
                        onChange={(value) => {
                            onChange('white-space', 'whiteSpace', value)
                        }}
                        placeholder="Select Value"
                    >
                        {whiteSpacings.map(item => (
                            <Option key={item}>{item}</Option>
                        ))}
                    </Select>

                </div>


                <div style={{ marginBottom: "10px" }}>
                    <strong>Text Indent:  </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='textIndent' data-name="text-indent" checked={stylePriority.textIndent === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle('');
                                style.removeProperty('text-indent');
                            }}
                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>

                    <Slider
                        min={0}
                        max={100}
                        step={0.1}
                        value={parseFloat(style.textIndent)}
                        onChange={(value) => {
                            onChange('text-indent', 'textIndent', value)
                        }}
                    />


                </div>

                <div style={{ marginBottom: "10px" }}>
                    <strong>Text Overflow:  </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }}
                            name='textOverflow'
                            data-name="text-overflow"
                            checked={stylePriority.textOverflow === 'important'}
                            onChange={onChangePriority}
                        >
                            i
                        </Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle(); setStylePriority({ ...stylePriority });

                                style.removeProperty('text-overflow');
                            }}
                        ></Button>
                    </Tooltip>
                </div>
                <div style={{ marginBottom: "10px" }}>


                    <Checkbox
                        name="textOverflow"
                        data-name="text-overflow"
                        checked={style.textOverflow === 'ellipsis'}
                        onChange={(e) => {
                            const value = e.target.checked ? 'ellipsis' : null;
                            onChange('text-overflow', 'textOverflow', value)

                        }}
                    >
                        ellipsis
                    </Checkbox>




                </div>

                <div style={{ marginBottom: "10px" }}>

                    <strong >Decoration:   </strong>
                    <Tooltip placement="top" title="important">
                        <Checkbox style={{ marginLeft: 3 }} name='textDecoration' data-name="text-decoration" checked={stylePriority.textDecoration === 'important'} onChange={onChangePriority}>i</Checkbox>
                    </Tooltip>
                    <Tooltip placement="top" title="Reset">
                        <Button
                            style={{ float: "right" }}
                            size="small"
                            icon={<MdRestartAlt size="small" />}
                            onClick={(e) => {
                                e.preventDefault();
                                onChangeStyle('');
                                style.removeProperty('text-decoration');
                            }}

                        ></Button>
                    </Tooltip>

                </div>
                <div style={{ marginBottom: "10px" }}>



                    <Select
                        style={{ width: '100%' }}
                        showSearch
                        value={style.textDecoration}
                        onChange={(value) => {
                            onChange('text-decoration', 'textDecoration', value)

                        }}
                        placeholder="Select Decoration"
                    >
                        {decorations.map(item => (
                            <Option key={item}>{item}</Option>
                        ))}
                    </Select>



                </div>

            </Panel>
        </Collapse ></>

        : <></>


}


