import { Collapse, Space, Select, Button, Tooltip, Dropdown, Checkbox } from 'antd';
const { Panel } = Collapse;
import { useEffect, useState } from 'react';



import { isEmpty } from '@/lib/utils';
import { MdRestartAlt } from 'react-icons/md';
import ThemeServices from '@/lib/services/theme';
import { CgGlobeAlt } from 'react-icons/cg';

export default function Svg({ style, properties,
    onChangeStyle, }) {


    const [stylePriority, setStylePriority] = useState({
        fill: '',
    })

    const [color, setColor] = useState(style.fill);
    const [colors, setColors] = useState([]);


    const load = async () => {
        try {
            const resColors = await ThemeServices.getColors();
            setColors(resColors.colors);

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

        const fillColor = properties['fill'];
        if (fillColor)
            setColor(fillColor.color || fillColor.value)
        else
            properties['fill'] = {}


    }, [properties])


    const onChangeColor = (e) => {
        const value = e.target.value
        if (!properties['filter'])
            properties['filter'] = {};

        properties['filter']['value'] = value;
        style.setProperty('fill', value, stylePriority.fill);
        setColor(value);
        onChangeStyle();

    }

    const onChangeGlobalColor = ({ key }) => {


        const item = colors[key];

        const { value, color } = item;

        if (!properties['fill'])
            properties['fill'] = {};

        properties['fill'].value = value;
        properties['fill'].color = color;
        style.setProperty('fill', `var(${value})`, stylePriority.color);
        setColor(color);
        onChangeStyle();


    }

    const onChangePriority = (e) => {

        const priority = e.target.checked ? 'important' : '';
        setStylePriority({ ...stylePriority, fill: priority })
        if (!properties['fill'])
            properties['fill'] = {};
        properties['fill'].priority = priority;
        style.setProperty('fill', style.fill, priority);
        onChangeStyle();

    }


    const items = colors.map((c, i) => { return { label: c.name, key: i } });


    return style && <>
        <div style={{ marginBottom: "10px" }}>
            <strong>Fill:  </strong>
            <Tooltip placement='bottom' title="important">
                <Checkbox style={{ marginLeft: 3 }} name='fill' data-name="fill" checked={stylePriority.fill === 'important'} onChange={onChangePriority}>i</Checkbox>
            </Tooltip>
            <Tooltip placement="top" title="Reset">
                <Button
                    style={{ float: 'right' }}
                    size='small'
                    icon={<MdRestartAlt size="small" />}
                    onClick={(e) => {
                        e.preventDefault();
                        setColor('');
                        style.removeProperty('fill');
                        setStylePriority({ ...stylePriority, fill: '' });
                        onChangeStyle();
                    }}
                ></Button>
            </Tooltip>
        </div>
        <div style={{ marginBottom: "10px" }}>

            <input

                style={{
                    width: 40,
                    height: 40
                }}
                type='color' value={color} onChange={onChangeColor} />

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
        </div>
    </>
}

