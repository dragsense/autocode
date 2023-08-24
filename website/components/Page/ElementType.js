
import React, { useMemo } from "react";
import { Select, Input, InputGroup, Image, Media, CloseTag, General, Option, Icon } from "./Type";
import Element from "./Element";


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
        children
    } = props;

    let tagType = node.tagName;
    if (tagType == 'hr')
        tagType = "close";

    const layout = node.layout;
    if (layout == 'inputgroup')
        tagType = "inputgroup";
    if (layout == 'icon' || layout == 'svg-icon')
        tagType = "icon";

    if (!conds)
        return null;

    const element = <Element classes={classes} attributes={attributes} tagName={node.tagName} />

    switch (tagType) {

        case 'select':
            return <Select
                onChange={onChange}
                innerWraaper={children}
                value={value.value || value}
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
            return <Input onChange={onChange} value={value.value ?? value}>{element}</Input>
        case 'inputgroup':

            return <InputGroup
                type={attributes["type"]}
                onChange={onChange}
                value={value}
                mapValue={mapValue}
                labelPos={node.labelPos || 0}
                attributes={attributes}
                options={options}
            ><Element classes={classes} tagName={'label'} /></InputGroup>
        case 'img':
            return <Image value={value}>{element}</Image>
        case 'video':
        case 'audio':
            return <Media
                tag={node.tagName}
                value={value}>{element}</Media>
        case 'close':
            return <CloseTag>{element}</CloseTag>
        case 'icon':
            return <Icon
                onChange={onChange}
                value={value}
                layout={layout}
                classes={node.classes}
            >{element}</Icon>
        default:
            return <General
                onClick={onClick}
                value={value.label ?? value} innerWraaper={children}>
                {element}
            </General>

    }

};

export default ElementType;