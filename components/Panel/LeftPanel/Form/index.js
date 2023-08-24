
import { fetcher } from "@/lib/fetch";
import { useEffect, useState } from "react";
import { Card } from "antd";
import FormList from "./FormList";

export function FormComponent({ user }) {


    const [forms, setForms] = useState([]);

    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const load = async () => {
        try {
            setError('');
            setIsLoading(true);
            const id = localStorage.getItem("project");
            const response = await fetcher('/api/projects/' + id, {
                method: 'GET'
            });


            const  _forms = await fetcher(`http://${response.project.domain}:${response.project.port}/api/forms`, {
                method: 'GET',
                headers: { 'x-api-key': response.project.apikey },
            });


            setForms(_forms)

        } catch (e) {
            setError(e?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
    
        load();
    }, []);

    return (
    
            <div className="h-100p">
              {forms && <FormList user={user} forms={forms} setForms={setForms} />}
            </div>
        
    );
};


