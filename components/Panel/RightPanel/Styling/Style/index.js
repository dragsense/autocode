
import { Button, Space, Tooltip, Card } from "antd";
import { useState, useEffect } from "react";
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import { MdOutlinePlayArrow, MdFormatShapes } from 'react-icons/md';

import Style from "./Style";
import { Selecters } from "@/components/Dashboard/Styling/Style/Selector";
import { MediaQueries } from "@/components/Dashboard/Styling/Style/MediaQuery";
import { State } from "@/components/Dashboard/Styling/Style/State";
import PseudoClass from '@/components/Dashboard/Styling/Style/Pseudo';

import ClassManager from './ClassManager';

import { useCssNodeStates } from "@/components/Editor/PageProvider";
import { element } from "prop-types";


export default function StyleComponent({ currentNode, isLoading, states, setUState }) {

    const { document, setEditorSelector, editorSelector, selector, setSelector} = useCssNodeStates();

    const [mediaQuery, setMediaQuery] = useState(null);



    return <div className="inner-box" style={{ padding: 0 }}><div className="wrapper">

      

        <div className="hr-line"></div>
        <Space wrap size={10} align="top" style={{ width: '100%' }}>

            <ClassManager states={states} />

             <><MediaQueries
                document={document}
                mediaQuery={mediaQuery}
                setMediaQuery={setMediaQuery} />
                <Selecters
                editorSelector={editorSelector}
                    document={document}
                    selector={selector}
                    setSelector={setSelector}
                    mediaQuery={mediaQuery}
                    setMediaQuery={setMediaQuery} />
                <PseudoClass selector={selector} />
                <State selector={selector} /></>




        </Space>

        <br />
        <br />
        <div className="hr-line"></div>
        <Style isLoading={!isLoading} selector={selector} setSelector={setSelector} setUState={setUState}/>
    </div>

    </div>


}



