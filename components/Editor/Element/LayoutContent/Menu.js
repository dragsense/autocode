import React, { useState } from 'react';
import { Tree, Button, Popconfirm, Modal, Form, Popover, Input, message, theme } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
const { TreeNode } = Tree;
const { confirm } = Modal;

const MenuTree = ({ children, node, onSave }) => {



    const {
        token: { colorPrimary, colorError, },
    } = theme.useToken();

    const [form] = Form.useForm();
    const [gData, setGData] = useState(node.menus || []);


    const [selectedKeys, setSelectedKeys] = useState([]);
    const [editingNode, setEditingNode] = useState(null);

    const onDragEnter = (info) => {
        console.log(info);
        // expandedKeys 需要受控时设置
        // setExpandedKeys(info.expandedKeys)
    };

    const onDrop = (info) => {

        // Get the target node and its depth

        const targetDepth = info.node.pos.split('-').length - 1;

        // Check if the target depth exceeds the maximum allowed depth
        if (targetDepth >= 3) {
            message.error('Cannot add more than 3 levels of nesting');
            return;
        }


        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        const loop = (data, key, callback) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data);
                }
                if (data[i].children) {
                    loop(data[i].children, key, callback);
                }
            }
        };
        const data = [...gData];

        // Find dragObject
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });
        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert 示例添加到头部，可以是随意位置
                item.children.unshift(dragObj);
            });
        } else if (
            (info.node.props.children || []).length > 0 &&
            // Has children
            info.node.props.expanded &&
            // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert 示例添加到头部，可以是随意位置
                item.children.unshift(dragObj);
                // in previous version, we use item.children.push(dragObj) to insert the
                // item to the tail of the children
            });
        } else {
            let ar = [];
            let i;
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }
        setGData(data);
    };

    const onSelect = (selectedKeys, info) => {
        setSelectedKeys(selectedKeys);
    };

    const onEditModalOk = () => {

        form.validateFields().then((values) => {

            const newMenu = {
                title: values.title,
                link: values.link,
                target: values.target,
            };

            function updateNodeByKey(data, key, updates) {
                return data.map((node) => {
                    if (node.key === key) {
                        return {
                            ...node,
                            ...updates,
                        };
                    } else if (node.children) {
                        return {
                            ...node,
                            children: updateNodeByKey(node.children, key, updates),
                        };
                    } else {
                        return node;
                    }
                });
            }

            if (editingNode) {
                const updatedData = updateNodeByKey(gData, editingNode.key, {
                    ...newMenu,
                });
                setGData(updatedData);
            } else {
                // Add a new item to the data array
                setGData((prevData) => [
                    ...prevData,
                    {
                        key: nanoid(4),
                        ...newMenu,
                    },
                ]);
            }

            // setEditModalVisible(false);
            setEditingNode(null);

        });

    };


    const onAddButtonClick = () => {
        form.resetFields();
        setEditingNode(null);
    };

    const onEditNode = (open, node) => {

        if (open) {
            setEditingNode(node);
            form.setFieldsValue({ ...node });

        } else setEditingNode(null);


        // setEditModalVisible(true);
    };

    const onDeleteNode = (node) => {

        handleDeleteModalOk(node);
    }

    const onSaveNode = (e) => {
        e.preventDefault();
        onSave(gData);
    }



    // Handle delete modal submit
    const handleDeleteModalOk = (node) => {
        // Find the selected item and remove it from the data
        const newData = [...gData];
        const selectedKey = node.key;
        const findAndRemove = (data) => {
            data.forEach((item, index) => {
                if (item.key === selectedKey) {
                    data.splice(index, 1);
                } else if (item.children) {
                    findAndRemove(item.children);
                }
            });
        };
        findAndRemove(newData);
        setGData(newData);
        setEditingNode(null);
    };


    const formContent = <Form form={form} layout="vertical">
        <Form.Item name="title" label="Label" rules={[{ required: true, message: 'Required' }]}>
            <Input />
        </Form.Item>
        <Form.Item name="link" label="Link" rules={[{ required: true, message: 'Required' }]}>
            <Input />
        </Form.Item>
        <Form.Item name="target" label="Target" >
            <Input />
        </Form.Item>

        <Form.Item>
            <Button type="primary" size='small' onClick={onEditModalOk}>
                Submit  </Button>
        </Form.Item>
    </Form>


    const renderTitle = (node) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between', gap: 5, padding: 2 }}>
            <span>{node.title}</span>
            <div>
                <Popover content={formContent} title={editingNode ? "Edit" : "Add"} trigger="click" onOpenChange={(open) => onEditNode(open, node)}>
                    <Button size='small' type="text" ghost><EditOutlined style={{ color: colorPrimary }} /></Button>
                </Popover>
                <Popconfirm
                    title="Delete the Menu Item"
                    description="Are you sure to delete this Item?"
                    onConfirm={() => onDeleteNode(node)}
                    onCancel={() => { }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button size='small' type="text" ghost><DeleteOutlined style={{ color: colorError }} /></Button>

                </Popconfirm>

            </div>
        </div>
    );



    const content = <div>



        <div style={{ paddingBottom: 10 }}>
            <Tree
                selectedKeys={selectedKeys}
                draggable
                onSelect={onSelect}
                blockNode
                onDragEnter={onDragEnter}
                onDrop={onDrop}
                treeData={gData}
                titleRender={renderTitle}
                selectable={false}
            >

            </Tree>
        </div>

        <div>
            <Popover content={formContent} title={editingNode ? "Add" : "Edit"} trigger="click" onOpenChange={(open) => onAddButtonClick(open)}>
                <Button onClick={onAddButtonClick} type="dashed">
                    <PlusOutlined />
                </Button>

            </Popover>
            {" "}
            <Button onClick={onSaveNode} type="dashed">
                <SaveOutlined />
            </Button>
        </div>
    </div>




    return <>
        <Popover content={content} title="Menu" trigger="click">
            {children}
        </Popover>
    </>


};

export default MenuTree;

