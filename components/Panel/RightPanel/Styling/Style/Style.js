import { Button, Space, Tooltip } from "antd";
import { useState, useEffect } from "react";

import {
    MdTextFields,
    MdCropSquare,
    MdSelectAll,
    MdGradient,
    MdOutlineBorderOuter,
    MdOutlineFlipToFront,
    MdViewQuilt, MdRestartAlt, MdNat, MdDelete
} from 'react-icons/md';

import Typography from "@/components/Dashboard/Styling/Style/Typography";
import Background from "@/components/Dashboard/Styling/Style/Background";
import Size from "@/components/Dashboard/Styling/Style/Size";
import Spacing from "@/components/Dashboard/Styling/Style/Spacing";
import Position from "@/components/Dashboard/Styling/Style/Position";
import Border from "@/components/Dashboard/Styling/Style/Border";
import Other from "@/components/Dashboard/Styling/Style/Other";
import Display from "@/components/Dashboard/Styling/Style/Display";
import Transform from "@/components/Dashboard/Styling/Style/Transform";

import SwitchComponents from "@/components/Panel";

import { useNodeStates, useCssNodeStates } from "@/components/Editor/PageProvider";


export default function Style({ isLoading, selector, setSelector, setUState }) {


    const [avtiveTab, setActiveTab] = useState('1');
    const [style, setStyle] = useState(null);
    const [uStyle, _setUStyle] = useState(null);

    const { node } = useNodeStates();

    const { setElementStyle } = useCssNodeStates();

    useEffect( () => {

        if (!selector) {

            setElementStyle('');
            setStyle(null);
            return;
        }


        
        setElementStyle(selector.name);

        if (selector.type == 'editor' && node) {
            node.element.selector = selector.name;

            
            if (node.element.layout == 'flex') {
                selector.style.display = selector.style.display ? selector.style.display :  'flex';

            }

            if (node.element.layout == 'grid') {
                selector.style.display =  selector.style.display ? selector.style.display :  'grid';
            }

            if (node.element.layout == 'fg-child') {
                selector.style.width = selector.style.width ? selector.style.width : node.element.setting?.width;
            }

        }

        setStyle(selector.style);


    }, [selector])



    const setUStyle = (style, name, value, priority) => {

        setUState({
            fun: () => {
                style.setProperty(name, value, priority);
            }
        })
    }


    return <> {isLoading && <div >

        <Space wrap="true" style={{ paddingBottom: 10 }} >


            <Tooltip placement="top" title="Typeography">
                <Button
                    icon={<MdTextFields size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('1') }}
                    className={`ac-tabs-btn ${avtiveTab === '1' ? 'active' : ''}`}
                >  </Button>
            </Tooltip>
            <Tooltip placement="top" title="Size">
                <Button
                    icon={<MdCropSquare size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('2') }}
                    className={`ac-tabs-btn ${avtiveTab === '2' ? 'active' : ''}`}
                >  </Button>
            </Tooltip>
            <Tooltip placement="top" title="Spacing">
                <Button
                    icon={<MdSelectAll size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('3') }}
                    className={`ac-tabs-btn ${avtiveTab === '3' ? 'active' : ''}`}
                >  </Button>
            </Tooltip>
            <Tooltip placement="top" title="Background">
                <Button
                    icon={<MdGradient size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('4') }}
                    className={`ac-tabs-btn ${avtiveTab === '4' ? 'active' : ''}`}
                >  </Button>
            </Tooltip>
            <Tooltip placement="top" title="Border">
                <Button
                    icon={<MdOutlineBorderOuter size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('5') }}
                    className={`ac-tabs-btn ${avtiveTab === '5' ? 'active' : ''}`}
                > </Button>
            </Tooltip>
            <Tooltip placement="top" title="Position">
                <Button
                    icon={<MdOutlineFlipToFront size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('6') }}
                    className={`ac-tabs-btn ${avtiveTab === '6' ? 'active' : ''}`}
                >  </Button>
            </Tooltip>
            <Tooltip placement="top" title="Display">
                <Button
                    icon={<MdViewQuilt size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('7') }}
                    className={`ac-tabs-btn ${avtiveTab === '7' ? 'active' : ''}`}
                >   </Button>
            </Tooltip>

            <Tooltip placement="top" title="Transform">
                <Button
                    icon={<MdNat size="medium" />}
                    onClick={(e) => { e.preventDefault(); setActiveTab('8') }}
                    className={`ac-tabs-btn ${avtiveTab === '8' ? 'active' : ''}`}
                >   </Button>
            </Tooltip>

            <Tooltip placement="top" title="Shadows, Transition, Animation">
                <Button

                    onClick={(e) => { e.preventDefault(); setActiveTab('9') }}
                    className={`ac-tabs-btn ${avtiveTab === '9' ? 'active' : ''}`}
                > Misc </Button>
            </Tooltip>

            <Tooltip placement="left" title="Reset Current Style">
                <Button
                    icon={<MdRestartAlt size="medium" />}
                    onClick={(e) => {
                        e.preventDefault();

                        if (selector) {
                            for (let i = selector.style.length; i--;) {
                                const nameString = selector.style[i];

                                selector.style.removeProperty(nameString);
                            }

                            setSelector(null);
                        }

                    }}
                    className="ac-icons-btn"
                > </Button>
            </Tooltip>




        </Space>

        <div className="wrapper" style={{ height: 500, overflow: 'auto' }}>

            <SwitchComponents active={avtiveTab}>
                <Typography style={style} index="1" setUStyle={setUStyle} />
                <Size style={style} index="2" setUStyle={setUStyle} />
                <Spacing style={style} index="3" setUStyle={setUStyle} />
                <Background style={style} selector={selector} setUStyle={setUStyle} index="4" />
                <Border style={style} selector={selector} setUStyle={setUStyle} index="5" />
                <Position style={style} index="6" setUStyle={setUStyle} />
                <Display style={style} selector={selector} setUStyle={setUStyle} index="7" />
                <Transform style={style} index="8" setUStyle={setUStyle} />

                <Other style={style} selector={selector} uStyle={style} setUStyle={setUStyle} index="9" />
            </SwitchComponents>

        </div>


    </div>}




    </>
}

