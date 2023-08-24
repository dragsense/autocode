import { Layout, Button, theme } from 'antd';
import Nav, { EditorNav } from '../Nav';
import Link from 'next/link'
const { Header, Content } = Layout;

const NavLayout = ({
    children,
    user

}) => {

    const {
        token: { colorBgLayout },
    } = theme.useToken();


    return (
        <>
            <Header className="header" style={{ background: colorBgLayout }}><Nav user={user} /></Header>
            {children}
        </>
    );
};

export default NavLayout;


export const EditorNavLayout = ({
    undo,
    redo,
    onSubmit,
    state,
    windowWidth,
    setWindowWidth,
    minMax,
    setMinMax,
    orientation,
    setOrientation,
    children,
}) => {

    const {
        token: { colorBgContainer, colorPrimaryBg },
    } = theme.useToken();




    return (<>

        <Content style={{ flex: 1, position: 'relative', maxWidth: 'calc(100%)' }}>

                

            <Header className="header" style={{ background: colorBgContainer, zIndex: 100 }}>
                <EditorNav
                    onSubmit={onSubmit}
                    undo={undo}
                    redo={redo}
                    state={state}
                    minMax={minMax}
                    setMinMax={setMinMax}
                    orientation={orientation}
                    setOrientation={setOrientation}
                    windowWidth={windowWidth}
                    setWindowWidth={setWindowWidth} />
            </Header>

            {children}

        </Content>

    </>
    );
};
