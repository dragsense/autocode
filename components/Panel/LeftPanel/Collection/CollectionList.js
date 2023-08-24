import { useState, useEffect } from "react";
import { Button, Table, Space, Menu } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import Link from "next/link";
import { AiFillFile, AiOutlineEdit, AiOutlineSetting, AiOutlineDelete } from 'react-icons/ai';


import moment from "moment";


import usePageStates from "@/components/Editor/PageProvider";

const CollectionList = ({ collections }) => {

    const { setCurrentPage, getCurrentPage } = usePageStates();
    const [collection, setCollection] = useState(null);

    useEffect(() => {

        const _id = localStorage.getItem('activePage');

        const _collection = collections.find(c => c._id === _id);

        console.log(_collection, _id)

        if(_collection)
        {
            
            _collection.type = 'collection';
        setCurrentPage(_collection);
        }

    }, [collections])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <span><AiFillFile size='1.5em' className="ac-icon1" /> {text}</span>,
        }
    ]

    return (
  
            <div className="inner-box border">
                <div className="wrapper">
                    <div className="inner-box">
                        <h1> Collections </h1>
                       
                    </div>
                 
                    <Table columns={columns} dataSource={collections} 
                    rowClassName={(record) => record === getCurrentPage() ? 'primary-color pointer' : ' pointer'}

                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                event.preventDefault();
                                record.type = "collection";
                                localStorage.setItem("activePage", record._id)
                                setCurrentPage(record)
                            }, // click row
                        };
                    }}/>
                </div>
            </div>
       

    );
};

export default CollectionList;
