import { Form, Space, Input, Button, Select, Switch, message } from "antd";
import { QuestionCircleFilled, InfoCircleOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useCallback, useEffect } from "react";
import { fetcher } from "@/lib/fetch";

import { isEmpty } from "@/lib/utils";
import ComponentServices from "@/lib/services/components";

const { Option } = Select;

import { RgbaColorPicker } from "react-colorful";


export default function AddColor({ _state, onAdd, _setState }) {

    

    const isState = !isEmpty(_state);
    const [isLoading, setIsLoading] = useState(false);
    const [color, setColor] = useState();
    const [state, setState] = useState(isState ? _state :
        {
            name: '', color: '#000',
        });

    const onChange = (event) => {
        event.preventDefault();

        const value = event.target.value;
        const name = event.target.name;

        setState({ ...state, [name]: value.trim() })
    }

    const onChangeColor = (color) => {
        setColor(color);
        setState({ ...state, color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})` });

    };

    useEffect(() => {

        _setState(state);

    }, [state])


    const onSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            try {

                if (state.name === '')
                    throw new Error("Please insert name")

                setIsLoading(true);
                await onAdd(state);
                _setState(null);
            } catch (e) {
                message.error(e?.message);
            } finally {
                setIsLoading(false);
            }
        },
        [state]
    );

    return (
        <>
            <div className="outter-box">
                <div className="inner-box">
                    <div className="wrapper">
                        <h3>{_state.name ? 'Edit' : 'Create'}</h3>
                        <div className="hr-line"></div>
                        <Form layout="vertical" >

                            <Space direction="vertical" className="wrapper">
                                <Form.Item label="Name" className="font-500">
                                    <Input placeholder="Name" name="name"
                                        onChange={onChange}
                                        value={state.name}
                                        required />
                                </Form.Item>

                                <RgbaColorPicker color={color} onChange={onChangeColor} />;
                            </Space>



                            <Form.Item className="text-right">
                                <Space>
                                    <Button type="default" onClick={() => { _setState(null) }}>Cancel</Button>
                                    <Button type="primary" onClick={onSubmit} loading={isLoading}> Save </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>

                </div>
            </div>
        </>

    );
};

