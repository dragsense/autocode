import { useState, useEffect } from "react";
import { Button, Table, Space, Menu } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import Link from "next/link";
import { AiFillFile, AiOutlineEdit, AiOutlineSetting, AiOutlineDelete } from 'react-icons/ai';

import Component from "./Component";
import moment from "moment";
import usePageStates from "@/components/Editor/PageProvider";

const ComponentList = ({ components }) => {

    const [component, setComponent] = useState(null);
    const { setCurrentPage, getCurrentPage } = usePageStates();

    useEffect(() => {

        const _id = localStorage.getItem('activePage');

        const _component = components.find(c => c._id === _id);

        if (_component) {
            _component.type = 'component';
            setCurrentPage(_component);
        }

    }, [components])




    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <Component component={record}><span><AiFillFile size='1.5em' className="ac-icon1" /> {text}</span></Component>,
        }
    ]


    return (

        <div className="inner-box border">
            <div className="wrapper">
                <div className="inner-box">
                    <h1> Components </h1>

                </div>

                <Table columns={columns}

                    rowClassName={(record) => record === getCurrentPage() ? 'primary-color pointer' : ' pointer'}

                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                event.preventDefault();
                                record.type = "component";
                                localStorage.setItem("activePage", record._id)
                                setCurrentPage(record)
                            }, // click row
                        };
                    }}

                    dataSource={components} />

            </div>
        </div>


    );
};

export default ComponentList;
