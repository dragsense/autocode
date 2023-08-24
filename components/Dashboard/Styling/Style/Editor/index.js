import React, { useState } from 'react';

import { Layout, Button } from 'antd';

const { Content } = Layout;


import LeftSideBar from './LeftSideBar';
import RigthSideBar from './RightSideBar';




export default function StyleEditor({
    state,
    onEdit,
    onDelete,
    onSubmit,
    onChange,
    isChange,
    onSelect,
    children }) {




    return <Layout style={{ minHeight: '80vh' }}>



        <LeftSideBar onEdit={onEdit} elementType={state.elementType[1]} />
        <Content style={{ position: 'relative', flex: 1, minxWidth: 'calc(100% - 430px)' }}>

            {children}
        </Content>

        {state.elementType[1] !== 'default' && <RigthSideBar
            selector={state.selector}
            onSelect={onSelect}
            onDelete={onDelete}
            onChange={onChange}
            onSubmit={onSubmit}
            selectorKey={state.elementType}
        >
            <div style={{ textAlign: 'right', marginTop: 10, padding: 10 }}>
                <Button type="primary" onClick={(e) => {
                    e.preventDefault();
                    onSubmit(state.selector);
                }

                } loading={state.loading} disabled={!isChange}> Update </Button>
            </div>
        </RigthSideBar>}


    </Layout>


}

