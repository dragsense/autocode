import { Layout } from 'antd';


import NavLayout from './NavLayout';

const EditorLayout = ({
    children,
    user
}) => {

    return (
        <NavLayout user={user}>
            <Layout style={{ marginTop: 0, minHeight: 'calc(100vh - 56px)' }}>
                {children}
            </Layout>
        </NavLayout>
    );
};

export default EditorLayout;
