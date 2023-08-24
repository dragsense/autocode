import { Form, Tooltip, Divider } from "antd";

import {
    QuestionCircleFilled,
} from '@ant-design/icons';


import StateComponent from './State';


export default function ElementComponent({ state }) {

    return (
        <>
            <Form layout="vertical">

                <Divider
                    orientation="center"
                    orientationMargin="0">
                    States
                    <Tooltip title="Dynamic Variables"> <QuestionCircleFilled />
                    </Tooltip>: </Divider>

                <StateComponent
                    states={state.states || {}} />

            </Form>
        </>

    );
};

