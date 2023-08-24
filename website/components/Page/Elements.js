import React from 'react';
import ElementWrapper from './ElementWrapper';


function TreeNode(props) {

    let { pages, _uid, _states, _props, colStates, _id } = props;
    const node = pages[_id].elements[_uid];

    const children = node.childNodes.map((key, i) => <MemoizedTreeNode
        {...props}
        _uid={key}
        _id={_id}
        key={key}
        colStates={colStates}
        _states={_states}
        _props={_props}
    />)

    return (<ElementWrapper key={_uid}
        {...props}
        component={node.component}
        customPath={node.customPath}
        form={node.form}
        _id={_id}
        colStates={colStates}
        _states={_states}
        _props={_props}
        node={node}
    >
        {children}
    </ElementWrapper>);
}

const MemoizedTreeNode = React.memo(TreeNode, (prevProps, nextProps) => {
    const states = prevProps._states === nextProps._states &&
        prevProps._props === nextProps._props &&
        prevProps.formStates === nextProps.formStates &&
        prevProps.colStates === nextProps.colStates
    return states;
});

export default function Elements({ setting, pages, _uid, _id }) {

    return <MemoizedTreeNode
        setting={setting}
        _states={pages[_id].states}
        pages={pages}
        _id={_id}
        _uid={_uid}

    />
}