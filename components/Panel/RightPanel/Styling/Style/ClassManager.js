import React, { useState, useEffect, useRef } from 'react';
import { Tag, Input, Button, Tooltip, AutoComplete } from 'antd';
import { PlusOutlined, CloseOutlined, EditOutlined, MinusCircleOutlined } from '@ant-design/icons';
import usePageStates, { useNodeStates, useCssNodeStates } from "@/components/Editor/PageProvider";
import AddCondition from '../../Setting/Element/Condition/Add';

export default function ClassManager({ states }) {


    const { node, setCurrentNode } = useNodeStates();
    const { modify } = usePageStates();
    const { getClasses } = useCssNodeStates();
    const [classes, setClasses] = useState([]);
    const [showCondition, setShowCondition] = useState(null);
    const [condition, setCondition] = useState(null);

    const input = useRef();
    const editInput = useRef();

    const [state, setState] = useState({
        tags: [],
        inputVisible: false,
        inputValue: '',
    });


    useEffect( () => {
        const _classes =  getClasses().map(sel => sel.name);


        setClasses([]);
    }, []);



    useEffect(() => {

        if (!node)
            return;


        if (!node.element.classes)
            node.element.classes = [];

        const classes = node.element.classes;

        setState({ ...state, tags: classes })


    }, [node]);

    const handleClose = removedTag => {
        const tags = state.tags.filter(tag => tag !== removedTag);
        node.element.classes = tags.map(tag => tag);
        modify();
        setState({ ...state, tags });
    };

    const showInput = () => {

        setState({ ...state, inputVisible: !state.inputVisible });
    };

    const handleInputChange = e => {
        setState({ ...state, inputValue: e.target.value });
    };

    const handleInputConfirm = () => {
        const { inputValue } = state;
        let { tags } = state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, { value: inputValue, condition }];
            node.element.classes.push({ value: inputValue, condition });

            if (classes.indexOf(inputValue) === -1)
                classes.push({ value: inputValue });
                modify();
        }

        setState({
            ...state,
            tags,
            inputVisible: false,
            inputValue: '',
        });
        setCondition(null);
        setShowCondition(null);

        

    };


    const onAdd = (state) => {

        setCondition(state);
        setShowCondition(null);

    }


    const onRemove = () => {
        setCondition(null);
    }


    const { tags, inputVisible, inputValue } = state;
    return (
        <>
            {tags.map((tag, index) => {
                const isLongTag = tag.value.length > 20;

                const tagElem = (
                    <Tag
                        className="edit-tag"
                        key={tag.value}
                        closable={index !== -1}
                        onClose={() => handleClose(tag)}
                        color={tag.condition ? '#19274b' : '#bdbdbd'}
                    >
                        <span >
                            {isLongTag ? `${tag.value.slice(0, 2)}...` : tag.value}
                        </span>
                    </Tag>
                );
                return isLongTag ? (
                    <Tooltip title={<span>{tag.value} <br />
                        {tag.condition && <> cond: <b>{tag.condition.key} </b>
                            <em>{tag.condition.type}</em>
                            {tag.condition.value} </>}</span>} key={tag.value}>
                        {tagElem}
                    </Tooltip>
                ) : (
                    <Tooltip title={<span>
                        {tag.condition && <> cond: <b>{tag.condition.key} </b>
                            <em>{tag.condition.type}</em>
                            {tag.condition.value} </>}</span>} key={tag.value}>
                        {tagElem}
                    </Tooltip>
                );
            })}
            {inputVisible && <>

                <AutoComplete
                    options={classes}
                    filterOption={(inputValue, option) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    disabled={showCondition}
                >
                    <Input
                        ref={input}
                        type="text"
                        size="small"
                        style={{ width: '100%', marginBottom: 10 }}
                        className="tag-input"
                        value={inputValue}
                        
                        onChange={handleInputChange}
                        onPressEnter={handleInputConfirm}
                    />
                </AutoComplete>


                {showCondition ?
                    <AddCondition states={states} onAdd={onAdd} _setState={setShowCondition} _state={condition} />

                    : <>

                        {condition && <div style={{ paddingBottom: 10 }}>
                            cond: <b>{condition.key} </b> <em>{condition.type}</em> {condition.value} &nbsp;

                            <MinusCircleOutlined onClick={() => onRemove()} />
                        </div>}

                        <Button type="dashed" onClick={() => { setShowCondition(true); }} icon={<PlusOutlined />}>
                            {condition ? 'Edit' : 'Add'} Condition
                        </Button> <Button type="ghost" onClick={showInput} icon={<CloseOutlined />}>
                            Cancel
                        </Button>
                    </>}</>
            }
            {node && !inputVisible && (
                <Tag className="site-tag-plus" onClick={showInput}>
                    <PlusOutlined /> New Class
                </Tag>
            )}
        </>
    );

}
