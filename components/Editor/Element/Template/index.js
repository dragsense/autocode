import React, { useState, useRef, useEffect } from "react";
import { Form, Input, message, Button, theme, Select, Modal, Image } from "antd";
import ThemeServices from "@/lib/services/theme";
import MediaServices from "@/lib/services/media";
import html2canvas from 'html2canvas'
import MediaModal from "@/components/Dashboard/Media/MediaModal";

const { TextArea } = Input;

const rules = {
    name: [{ required: true, message: 'Please input template name' }],
    desc: [{ required: true, message: 'Please input template description' }],
};

import { ToolBarButton } from "../ToolBar";


import { DragOutlined, SaveOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';


import { v4 as uuid } from 'uuid';
import { getData } from "@/lib/utils/db";

const onAddTemplateElements = async (currentElement, elements = {}) => {
    if (Array.isArray(currentElement.childNodes)) {
        const newChilds = await Promise.all(currentElement.childNodes.map(async (_uid) => {
            const child = await getData(_uid);
            const unique_id = uuid();
            child._uid = unique_id;
            child.parent = currentElement._uid;
            await onAddTemplateElements(child, elements);
            elements[unique_id] = child;
            return unique_id;
        }));
        currentElement.childNodes = newChilds;
    }
}

export function ModalTemplate({ template, element, onUpdateTemplte }) {

    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);

    const [state, setState] = useState(null);
    const [tempURL, setURL] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const [mediaModal, setMediaModal] = useState(false);

    const {
        token: { colorPrimary },
    } = theme.useToken();


    const showModal = async () => {
        setOpen(true);
    };


    const onCancel = () => {
        setOpen(false);
    }


    const laod = async () => {
        try {
            setIsLoading(true);
            const res = await ThemeServices.getTemplatesCategories();

            setCategories([...categories, ...res.categories]);
        } catch (e) {
            message.error(e?.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        laod();
    }, []);


    const onFinish = async () => {

        if (!state) {
            message.error('Please Select the template!');
            return;
        }
        form.validateFields()
            .then(async (values) => {
                try {
                    setIsLoading(true);


                    if (tempURL) {
                        const blob = await (await fetch(tempURL.src)).blob();
                        const file = new File([blob], `${state.name}.png`, { type: "image/png" });
                        const formData = new FormData();
                        formData.append('file', file);

                        const res = await MediaServices.upload('images', formData)
                        if (res.media) {
                            const savedScreenShot = { src: res.media.src, _id: res.media._id, type: res.media.type, name: res.media.name };
                            state.screenShot = savedScreenShot;
                        }
                    }


                    if (state._id) {

                        const res = await ThemeServices.updateTemplate(state, state._id);
                        // onUpdateTemplte(res.template)
                    } else {

                        if (!element)
                            throw new Error("ELement not found.");

                        const currentElement = await getData(element.page._id, element.node._uid);

                        if (!currentElement)
                            throw new Error("ELement not found.");

                        const unique_id = uuid();
                        const body = {
                            "_uid": "0",
                            "tagName": "div",
                            "type": "layout",
                            "layout": "body",
                            "nodeValue": "",
                            childNodes: [unique_id]
                        };
        
                        currentElement._uid = unique_id;
                        currentElement.parent = body._uid;
                        const elements = {};
                        elements["0"] = body;
                        elements[unique_id] = currentElement;
                        await onAddTemplateElements(currentElement, elements);

                        await ThemeServices.saveTemplate({...state, elements});
                    }



                    message.success('Template saved successfully!');
                    setOpen(false);

                  
                } catch (e) {
                    message.error(e?.message || 'Something went wrong');
                } finally {
                    setIsLoading(false);

                }
            })
            .catch((info) => {
                message.error('Validate Failed.');
            });

    };

    const onCategoryChange = (value) => {
        setState({ ...state, categories: value })
    };


    const onChangeImage = (image) => {
        const newImage = image[0];
        setState({ ...state, screenShot: newImage });
        setURL(null);

    }

    const handleAfterOpenChange = (visible) => {


        if (!visible) {

            setState(null);
            form.resetFields();
            setURL(null);

            return;
        }


        if (element?.node?.node && !template) {
            try {
                html2canvas(element.node.node).then(canvas => {
                    const screenshot = canvas.toDataURL();
                    setURL(screenshot);
                });
            } catch (e) {

            }
        } else {
            setState(template);
            form.setFieldsValue(template)
            setURL(null);

        }




    };




    return (
        <>
            <ToolBarButton onClick={showModal}>
                <SaveOutlined style={{ color: colorPrimary }} />
            </ToolBarButton>
            <Modal
                title={`${state?._id ? "Edit" : "Add"} Template`}
                open={open}
                closable
                onCancel={onCancel}
                afterOpenChange={handleAfterOpenChange}
                footer={
                    <div style={{ padding: 5 }}>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button type="primary" onClick={onFinish}>Save</Button>
                    </div>
                }

                modalRender={(modal) => (

                    <div>
                        {modal}
                    </div>

                )}


            >

                <div style={{ height: '60vh', overflow: 'auto' }}>
                    <Form form={form}
                        initialValues={{}}
                        layout="vertical">

                        <Form.Item label="Template Name" name="name"
                            rules={rules.name}
                        >
                            <Input placeholder="Template Name"
                                value={state?.name}
                                onChange={(e) => { e.preventDefault(); setState({ ...state, name: e.target.value }) }}

                            />
                        </Form.Item>

                        <Form.Item label="Template Description" name="desc"
                            rules={rules.desc}
                        >

                            <TextArea
                                value={state?.desc}

                                style={{ height: 100 }}
                                placeholder="Description for the template"


                                onChange={(e) => { e.preventDefault(); setState({ ...state, desc: e.target.value }) }}

                            />

                        </Form.Item>

                        <Form.Item label="Category" name="categories">
                            <Select
                                mode="tags"
                                allowClear
                                placeholder="Please select"
                                onChange={onCategoryChange}
                                loading={isLoading}
                                value={state?.categories}

                            >
                                {categories.map((category) => (
                                    <Select.Option key={category}>{category}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Screen Shot">

                            <Image
                                width="100%"
                                onClick={() => setMediaModal(true)}
                                preview={false}
                                style={{
                                    height: '222px',
                                    width: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'left center',
                                    cursor: 'pointer'
                                }}
                                alt="template-preview"
                                src={state?.screenShot?.src || tempURL}
                                fallback="/images/default/default-img.png" />

                        </Form.Item>

                    </Form>
                </div>
            </Modal>


            <MediaModal open={mediaModal} type={"images"} multiple={false} onClose={() => setMediaModal(false)} srcs={state?.screenShot} onSelect={onChangeImage} />

        </>

    );
};

