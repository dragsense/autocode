

import { useEffect, useState } from "react";
import ComponentList from "./ComponentList";
import { fetcher } from "@/lib/fetch";
import usePageStates, { useComponentsStates } from "@/components/Editor/PageProvider";

import PageServices from "@/lib/services/pages";

export function ComponentComponent() {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [components, setComponents] = useState([]);

    const load = async () => {

        
        try {
            setIsLoading(true);
            setError('');

            const id = localStorage.getItem("project");
            const response = await fetcher('/api/projects/' + id, {
                method: 'GET'
            });


            const  _components = await fetcher(`http://${response.project.domain}:${response.project.port}/api/components`, {
                method: 'Get',
                headers: { 'x-api-key': response.project.apikey  },
            });
            setComponents(_components);
        } catch (e) {
            setError(e?.message);
        } finally {
            setIsLoading(false);
        }

    }

    useEffect( () => {

        load();

    }, []);

    return (
        <div className="outter-box h-100p">
            {components && <ComponentList components={components} />}
        </div>
    );
};


export function PageComponentComponent() {


    const { getAll } = useComponentsStates();

    return (
        <div className="h-100p">
            <ComponentList components={getAll()} />
        </div>
    );
};




