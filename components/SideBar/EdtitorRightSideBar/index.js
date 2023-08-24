import React, { useState, useEffect } from 'react';
import { Menu, Layout, Button, theme } from 'antd';

import { RiSettings3Line, RiEditLine, RiLayoutGridFill } from 'react-icons/ri';
import { AiOutlineFontSize, AiOutlineForm } from 'react-icons/ai';
import { BiCollection, BiMenu } from 'react-icons/bi';


const { Sider } = Layout;
const menuKeys = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6', 'sub7'];

//'sub2', 'sub3', 'sub4', 'sub5', 'sub6', 'sub7']

import Navigator from '@/components/Panel/RightPanel/Navigator';
import Element from '@/components/Panel/RightPanel/Setting/Element';
import Collection from '@/components/Panel/RightPanel/Setting/Collection';
import Component from '@/components/Panel/RightPanel/Setting/Component';
import Form from '@/components/Panel/RightPanel/Setting/Form';
import Styling from '@/components/Panel/RightPanel/Setting/Styling';
import { generateCascader, generateCascaderCollStates } from '@/lib/utils/elementNode';
import { getAllData, getData } from '@/lib/utils/db';

import Content from '@/components/Panel/RightPanel/Setting/Content';
import { usePageStates } from "@/components/Editor/PageProvider"

const iconMap = {
    sub1: <BiMenu size="1.5em" />,
    sub2: <RiLayoutGridFill size="1.5em" />,
    sub3: <RiSettings3Line size="1.5em" />,
    sub4: <RiEditLine size="1.5em" />,
    sub5: <BiCollection size="1.5em" />,
    sub6: <AiOutlineForm size="1.5em" />,
    sub7: <AiOutlineFontSize size="1.5em" />
};


let globalStates = [
    {
        label: "GLOBAL", value: "GLOBAL", type: "GLOBAL", children: [
            {
                label: "WEBSITE", value: "WEBSITE",
                children: [

                    {
                        label: 'TITLE',
                        value: 'title'
                    },
                    {
                        label: 'Tag Line',
                        value: 'tagline'
                    },
                    {
                        label: 'DESCRIPTION',
                        value: 'desc'
                    },
                    {
                        label: 'Author',
                        value: 'author'
                    },
                    {
                        label: "IMAGES", value: "images",
                        children: [
                            {
                                label: 'Favicon',
                                value: 'favicon'
                            },
                            {
                                label: 'Mobile Logo',
                                value: 'mobile-logo'
                            },
                            {
                                label: 'Logo',
                                value: 'logo'
                            },
                            {
                                label: 'Placeholder',
                                value: 'placehodler'
                            }
                        ]

                    },


                ]
            },
            { type: 'array', label: "PAGES", value: "PAGES" },
            {
                label: "PAGE", value: "PAGE",
                children: [
                    {
                        label: 'TITLE',
                        value: 'title'
                    },
                    {
                        label: 'DESCRIPTION',
                        value: 'desc'
                    },
                    {
                        label: 'CONTENT',
                        value: 'content'
                    },
                    {
                        label: 'Excerpt',
                        value: 'excerpt'
                    },
                    {
                        label: 'IMAGE',
                        value: 'image'
                    },
                    {
                        label: 'STATUS',
                        value: 'status'
                    },
                    {
                        label: 'Creator',
                        value: 'creator'
                    },
                    {
                        label: 'Created At',
                        value: 'createdAt'
                    },
                    {
                        label: 'URL',
                        value: 'url'
                    },
                ]
            },
            {
                label: 'Query',
                value: 'query'
            },
        ]
    },
    { label: 'MAPINDEX', value: 'MAPINDEX' },
    { label: 'MAPVALUE', value: 'MAPVALUE' }

]

