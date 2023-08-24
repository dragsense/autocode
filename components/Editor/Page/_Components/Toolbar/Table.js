import React, { useEffect, useState } from "react";

import { Cascader, Select, Form, InputNumber, Checkbox, Card } from "antd";

const { Option } = Select;


import { useNodeStates } from "@/components/Editor/PageProvider";


export default function Table({ onSelect }) {


    const { node } = useNodeStates();

    const [isThead, setIsThead] = useState(false);
    const [isFoot, setIsFoot] = useState(false);

    const [tHeadRows, setTHeadRows] = useState(1);
    const [tHeadCols, setTHeadCols] = useState(1);

    const [tBodyRows, setTBodyRows] = useState(1);
    const [tBodyCols, setTBodyCols] = useState(1);

    const [tFootRows, setTFootRows] = useState(1);
    const [tFootCols, setTFootCols] = useState(1);

    useEffect(() => {

        if (!node || node.element.tagName !== 'table')
            return;


        setIsThead(node.element.thead.enable);
        setIsFoot(node.element.tfoot.enable);

        setTHeadRows(node.element.thead.rows);
        setTBodyRows(node.element.tbody.rows);
        setTFootRows(node.element.tfoot.rows);

        setTHeadCols(node.element.thead.cols);
        setTBodyCols(node.element.tbody.cols);
        setTFootCols(node.element.tfoot.cols);


    }, [node]);


    const onChangeTHeadRows = (value) => {
      

        setTHeadRows(value);
        node.element.thead.rows = value;

    }

    const onChangeTHeadCols = (value) => {
       

        setTHeadCols(value);
        node.element.thead.cols = value;

    }

    const onChangeTBodyRows = (value) => {
       

        setTBodyRows(value);
        node.element.tbody.rows = value;

    }

    const onChangeTBodyCols = (value) => {
       

        setTBodyCols(value);
        node.element.tbody.cols = value;

    }

    const onChangeTFootRows = (value) => {
       

        setTFootRows(value);
        node.element.tfoot.rowa = value;


    }

    const onChangeTFootCols = (value) => {
       

        setTFootCols(value);
        node.element.tfoot.cols = value;

    }




    return <div className="wrapper">



        <Card title="Table Header"
            bordered={false}
            bodyStyle={{ padding: isThead ? null : 0 }}
            extra={<Checkbox checked={isThead} onChange={() =>
            {
              setIsThead(!isThead); node.element.thead.enable = !isThead
            }
            }>Is THead?</Checkbox>}>
            {isThead && <>
                <Form
        layout="inline"
     
      >
                <Form.Item label="Rows" >
                    <InputNumber value={tHeadRows} onChange={onChangeTHeadRows}/>
                </Form.Item>
                <Form.Item label="Cols">
                    <InputNumber value={tHeadCols} onChange={onChangeTHeadCols}/>
                </Form.Item>
                </Form>
            </>}
        </Card>

        <br />

        <Card title="Table Body">
        <Form
       layout="inline"
      >
                <Form.Item label="Rows" >
                    <InputNumber value={tBodyRows} onChange={onChangeTBodyRows}/>
                </Form.Item>
                <Form.Item label="Cols">
                    <InputNumber value={tBodyCols} onChange={onChangeTBodyCols}/>
                </Form.Item>
                </Form>
        </Card>
        <br />
        <Card title="Table Footer"
            bordered={false}
            bodyStyle={{ padding: isFoot ? null : 0 }}
            extra={<Checkbox checked={isFoot} onChange={() => {
                
                setIsFoot(!isFoot)
                node.element.tfoot.enable = !isFoot
            
            }
                }>Is TFoot?</Checkbox>}>
            {isFoot && <>
                <Form
       layout="inline"
      >
                <Form.Item label="Rows" >
                    <InputNumber value={tFootRows} onChange={onChangeTFootRows}/>
                </Form.Item>
                <Form.Item label="Cols">
                    <InputNumber value={tFootCols} onChange={onChangeTFootCols}/>
                </Form.Item>
                </Form>
            </>}
        </Card>
    </div>


}

