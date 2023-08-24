import { useState } from "react";
import { Button, Table, Space, Menu } from "antd";
import { QuestionCircleFilled } from '@ant-design/icons';
import Link from "next/link";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlusSquare } from 'react-icons/ai';
import moment from "moment";

import AddState from "./Add";


const ColorList = ({ states, _setState }) => {


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: name => name
        },
        {
            title: 'Color',
            dataIndex: 'color',
            key: 'color',
            render: color => <div style={{background: color, width: '30px', height: '30px'}}></div>
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (text, record) => (
                <Space size="middle">
                    <AiOutlineEdit onClick={() => { _setState(record) }} className="ac-icon2" size="2em" />
                    <AiOutlineDelete className="ac-icon2" size="2em" />
                </Space>
            ),
        },
    ]

    return <Table columns={columns}

        dataSource={states} />

};

export default ColorList;