const EditorRightSideBar = ({ onClickNavigator,
    onUpdate,
    onSelectSelector,
    onDeleteSelector,
    onUpdateSelector,
    onMove,
    onCopy,
    onDelete,
    state }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState([]);
    const [keys, setKeys] = useState(menuKeys);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handleSubMenuOpenChange = (keys) => {
        setOpenKeys(keys.slice(-1));
        setKeys(keys.length > 0 ? [keys[keys.length - 1]] : menuKeys);
    };

    const {
        token: { colorPrimary, colorError, },
    } = theme.useToken();

    const [cascaderStates, setCascaderStates] = useState(globalStates);

    useEffect(() => {

        if (state.pageUpdated !== 1)
            return;


        const fetchData = async () => {
            const _id = state.page._id;
            const node = await getAllData(_id);

            if (node.states) {


                let states = [];

                if (state.type === 'form') {
                    let tempStates = [];
                    Object.values(node.states).map(async (state, idx) => {

                        const current = {
                            type: state.type, label: state.key.toUpperCase(), value: state.key,
                            children: [
                                {
                                    label: "KEY", value: 'key',
                                },
                                {
                                    label: 'VALUE', value: 'defaultValue',
                                },
                                {
                                    label: 'ERRORMSG', value: 'errorMessage',
                                },
                                {
                                    label: 'ERROR', value: 'error',
                                },
                            ]
                        }
                        tempStates = [...tempStates, current];

                    });

                    const current = {
                        label: 'SETTING', value: '__setting__',
                        children: [
                            {
                                label: 'SUCCESSMSG', value: 'successMessage',
                            },
                            {
                                label: "SUCCESS", value: 'success',
                            },
                            {
                                label: 'ERRORMSG', value: 'errorMessage',
                            },
                            {
                                label: 'ERROR', value: 'error',
                            },
                        ]
                    }
                    tempStates = [...tempStates, current];

                    states = [{
                        type: 'array', label: 'FORMSTATES', value: 'FORMSTATES',
                        children: [

                            ...tempStates]
                    }]
                }
                else
                    states = node.states ? generateCascader(node.states, "STATES") : states


                if (node.collection) {
                    const collection = await getAllData(node.collection._id);


                    if (collection) {


                        const defaultValues = [{ label: '_ID', value: '_id' },
                        { label: 'NAME', value: 'name' },
                        {
                            label: 'SLUG', value: 'slug',
                        },
                        {
                            label: 'CREATOR', value: 'creator',
                        },
                        {
                            label: 'URL', value: 'url',
                        },
                        {
                            label: 'DATE', value: 'createdAt',
                            children: [
                                { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
                                { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
                                { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
                                { label: "YYYY/MM/DD", value: "YYYY/MM/DD" },
                                { label: "Month D, YYYY", value: "MMMM D, YYYY" },
                                { label: "D MMM, YYYY", value: "D MMM, YYYY" },
                                { label: "MMMM DD, YYYY", value: "MMMM DD, YYYY" },
                                { label: "DD MMM, YYYY", value: "DD MMM, YYYY" },

                            ]
                        },
                        {
                            label: 'SETTING', value: 'SETTING',
                            children: [
                                {
                                    label: 'TITLE', value: 'title',
                                },
                                {
                                    label: 'DESC', value: 'desc',
                                },
                                {
                                    label: 'EXCERPT', value: 'excerpt',
                                },
                                {
                                    label: 'CONTENT', value: 'content',
                                },
                                {
                                    label: 'IMAGE', value: 'image',
                                }
                            ]
                        }

                        ];

                        let tempStates = [];
                        let tempRelations = [];
                        await Promise.all(collection.relationships.map(async (relation, idx) => {
                            const relationship = await getAllData(relation._id);

                            if (relationship) {

                                const current = generateCascader(
                                    relationship.states,
                                    relationship.name.toUpperCase());
                                current[0].value = "STATES" + idx;
                                tempStates = [...tempStates, ...current];
                            }

                        }));




                        const relStates = [
                            {
                                type: 'array', label: 'RELATIONS', value: 'RELATIONS',
                                children: [...defaultValues, ...tempStates]
                            },
                            {
                                type: 'array', label: 'RELATIONSHIPS', value: 'RELATIONSHIPS',
                                children: collection.relationships.map((rel, idx) => {
                                    return {
                                        label: rel.name.toUpperCase(),
                                        value: idx,
                                        children: [
                                            { label: '_ID', value: '_id' },
                                            { label: 'NAME', value: 'name' },
                                            { label: 'SLUG', value: 'slug' }
                                        ]
                                    }
                                })
                            },
                            {
                                type: 'array', label: 'PAGES', value: 'PAGES',
                                children: [{ label: 'INDEX', value: 'index' }
                                ]
                            },
                        ];


                        const collStates = collection.states ?
                            generateCascaderCollStates({
                                docsLength: 0,
                                loading: 0,
                                maxPage: 0,
                                states: collection.states,
                            }, "COLSTATES") : []



                        if (collStates.length > 0) {
                            collStates[0].children = [
                                ...defaultValues,
                                { type: 'array', label: 'DOCUMENTS', value: 'DOCUMENTS' },
                                ...collStates[0].children, ...relStates, { label: 'PAGE', value: 'page' },
                                { label: 'LIMIT', value: 'limit' }
                            ]
                        }
                        states = [...states, ...collStates]
                    }
                }

                const props = node.props ? generateCascader(node.props, "PROPS") : []

                if (node.type === 'collection') {

                    const children = [
                        { label: '_ID', value: '_id' },
                        { label: 'Slug', value: 'slug' },
                        { label: 'NAME', value: 'name' },
                        { label: 'Title', value: 'title' },
                        { label: 'Image', value: 'image' },
                        { label: 'url', value: 'url' },

                    ]

                    const navStates = [
                        {
                            label: 'NEXTDOCUMNET', value: 'NEXTDOCUMNET',
                            children
                        },
                        {
                            label: 'PREVDOCUMNET', value: 'PREVDOCUMNET',
                            children
                        }
                    ]

                    if (globalStates[0].children)
                        globalStates[0].children.push(...navStates);
                    else
                        globalStates[0].children = navStates;


                }

                setCascaderStates([...globalStates, ...props, ...states]);

            } else
                setCascaderStates(globalStates);
        }

        fetchData();

    }, [state.pageUpdated]);

    useEffect(() => {

        if (!state.node)
            return;


        if (state.node.type === 'component') {
            const findIndeex = cascaderStates.findIndex(state => state.value === 'STATES');
            if (findIndeex !== -1) {

                cascaderStates[findIndeex].label = 'PROPS'
                cascaderStates[findIndeex].value = 'PROPS'
                cascaderStates[findIndeex].type = 'PROPS'
            }
            let states = state.node.states ? generateCascader(state.node.states, "STATES") : []
            setCascaderStates([...cascaderStates, ...states]);

        }

    }, [state.node]);


    return (
        <Sider
            width={280}
            theme="light"
            reverseArrow={true}
            collapsible collapsed={collapsed}
            onCollapse={toggleCollapsed}
        >

            <Menu
                theme="light"
                mode="inline"
                direction="rtl"
                openKeys={openKeys}
                style={{ height: '100%', overflow: 'auto', background: colorPrimary }}
                onOpenChange={handleSubMenuOpenChange}
            >
                {keys.map((key) => {
                    return (
                        <Menu.SubMenu
                            icon={iconMap[key]}
                            key={key}
                            title={key === 'sub1' ? 'Navigator' :
                                key === 'sub2' ? 'Component' :
                                    key === 'sub3' ? 'Element' :
                                        key === 'sub4' ? 'Content' :
                                            key === 'sub5' ? 'Collection' :
                                                key === 'sub6' ? 'Form' :
                                                    key === 'sub7' ? 'Styling' : null}
                        >
                            <div style={{ padding: '10px 15px 10px 10px' }}>
                                {key === 'sub1' ? <Navigator
                                    onMove={onMove}
                                    onCopy={onCopy}
                                    onDelete={onDelete}
                                    onClickNavigator={onClickNavigator}
                                    state={state} /> :
                                    key === 'sub2' ? (state.node && <Component state={state} cascaderStates={cascaderStates} />) :
                                        key === 'sub3' ? (state.node && <Element state={state} onUpdate={onUpdate} cascaderStates={cascaderStates} />) :
                                            key === 'sub4' ? (state.node && <Content state={state} onUpdate={onUpdate} cascaderStates={cascaderStates} />) :
                                                key === 'sub5' ? (state.node && <Collection state={state} onUpdate={onUpdate} cascaderStates={cascaderStates} />) :
                                                    key === 'sub6' ? (state.node && <Form state={state} onUpdate={onUpdate} cascaderStates={cascaderStates} />) :
                                                        key === 'sub7' ? (state.node && <Styling
                                                            onDeleteSelector={onDeleteSelector}
                                                            onUpdateSelector={onUpdateSelector}
                                                            state={state}
                                                            onSelectSelector={onSelectSelector} />) : null}
                            </div>
                        </Menu.SubMenu>
                    );
                })}
            </Menu>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
                <Button type="primary">
                    Preview
                </Button>
            </div>
        </Sider>
    );
};

export default EditorRightSideBar;