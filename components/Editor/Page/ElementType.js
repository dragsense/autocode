
import React, { useMemo } from "react";
import { Select, Input, InputGroup, Image, Media, CloseTag, General, Option, Icon } from "./Type";
import Element from "./Element";
import parse from 'html-react-parser';

const ParsedValue = ({ value }) => {

    const parsedValue = useMemo(() => parse(value + ""), [value]);
    return <>{parsedValue}</>;
};



const ElementType = (props) => {

    const {
        attributes,
        classes,
        value,
        conds,
        mapValue,
        mapIndex,
        onChange,
        onClick,
        options,
        node,
        children,
        pos } = props;

    const _uid = node._uid;
    let tagType = node.tagName;
    if (tagType == 'hr')
        tagType = "close";

    const layout = node.layout;
    if (layout == 'inputgroup')
        tagType = "inputgroup";
    if (layout == 'icon' || layout == 'svg-icon')
        tagType = "icon";

    const element = <Element classes={classes} attributes={attributes} tagName={node.tagName} />

    switch (tagType) {

        case 'select':
            return <Select
                onChange={onChange}
                innerWraaper={children}
                value={value.value || value}
                _uid={_uid}
                pos={pos}
                options={options}
            >{element}</Select>
        case 'option':

            return <Option
                value={value.value || value}
                mapIndex={mapIndex}
                mapValue={mapValue}
            >{element}</Option>
        case 'input':
        case 'textarea':
            return <Input onChange={onChange} _uid={_uid} pos={pos} value={value.value ?? value}>{element}</Input>
        case 'inputgroup':

            return <InputGroup
                type={attributes["type"]}
                onChange={onChange}
                value={value}
                mapValue={mapValue}
                labelPos={node.labelPos || 0}
                _uid={_uid}
                pos={pos}
                conds={conds}

                attributes={attributes}
                options={options}
            ><Element classes={classes} tagName={'label'} /></InputGroup>
        case 'img':
            return <Image _uid={_uid}   name={node.name || node.tagName} pos={pos} value={value}>{element}</Image>
        case 'video':
        case 'audio':
            return <Media
                tag={node.tagName}
                _uid={_uid}
                pos={pos}
                value={value}>{element}</Media>
        case 'close':
            return <CloseTag _uid={_uid} pos={pos}>{element}</CloseTag>
        case 'icon':
            return <Icon
                onChange={onChange}
                value={value}
                _uid={_uid}
                pos={pos}
                conds={conds}
                layout={layout}
                classes={node.classes}
            >{element}</Icon>
        default:
            return <General
                pos={pos}
                _uid={_uid}
                name={node.name || node.tagName}
                conds={conds}
                onClick={onClick}
                value={value.label ?? value} innerWraaper={children}>
                {element}
            </General>

    }

};

export default ElementType;