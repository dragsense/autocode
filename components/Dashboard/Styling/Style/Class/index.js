

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, message } from 'antd';






export function className({className, onAdd}) {

    const [form] = Form.useForm();
    const [isNameModified, setIsNameModified] = useState(false);

    const handleNameChange = (event) => {
        setIsNameModified(true);
      };
    

    useEffect(() => {

        if (!font) {
            return;
        }

        form.setFieldsValue({className});
       
        setIsNameModified(false);

    }, [font]);


 const onSubmit = () => {

    form
    .validateFields()
    .then(async (values) => {

        onAdd(values);
        setIsNameModified(false);


    })
    .catch((info) => {
        setFontModalOpen(true);
        message.error('Validate Failed.');

    });

 }



    return (
        <Form
                form={form}
                layout="horizontal"
                name="form_in_modal"
                onSubmit={onSubmit}
                initialValues={{}}
            >
                
                <Form.Item
                    name="className"
                    label="Class Name"
                    className="font-500"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the class name (alphanumeric).',
                            pattern: /^[a-zA-Z0-9]+$/
                        },
                    ]}
                >
                    <Input type="text" onChange={handleNameChange}/>

                </Form.Item>

                <Form.Item className="text-right">
                    <Button type="primary" size="small" disabled={!isNameModified}  htmlType="submit"> Update </Button>
                </Form.Item>
        
            </Form>
    );
}
