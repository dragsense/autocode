import { useEffect, useState } from "react";
import { Button, Table, Space, Card, message } from "antd";

import { AiFillFile,  } from 'react-icons/ai';
import usePageStates from "@/components/Editor/PageProvider";
import Form from './Form'

const FormList = ({ user, forms, setForms }) => {

    const [form, setForm] = useState(null);
    const { setCurrentPage, getCurrentPage } = usePageStates();

    useEffect(() => {

        const _id = localStorage.getItem('activePage');

        const _form = forms.find(c => c._id === _id);

        if (_form) {
            _form.type = 'form';
            setCurrentPage(_form);
        }

    }, [forms])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text,record) => <Form form={record}><span><AiFillFile size='1.5em' className="ac-icon1" /> {text}</span></Form>,
        }
    ]

    return (
        <div className="inner-box border">
            <div className="wrapper">
                <div className="inner-box">
                    <h1> Forms </h1>

                </div>

                <Table columns={columns}

                    rowClassName={(record) => record === getCurrentPage() ? 'primary-color pointer' : ' pointer'}

                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                event.preventDefault();
                                record.type = "form";
                                localStorage.setItem("activePage", record._id)
                                setCurrentPage(record)
                            }, // click row
                        };
                    }}

                    dataSource={forms} />

            </div>
        </div>
    );
};

export default FormList;
