
import { Button, Tabs } from "antd";
import { FaImages } from "react-icons/fa";
import Link from "next/link";
import { MdVideoLibrary, MdFileCopy } from "react-icons/md";
const { TabPane } = Tabs;

import { ImageComponent } from "./Image";



export function MediaLinksComponent() {
  return <div style={{ padding: 10 }}>

    <Tabs
      defaultActiveKey="1" >

      <TabPane tab={<span>
        <FaImages size="1rem" style={{ marginRight: 3 }} />
        Images
      </span>} key="1">

       <div><ImageComponent type="images"/></div> 
      </TabPane>
      <TabPane tab={<span>
        <MdVideoLibrary size="1rem" style={{ marginRight: 3 }} />
        Videos
      </span>} key="2">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab={<span>
        <MdFileCopy size="1rem" style={{ marginRight: 3 }} />
        Docs
      </span>} key="3">
        Content of Tab Pane 3
      </TabPane>
    </Tabs>




  </div>

};


