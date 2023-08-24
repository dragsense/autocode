
import { fetcher } from "@/lib/fetch";

import PageList from "./PageList";
import { Alert } from 'antd';
import { useEffect, useReducer, useState } from "react";
import ThemeServices from '@/lib/services/theme';


const initial = {
    pages: [],
    page: null,
    total: 0,
    error: '',
    loading: false
}

const LIMIT = 10;


const reducer = (state, action) => {

    const deleteTemplate = () => {
        let index = state.pages.findIndex(template => template._id === action.id);
        if (index !== -1) {
            state.pages.splice(index, 1);
        }
    }

    const updateTemplate = () => {
        let index = state.pages.findIndex(template => template._id === action.template._id);
        if (index !== -1) {
            state.pages[index] = action.template;
        }
    }

    switch (action.type) {
        case "start":
            return { ...state, loading: true }
        case "load":
            return {
                ...state, pages: action.data, total: action.total,
                error: ''
            }
        case "delete":
            deleteTemplate();
            return {
                ...state, pages: [...state.pages], total: state.total - 1,
                error: ''
            }

            case "update":
                updateTemplate();
                return {
                    ...state, pages: [...state.pages],
                    error: ''
                }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};

export function Pages({ type, selectedPage, onEdit }) {

    const [state, dispatch] = useReducer(reducer, initial);
    const [page, setPage] = useState(1);


    const laod = async () => {
        try {

            dispatch({ type: 'start' });

            const projectId = localStorage.getItem("project");
            const response = await fetcher('/api/projects/' + projectId, {
                method: 'GET'
            });

            const project = response.project;


            const res = await fetcher(`${project.url}/api/${type}s?limit=${LIMIT}&page=${page}`, {
                method: 'Get',
                headers: { 'x-api-key': project.apikey },
            });

            const data = Array.isArray(res[type + 's']) ? res[type + 's'] : [];

            dispatch({ type: 'load', data, total: res.total });


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

            dispatch({ type: 'finish' });

        }
    }

    useEffect( () => {
        laod();

    }, [page]);


    const onDelete = async (id) => {

        try {
            dispatch({ type: 'start' });

            await ThemeServices.deleteTemplate(id);

            dispatch({ type: 'delete', id });

            if (selectedPage?._id == id)
                onEdit(null, '');



        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            dispatch({ type: 'finish' });
        }

    }



    async function onUpdateTemplte(template) {

        try {
            dispatch({ type: 'update', template });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {

        }

    }



    return <div style={{ padding: 5 }}>

        {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}



        <PageList
            selectedPage={selectedPage}
            state={state}
            onDelete={onDelete}
            onEdit={onEdit}
            type={type}
        />

        {state.total > (page * LIMIT) && <Button disabled={state.loading} loading={state.loading} onClick={(e) => {
            e.preventDefault();
            setPage(page + 1);
        }}> Load More </Button>}



    </div>

};



