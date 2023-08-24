// import { Button, Space, Tooltip, Card } from "antd";
// import { QuestionCircleFilled } from "@ant-design/icons";
// import { useState, useEffect } from "react";
// import { Tabs } from 'antd';
// const { TabPane } = Tabs;
// import { MdOutlinePlayArrow, MdFormatShapes } from 'react-icons/md';

// import Style from "./Style";
// import { Selecters } from "./Selector";
// import { MediaQueries } from "./MediaQuery";
// import { Animations } from "./Animation";
// import { State } from "./State";

// import PseudoClass from './Pseudo';

// import { useCssNodeStates } from "..";




// export default function StyleComponent({ isLoading, onAddState, undoStyle, redoStyle }) {
//     const { document } = useCssNodeStates();

//     const [selector, setSelector] = useState(null);
//     const [mediaQuery, setMediaQuery] = useState(null);

//     return <div className="inner-box" style={{ padding: 0 }}><div className="wrapper">

//         <Card loading={isLoading}>
//             <Tabs defaultActiveKey="1" tabPosition={'left'} onChange={() => { setSelector(null) }} className="style-switch-tabs">
//                 <TabPane tab={
//                     <span><Tooltip placement="right" title="styling">
//                         <MdFormatShapes size="20" />
//                     </Tooltip>
//                     </span>
//                 } key={1} >
//                     <Space wrap size={10} align="top" style={{ width: '100%' }}>

//                         {/* <MediaQueries
//                             document={document}
//                             mediaQuery={mediaQuery}
//                             setMediaQuery={setMediaQuery} /> */}
//                         <Selecters
//                             document={document}
//                             selector={selector}
//                             setSelector={setSelector}
//                             mediaQuery={mediaQuery}
//                             setMediaQuery={setMediaQuery} />
//                         <PseudoClass selector={selector} />
//                         <State selector={selector} />




//                     </Space>
//                 </TabPane>
//                 <TabPane tab={
//                     <span><Tooltip placement="right" title="animations">
//                         <MdOutlinePlayArrow size="20" />
//                     </Tooltip>
//                     </span>
//                 } key={2} >
//                     <Animations selector={selector} setSelector={setSelector} />
//                 </TabPane>
//             </Tabs>

//         </Card>
//         <br />
//         <div className="hr-line"></div>
//         <Style isLoading={!isLoading} selector={selector} setSelector={setSelector} setUState={onAddState} undoStyle={undoStyle} redoStyle={redoStyle} />
//     </div>

//     </div>


// }




import ProjectServices from "@/lib/services/projects";

import React from 'react';
import { Button, Card } from 'antd';
import {useSession } from 'next-auth/react';
import Router from "next/router";

const StyleComponent = () => {

   const { data: session } = useSession();


   const handleOpenAppClick = async () => {

      try {

         if (!session.user)
            throw new Error("Unauthorized Access or Session Expired");


         const projectId = localStorage.getItem("project");

         const info = {
             pageType: 'style',
             projectId,
         };

         const encodedInfo = encodeURIComponent(JSON.stringify(info));

         Router.push(`/admin/editor?info=${encodedInfo}`);

      } catch (e) {
         message.error(e?.message || "Something was wrong.")
      }


   };

   return (
      <Card>
         <Button type="primary" size="large" onClick={handleOpenAppClick}>
            Open STYLE Editor Desktop App
         </Button>
      </Card>
   );
};

export default StyleComponent;
