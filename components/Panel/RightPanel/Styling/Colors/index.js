
import { useEffect, useState } from 'react';
import { QuestionCircleFilled } from '@ant-design/icons';
import { Button, Alert, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { fetcher } from "@/lib/fetch";
import ThemeServices from '@/lib/services/theme';

import ColorList from './ColorList';
import AddColor from './Add';


import { useCssNodeStates } from "@/components/Editor/PageProvider";

export function ColorComponent({ }) {

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [_state, _setState] = useState(null);
    const [states, setStates] = useState([]);

    const { document } = useCssNodeStates();

    


    useEffect( () => {

        // try {
        //     setIsLoading(true);
        //     setError('');

        //     const id = localStorage.getItem("project");
        //     const response = await fetcher('/api/projects/' + id, {
        //         method: 'GET'
        //     });

        //     const url = `http://${response.project.domain}:${response.project.port}`;
        //     const apikey = response.project.apikey;
          

        //     const colors = await ThemeServices.getColors(url, apikey);
        //     setStates(colors);

        // } catch (e) {
        //     message.error(e?.message);
        // } finally {
        //     setIsLoading(false);
        // }

    }, []);

    const onAddState = async (state) => {

      
        var foundIndex = states.findIndex(x => x.name === state.name);
        const root = document.documentElement;

        console.log(document)

        const id = localStorage.getItem("project");
        const response = await fetcher('/api/projects/' + id, {
            method: 'GET'
        });

        const url = `http://${response.project.domain}:${response.project.port}`;
        const apikey = response.project.apikey;



        if (foundIndex !== -1) {
            await ThemeServices.updateColor(state, url, apikey);
            states[foundIndex] = state;
            const variable = `--var-${state.name.toLowerCase()}`;
            root.style.setProperty(variable, state.color);
        }
        else {
            await ThemeServices.addColor(state, url, apikey);
            states.push(state);
            const variable = `--var-${state.name.toLowerCase()}`;
            root.style.setProperty(variable, state.color);
        }

        
      
      

        // _setState(state);

    }

    return <div className="inner-box">
            <div className="inner-box border w-100p">
                <div className="wrapper">
                    <div className="inner-box">
                        <h3>{"Colors"} <QuestionCircleFilled /></h3>
                        {error &&

                            <Alert message={error} type="error" showIcon />

                        }
                        <Button type="primary" ghost className="plus font-lg" icon={<PlusOutlined />} onClick={() => _setState({})}> </Button>
                    </div>
                    {_state ? <AddColor _state={_state} onAdd={onAddState} _setState={_setState} /> :
                        <ColorList states={states} _setState={_setState} />}
                </div>
            </div>
        </div>
    
};

