

import { useEffect, useState } from "react";
import TemplateList from "./TemplateList";
import { fetcher } from "@/lib/fetch";
import { message, Select, Divider  } from "antd";

import ThemeServices from "@/lib/services/theme";

export function TemplateComponent() {

    const [isLoading, setIsLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [categories, setCategories] = useState(["ALL"]);
    const [category, setCategory] = useState("ALL");


    const laodCategory =async () => {
        try {
            setIsLoading(true);

            const id = localStorage.getItem("project");
            const response = await fetcher('/api/projects/' + id, {
                method: 'GET'
            });

            const url = `http://${response.project.domain}:${response.project.port}`;

            const res2 = await ThemeServices.getTemplatesCategories(url, response.project.apikey);

            setCategories([...categories, ...res2.categories]);

        } catch (e) {
            message.error(e?.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {

        laodCategory();

    }, []);

    const load = async () => {
        try {
            setIsLoading(true);

            const id = localStorage.getItem("project");
            const response = await fetcher('/api/projects/' + id, {
                method: 'GET'
            });

            const url = `http://${response.project.domain}:${response.project.port}`;

            const res1 = await ThemeServices.getTemplates(url, response.project.apikey, category);

            setTemplates(res1.elements);

        } catch (e) {
            message.error(e?.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {

        load();

    }, [category]);

    const onChange = (value) => {
        setCategory(value);
    };

    return (
        <div className="outter-box h-100p">
            <div className="inner-box border">
                <div className="wrapper">
                    <div className="inner-box">
                        <h1> Templates </h1>

                    </div>
                    <Select
                        placeholder="Select Category"
                        onChange={onChange}
                        style={{width: '100%'}}

                        options={categories.map(cat => { return { value: cat } })}
                    />
                   
                    <Divider />

                    {templates && <TemplateList templates={templates} />}

                </div>
            </div>

        </div>
    );
};






