import React, { useState, useEffect } from "react";
import { Slider, Input, Switch, Tooltip, Checkbox, Button } from "antd";

import { rgbToHex } from "@/lib/utils/color";
import { MdRestartAlt } from "react-icons/md";

const ShadowText = ({ style, properties, onChangeStyle }) => {
    
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [blurRadius, setBlurRadius] = useState(0);
    const [color, setColor] = useState("#000000");
    const [stylePriority, setStylePriority] = useState({
        textShadow: "",
    });

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

        if (!properties["text-shadow"])
            properties["text-shadow"] = {};

        if (properties['text-shadow']) {
            const {color, offsetXValue, offsetYValue, blurRadiusValue} = properties['text-shadow'];
            setOffsetX(parseFloat(offsetXValue));
            setOffsetY(parseFloat(offsetYValue));
            setBlurRadius(parseFloat(blurRadiusValue || "0"));
            setColor(rgbToHex(color) || "#000000");
            setStylePriority(priorities);
        }
    }, [properties]);

    const handleOffsetXChange = (value) => {

        properties["text-shadow"].offsetXValue = value;

        style.setProperty(
            "text-shadow",
            `${value}px ${offsetY}px ${blurRadius}px ${color}`,
            stylePriority.textShadow
        );

        setOffsetX(value);
        onChangeStyle();
    };

    const handleOffsetYChange = (value) => {
        properties["text-shadow"].offsetYValue = value;

        style.setProperty(
            "text-shadow",
            `${offsetX}px ${value}px ${blurRadius}px ${color}`,
            stylePriority.textShadow
        );

        setOffsetY(value);
        onChangeStyle();

    };

    const handleBlurRadiusChange = (value) => {
        properties["text-shadow"].blurRadiusValue = value;

        style.setProperty(
            "text-shadow",
            `${offsetX}px ${offsetY}px ${value}px ${color}`,
            stylePriority.textShadow
        );

        setBlurRadius(value);
        onChangeStyle();

    };

    const handleColorChange = (event) => {
        const value = event.target.value;
        properties["text-shadow"].color = value;

        style.setProperty(
            "text-shadow",
            `${offsetX}px ${offsetY}px ${blurRadius}px ${value}`,
            stylePriority.textShadow
        );

        setColor(value);
        onChangeStyle();

    };

    const onChangePriority = (e) => {

        const priority = e.target.checked ? 'important' : '';
        setStylePriority({ ...stylePriority, "text-shadow": priority })
        properties["text-shadow"].priority = priority;
   
        style.setProperty("text-shadow", style.textShadow, priority);
        onChangeStyle();

    }


    return (
        <div>
            <div style={{ marginBottom: "10px" }}>
                <strong >Text Shadow:     </strong>
                <Tooltip placement="top" title="important">
                    <Checkbox style={{ marginLeft: 3 }}
                        checked={stylePriority["text-shadow"] === 'important'} onChange={onChangePriority}>i</Checkbox>
                </Tooltip>
                <Tooltip placement="top" title="Reset">
                    <Button
                        style={{ float: 'right' }}
                        size='small'
                        icon={<MdRestartAlt size="small" />}
                        onClick={(e) => {
                            e.preventDefault();
                            onChangeStyle();
                            style.removeProperty('text-shadow');
                        }}
                    />
                </Tooltip>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Offset X:</label>
                <Slider min={-50} max={50} value={offsetX} onChange={handleOffsetXChange} />
                <Input value={offsetX} onChange={(e) => handleOffsetXChange(e.target.value)} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Offset Y:</label>
                <Slider min={-50} max={50} value={offsetY} onChange={handleOffsetYChange} />
                <Input value={offsetY} onChange={(e) => handleOffsetYChange(e.target.value)} />
            </div>
            <div style={{ marginBottom: "10px" }}>
                <label>Blur Radius:</label>
                <Slider min={0} max={50} value={blurRadius} onChange={handleBlurRadiusChange} />
                <Input value={blurRadius} onChange={(e) => handleBlurRadiusChange(e.target.value)} />
            </div>

            <div style={{ marginBottom: "10px" }}>
                <label>Color:</label>
                <Input type="color" value={color} onChange={handleColorChange} />
            </div>

        </div>
    );
};

export default ShadowText;