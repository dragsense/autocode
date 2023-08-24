import { useState, useEffect } from "react";
import { useComponentsStates } from "@/components/Editor/PageProvider";

import { fetcher } from "@/lib/fetch";
import Navigator from "./Navigator";
import ComponentSetting from "./Setting/Component";
import NodeSetting from "./Setting/Element";
import SwitchComponents from "..";
import Styling from "./Styling";



const generateCascader = (state) => {
    let children = null;

    if (state.type === 'OBJECT')
        children = state.defaultValue.map(value => { return { label: value.key, value: value.key } });
    else if (state.type === 'ARRAY OBJECT') {
        const root = state.defaultValue[0];
        const child = root.defaultValue;
        children = [{ label: root.key, value: root.key, children: child.map(value => { return { label: value.key, value: value.key } }) }];
    }
    else if (state.type === 'ARRAY')
        children = state.defaultValue.map((value, index) => { return { label: index, value: index } });
    else
        children = undefined;


    return {
        label: state.key, value: state.key, type: state.type, children
    }
}

export default function RightPanel({ active }) {

    const [states, setStates] = useState([]);

    const [customPaths, setCustomPaths] = useState([]);

    const { getCurrentComponent } = useComponentsStates();

    useEffect( () => {

        // const id = localStorage.getItem("project");
        // const response = await fetcher('/api/projects/' + id, {
        //     method: 'GET'
        // });

        // const url = `http://${response.project.domain}:${response.project.port}`;
        // const apikey = response.project.apikey;


        // const compPaths = await fetcher(`${url}/api/components/path`, {
        //     method: 'GET',
        //     headers: { 'x-api-key': apikey },
        // })

        // setCustomPaths(compPaths);


        // if (!getCurrentComponent())
        //     return;

        // const _options = getCurrentComponent().states;
        // setStates(_options.map(state => generateCascader(state)));


    }, [getCurrentComponent()]);




    return (<></>
        // <SwitchComponents active={active}>
        //     <Navigator index='1' />
        //     <ComponentSetting index='2'
        //         states={states}  />
        //     <NodeSetting index='3'
        //         customPaths={customPaths}
        //         states={states} />
        //     <Styling index="4" states={states} />
        //     <div index="5" ></div>
        // </SwitchComponents>
    );
};