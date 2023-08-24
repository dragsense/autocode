import React, { Children, useEffect, useRef, useState } from "react";

import { Input, Form, Popover, Button, Divider } from "antd";

import Others from "./Others";
import { ArrowLeftOutlined, MoreOutlined } from "@ant-design/icons";
import ClassManager from "./ClassManager";
export default function ElementSetting({ cascaderStates, state, setState,
    setIsChange }) {




    const onChnageAttribute = (key, value) => {

        if (!state.attributes) {
            state.attributes = {};
        }


        if (!value) {
            onRemove(key);
        } else {
            state.attributes[key] = {key, value};
            setState({ ...state });
        }

        setIsChange(true);


    }


    const onRemove = (key) => {

        if (state.attributes[key]) {
            delete state.attributes[key];
        }
        setState({ ...state });


    }

    const onChange = e => {
        e.preventDefault();

        const value = e.target.value;
        const name = e.target.name;

        setState({ ...state, [name]: value });

        setIsChange(true);
    };


    return <Form layout="vertical">
        <Form.Item label="Name" className="font-500">
            <Input placeholder="Element Name" name="name"
                onChange={onChange}
                value={state.name}
            /> </Form.Item>
        <Form.Item label="Element ID">
            <Input value={state.attributes['id']?.value} name="id" placeholder="ID" onChange={(e) => { e.preventDefault(); onChnageAttribute('id', e.target.value) }} />
        </Form.Item>


        {state.tagName == 'a' && <Form.Item label="Custom Link">
            <Input value={state.attributes['href']?.value} placeholder="href" name="href" onChange={(e) => { e.preventDefault(); onChnageAttribute('href', e.target.value) }} />
        </Form.Item>
        }

        {state.tagName == 'img' || state.tagName == 'video' && <Form.Item label="Custom src">
            <Input value={state.attributes['src']?.value} placeholder="src" name="src" onChange={(e) => { e.preventDefault(); onChnageAttribute('src', e.target.value) }} />
        </Form.Item>
        }

        <Popover
            placement="left"
            title={"Others"}
            content={<Others state={state}
                attributes={state.attributes}
                onChnageAttribute={onChnageAttribute}
                onRemove={onRemove} />}
            trigger="click">
            <Button type="text" icon={<ArrowLeftOutlined />} > More </Button>

        </Popover>
        <br/>
        <br/>

        <Form.Item label="Element Classes">
            <ClassManager element={state} cascaderStates={cascaderStates} setIsChange={setIsChange} />
        </Form.Item>









    </Form>


}

