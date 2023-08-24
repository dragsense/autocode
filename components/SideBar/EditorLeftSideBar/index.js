import React, { useState, useEffect } from 'react';
import { Menu, Collapse, Layout } from 'antd';
import { MdFileCopy, MdWidgets, MdPermMedia, MdArrowLeft, MdOutlineEmail } from 'react-icons/md';
import { FaCoins, FaRegEdit   } from 'react-icons/fa';
import { BsCodeSlash, BsFillFileEarmarkTextFill } from 'react-icons/bs';
import { CgTemplate } from 'react-icons/cg';

const { Sider } = Layout;
const { Panel } = Collapse;

import { PageComponent } from '../../Panel/LeftPanel/Page';
import { TagComponent } from '@/components/Panel/LeftPanel/Tag';
import { usePageStates } from '@/components/Editor/PageProvider';

const menuKeys = ['pages', 'tags', 'components', 'collections', 'forms', 'templates'];

const EditorLeftSideBar = ({ }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [openKeys, setOpenKeys] = useState([]);
    const [keys, setKeys] = useState(menuKeys);
    const { onEdit, state } = usePageStates();

    useEffect(() => {
        const _id = localStorage.getItem('activePage');
        const type = localStorage.getItem('pageType');

       //onEdit({ _id }, type);
        setSelectedKeys([type + 's']);
    }, []);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const onEditPage = (page, type) => {
        onEdit(page, type);
        setSelectedKeys([type + 's']);
    };

    const handleSubMenuOpenChange = (keys) => {
        setOpenKeys(keys.slice(-1));
        setKeys(keys.length > 0 ? [keys[keys.length - 1]] : menuKeys);
    };

    return (
        <Sider width={200} collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
            <Menu
               
                mode="inline"
                selectedKeys={selectedKeys}
                defaultSelectedKeys={selectedKeys}
                openKeys={openKeys}
                style={{ height: '100%', overflow: 'auto' }}
                onOpenChange={handleSubMenuOpenChange}
            >
                {keys.includes('pages') && (
                    <Menu.SubMenu icon={<MdFileCopy size="1.5em" />} key="pages" title="Pages">
                        <PageComponent type={'page'} page={state.page} onEdit={onEditPage} />
                    </Menu.SubMenu>
                )}

                {keys.includes('components') && (
                    <Menu.SubMenu icon={<MdWidgets size="1.5em" />} key="components" title="Components">
                        <PageComponent type={'component'} page={state.page} onEdit={onEditPage} />
                    </Menu.SubMenu>
                )}

                {keys.includes('collections') && (
                    <Menu.SubMenu icon={<FaCoins size="1.5em" />} key="collections" title="Collections">
                        <PageComponent type={'collection'} page={state.page} onEdit={onEditPage} />
                    </Menu.SubMenu>
                )}

                {keys.includes('forms') && (
                    <Menu.SubMenu icon={<FaRegEdit size="1.5em" />} key="forms" title="Forms">
                        <PageComponent type={'form'} page={state.page} onEdit={onEditPage} />
                    </Menu.SubMenu>
                )}

                {keys.includes('templates') && (
                    <Menu.SubMenu icon={<BsFillFileEarmarkTextFill size="1.5em" />} key="templates" title="Templates">
                        <PageComponent type={'template'} page={state.page} onEdit={onEditPage} />
                    </Menu.SubMenu>
                )}


                {keys.includes('tags') && (
                    <Menu.SubMenu icon={<BsCodeSlash size="1.5em" />}
                        key="tags"
                        title="Tags">
                        <TagComponent gridStyle={{ width: '100%', textAlign: 'center' }} />

                    </Menu.SubMenu>)}



                {/* <Menu.Item key="3" icon={<MdOutlineEmail size="1.5em" className='ac-icon1' />} onClick={() => setActive('2')}>
                    Form Components
                </Menu.Item>
              
                <Menu.Item key="4" icon={<CgTemplate size="1.5em" className='ac-icon1' />} onClick={() => setActive('4')}>
                    Templates
                </Menu.Item>
                <Menu.Item key="5" icon={<BsCodeSlash size="1.5em" className='ac-icon1' />} onClick={() => setActive('5')}>
                    Tags
                </Menu.Item>
                <Menu.Item key="6" icon={<FaCoins size="1.5em" className='ac-icon1' />} onClick={() => setActive('6')}>
                    Collections
                </Menu.Item>
                <Menu.Item key="7" icon={<MdPermMedia size="1.5em" className='ac-icon1' />} onClick={() => setActive('7')}>
                    Media
                </Menu.Item>
                <Menu.Item key="8" icon={<MdArrowLeft size="1.5em" className='ac-icon1' />} onClick={() => setActive('8')}>
                    Hide
                </Menu.Item> */}
            </Menu>

        </Sider>
    );
}

export default EditorLeftSideBar;