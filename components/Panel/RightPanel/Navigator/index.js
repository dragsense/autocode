// import { Tree, Input, message, Popconfirm, Button, theme } from 'antd';
// import { useState, useEffect, useMemo, } from 'react';
// import { getData, generateTreeNodes } from '@/lib/utils/db';
// import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
// const { Search } = Input;
// import { usePageStates } from '@/components/Editor/PageProvider';


// const updateTreeData = (list, key, children) => {
//   return list.map((node) => {
//     if (node.key === key) {
//       return { ...node, children };
//     } else if (node.children) {
//       return { ...node, children: updateTreeData(node.children, key, children) };
//     } else {
//       return node;
//     }
//   });
// };



// const Navigator = ({ onClickNavigator, state }) => {
//   const [treeData, setTreeData] = useState({});
//   const [expandedKeys, setExpandedKeys] = useState([]);
//   const [selectedKeys, setSelectedKeys] = useState([]);

//   const [searchValue, setSearchValue] = useState('');
//   const [autoExpandParent, setAutoExpandParent] = useState(true);
//   const [isDragging, setIsDragging] = useState();
//   const { onAdd, onMove, onCopy, onDelete } = usePageStates();


//   const {
//     token: { colorPrimary, colorError, },
//   } = theme.useToken();

//   useEffect(() => {

//     if (!state.node)
//       return;


//     setSelectedKeys([state.node._uid])

//   }, [state.node])

//   const onLoadData = async (treeNode) => {
//     const { children, title,  key } = treeNode;

//     let elements = {};


//     const childNodes = await Promise.all(
//       children
//         .filter(child => !treeData[key]?.children?.some(c => c.key === child._uid))
//         .map(async (_uid) => await getData(_uid))
//     );

//     childNodes.forEach(item => {
//       elements[item._uid] = item;
//     });

//     treeData[key].childNodes = childNodes;

//     setTreeData({...treeData, ...elements});
//   };

//   useEffect(() => {

//     if (!state.pageUpdated)
//       return; 

//     const fetchData = async () => {
//       const rootNode = await getData('0');
//       if (rootNode)
//         setTreeData({ [rootNode._uid]: rootNode });
//     }
//     fetchData();

//   }, [state.pageUpdated]);

//   const getParentKey = (key, tree) => {
//     let parentKey;
//     for (let i = 0; i < tree.length; i++) {
//       const node = tree[i];

//       if (node.children) {
//         if (node.children.some((item) => item.key === key)) {
//           parentKey = node.key;
//         } else {
//           parentKey = getParentKey(key, node.children);
//         }
//       }
//     }
//     return parentKey;
//   };


//   const getParentNode = (key, tree) => {
//     let parentNode;
//     for (let i = 0; i < tree.length; i++) {
//       const node = tree[i];

//       if (node.children) {
//         if (node.children.some((item) => item.key === key)) {
//           parentNode = node;
//         } else {
//           parentNode = getParentKey(key, node.children);
//         }
//       }
//     }
//     return parentNode;
//   };

//   const dataList = useMemo(() => {
//     const list = [];

//     const generateList = (data) => {
//       for (let i = 0; i < data.length; i++) {
//         const node = data[i];
//         const { key, title } = node;
//         list.push({
//           key,
//           title,
//         });
//         if (node.children) {
//           generateList(node.children);
//         }
//       }
//     };

//     generateList(treeData);

//     return list;
//   }, [treeData]);


//   const onChange = (e) => {
//     const { value } = e.target;

//     const expandedKeys = dataList
//       .map((item) => {

//         if (item.title.indexOf(value) > -1) {


//           return getParentKey(item.key, treeData);
//         }
//         return null;
//       })
//       .filter((item, i, self) => item && self.indexOf(item) === i);

//     setExpandedKeys(expandedKeys);
//     setSearchValue(value);
//     setAutoExpandParent(true);
//   };

//   const loop = (nodes) =>
//     nodes.map((node) => {

//       if(!node._uid)
//       return node;


//       const { _uid, tagName, name, childNodes } = node;



//       const tagTitle = name || tagName;

//       const index = tagTitle.indexOf(searchValue);
//       const beforeStr = tagTitle.substr(0, index);
//       const afterStr = tagTitle.substr(index + searchValue.length);
//       const title =
//         index > -1 ? (
//           <span>
//             {beforeStr}
//             <span style={{ color: '#f50' }}>{searchValue}</span>
//             {afterStr}
//           </span>
//         ) : (
//           <span>{tagTitle}</span>
//         );

//       if (childNodes && childNodes.length > 0) {
//         return {
//           title,
//           key: _uid,
//           children: loop(childNodes.map((child) => treeData[child] || child)),
//         };
//       }
//       return {
//         title,
//         key: _uid,
//         isLeaf: true,
//       };
//     });


//   const onDragEnter = (info) => {
//     const { event, node } = info;
//     // Check if the drag target is a node in the tree
//     const newExpandedKeys = [...expandedKeys];
//     const { key } = node;

//     // Check if the key is not already in the expanded keys
//     if (!newExpandedKeys.includes(key)) {
//       newExpandedKeys.push(key);
//       setExpandedKeys(newExpandedKeys);
//     }

//   };

//   // const onDrop = (info) => {

//   //   // Get the target node and its depth

//   //   const targetDepth = info.node.pos.split('-').length - 1;

//   //   // Check if the target depth exceeds the maximum allowed depth
//   //   if (targetDepth >= 10) {
//   //     message.error('Cannot add more than 3 levels of nesting');
//   //     return;
//   //   }


//   //   // const dropKey = info.node.key;
//   //   // const dragKey = info.dragNode.key;
//   //   // const dropPos = info.node.pos.split('-');
//   //   // const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);


//   //   // const loop = (data, key, callback) => {
//   //   //   for (let i = 0; i < data.length; i++) {
//   //   //     if (data[i].key === key) {
//   //   //       return callback(data[i], i, data);
//   //   //     }
//   //   //     if (data[i].children) {
//   //   //       loop(data[i].children, key, callback);
//   //   //     }
//   //   //   }
//   //   // };
//   //   // const data = [...treeData];

//   //   // // Find dragObject
//   //   // let dragObj;
//   //   // loop(data, dragKey, (item, index, arr) => {
//   //   //   arr.splice(index, 1);
//   //   //   dragObj = item;
//   //   // });
//   //   // if (!info.dropToGap) {
//   //   //   // Drop on the content
//   //   //   loop(data, dropKey, (item) => {
//   //   //     item.children = item.children || [];
//   //   //     // where to insert 示例添加到头部，可以是随意位置
//   //   //     item.children.unshift(dragObj);
//   //   //   });
//   //   // } else if (
//   //   //   (info.node.props.children || []).length > 0 &&
//   //   //   // Has children
//   //   //   info.node.props.expanded &&
//   //   //   // Is expanded
//   //   //   dropPosition === 1 // On the bottom gap
//   //   // ) {
//   //   //   loop(data, dropKey, (item) => {
//   //   //     item.children = item.children || [];
//   //   //     // where to insert 示例添加到头部，可以是随意位置
//   //   //     item.children.unshift(dragObj);
//   //   //     // in previous version, we use item.children.push(dragObj) to insert the
//   //   //     // item to the tail of the children
//   //   //   });
//   //   // } else {
//   //   //   let ar = [];
//   //   //   let i;
//   //   //   loop(data, dropKey, (_item, index, arr) => {
//   //   //     ar = arr;
//   //   //     i = index;
//   //   //   });
//   //   //   if (dropPosition === -1) {
//   //   //     ar.splice(i, 0, dragObj);
//   //   //   } else {
//   //   //     ar.splice(i + 1, 0, dragObj);
//   //   //   }
//   //   // }
//   //   // setTreeData(data);

//   //   const { node, dragNode } = info;
//   //   //const dropPos = info.node.pos.split('-').map(pos => parseInt(pos));


//   //   const dropPos = info.node.pos.split('-');
//   //   const dropPosition = Number(dropPos[dropPos.length - 1]);

//   //   // Get the parent node of the dragged node
//   //   const draggedNodeParent = getParentNode(dragNode.key, treeData);

//   //   // Clone the dragged node to avoid mutating the original tree data
//   //   const draggedNodeClone = { ...dragNode };

//   //   // Remove the dragged node from its previous location
//   //   const index = draggedNodeParent.children.findIndex((child) => child.key === dragNode.key);
//   //   draggedNodeParent.children.splice(index, 1);

//   //   // Determine the new index and parent for the dragged node
//   //   let parentNode;

//   //   if(dropPos.length === 1 && dropPos[0] === '0')
//   //   parentNode = treeData;
//   //   else
//   //   parentNode = getParentNode(node.key, treeData);

//   //   let newIndex = dropPosition;


//   //   if (info.dropToGap) {
//   //     if (info.dropPosition === -1) {
//   //       newIndex -= 1;
//   //     }
//   //   }

//   //   console.log(dropPos, parentNode, draggedNodeClone);
//   //   // Add the dragged node to its new location
//   //   parentNode.children.splice(newIndex, 0, draggedNodeClone);

//   //   // Update the tree data
//   //   setTreeData([...treeData]);

//   //   // Update the tree data
//   //   // setTreeData([...treeData]);


//   //   // let dragPos = info.dragNode.pos.split('-');
//   //   // dragPos = Number(dragPos[dragPos.length - 1])

//   //   // getData(dragKey).then(data => {
//   //   //   onMove(dropKey, dropPosition, { index: dragPos, ...data })
//   //   // });


//   //   // getData(dropKey).then(parent => {
//   //   //   parent.childNodes.splice(dropPos, 0, dragKey);
//   //   //   updateData(parent);
//   //   // });


//   //   //setIsDragging(false)

//   // };

//   const rootNode = treeData['0'] ? [treeData['0']] : [];

//   const treeNodes = useMemo(() => loop(rootNode), [searchValue, treeData]);


//   // const onDeleteNode = (node) => {

//   //   onDelete(node).then(_uid => {
//   //     const parent = getParentNode(node.key);
//   //     parent.children = parent.children.filter((n) => n.key !== node.key);
//   //     setTreeData([...treeData]);
//   //   });

//   // }




//   // const onCopyNode = (node) => {

//   //   onCopy(node).then(_uid => {
//   //     const copiedNode = JSON.parse(JSON.stringify(node));
//   //     const parent = getParentNode(node.key);
//   //     const newNode = { ...copiedNode, key: _uid };
//   //     parent.children.splice(parent.children.indexOf(node) + 1, 0, newNode);
//   //     setTreeData([...treeData]);
//   //   })

//   // }


//   const onSelect = (keys, info) => {

//     onClickNavigator(keys[0])
//   }



//   const onDropTag = (e, node) => {

//     if (isDragging)
//       return;

//     const tag = JSON.parse(e.dataTransfer.getData('text/plain'));

//     getData(node.key).then(data => {

//       onAdd(tag, undefined, { ...data }).then(node => {
//         // const parent = getParentNode(node.key);
//         // const newNode = { ...copiedNode, key: _uid };
//         // parent.children.splice(parent.children.indexOf(node) + 1, 0, newNode);
//         // setTreeData([...treeData]);
//       });

//     })

//   };

//   const onDragOver = (e, node) => {

//     if (isDragging)
//       return;
//     // Check if the drag target is a node in the tree
//     const newExpandedKeys = [...expandedKeys];
//     const { key } = node;

//     // Check if the key is not already in the expanded keys
//     if (!newExpandedKeys.includes(key)) {
//       newExpandedKeys.push(key);
//       setExpandedKeys(newExpandedKeys);
//     }

//   };

//   const renderTitle = (node) => (
//     <div onDragOver={(e) => onDragOver(e, node)} onDrop={(e) => onDropTag(e, node)} style={{ display: "flex", alignItems: "center", justifyContent: 'space-between', gap: 5, padding: 2 }}>
//       <span >{node.title}</span>
//       <div>
//         <Button size='small' type="text" ghost onDoubleClick={() => onCopyNode(node)}><CopyOutlined /></Button>
//         <Popconfirm
//           title="Delete the Menu Item"
//           description="Are you sure to delete this Item?"
//           onConfirm={() => onDeleteNode(node)}
//           onCancel={() => { }}
//           okText="Yes"
//           cancelText="No"
//         >
//           <Button size='small' type="text" ghost><DeleteOutlined style={{ color: colorError }} /></Button>
//         </Popconfirm>

//       </div>
//     </div>
//   );

//   return (
//     <div style={{ height: '100%' }}>
//       <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
//       <Tree
//         blockNode
//         loadData={onLoadData}
//         selectedKeys={selectedKeys}
//         onDragStart={() => setIsDragging(true)}
//         onDragEnd={() => setIsDragging(false)}
//         onDragEnter={onDragEnter}
//         draggable
//         treeData={treeNodes}
//         height={'700px'}
//         onExpand={(keys) => {
//           setExpandedKeys(keys);
//           setAutoExpandParent(false);
//         }}
//         onSelect={onSelect}
//         titleRender={renderTitle}
//         expandedKeys={expandedKeys}
//         autoExpandParent={autoExpandParent}
//         style={{ padding: 5 }}
//       >

//       </Tree>
//     </div>
//   );



//   // return <TreeComponent page={state.page} onClick={onClickNavigator} />
// }


// export default Navigator;


import { Tree, Button, Input, theme, Popconfirm, Tooltip } from 'antd';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getData, PAGE_STORE_NAME, openDB } from '@/lib/utils/db';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';

import { debounce } from '@/lib/utils/utils'

const { Search } = Input;


function Toolbar({ id, pos, colorError, onDelete, onCopy }) {
  return (
    <div>

      <Button size='small' type="text" ghost onDoubleClick={() => {
        onCopy({ dataset: { id: id, pos: pos } })
      }}><CopyOutlined /></Button>

      <Popconfirm
        title="Delete the Menu Item"
        description="Are you sure to delete this Item?"
        onConfirm={() => { onDelete({ dataset: { id: id, pos: pos } }); }}
        onCancel={() => { }}
        okText="Yes"
        cancelText="No"
      >

        <Button size='small' type="text" ghost><DeleteOutlined style={{ color: colorError }} /></Button>

      </Popconfirm>

    </div>
  );
}

const Navigator = ({ onClickNavigator, onMove, onCopy, onDelete, state }) => {

  const [treeData, setTreeData] = useState({});
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const treeRef = useRef();

  const {
    token: { colorSuccess, colorError },
  } = theme.useToken();

  useEffect(() => {
    if (!state.pageUpdated || !state.page) return;

    const fetchData = async () => {
      const rootNode = await getData(state.page._id, '0');
      if (rootNode) setTreeData({ [rootNode._uid]: rootNode });
    };
    fetchData();
  }, [state.pageUpdated]);



  useEffect(() => {
    if (!state.node) return;

    const autoSelect = async () => {
      setSearchValue(state.node.name || state.node.tagName);
      setSelectedKeys([state.node._uid]);
    }

    autoSelect();
  }, [state.node]);


  const loadData = async (treeNode) => {



    const { childNodes } = treeNode;

    const elements = {};
    const loadedNodes = await Promise.all(childNodes.filter(async (_uid) => _uid !== '0'));

    for (const _uid of loadedNodes) {
      const item = await getData(state.page._id, _uid);
  
      if (item) {
        elements[_uid] = item;
      }
    }

    setTreeData({ ...treeData, ...elements });
  };

  const unloadData = (key, rootKey) => {
    if (treeData[key] && treeData[key].childNodes) {
      treeData[key].childNodes.forEach((_uid) => unloadData(_uid, rootKey));
    }
    if (key !== rootKey) delete treeData[key];
  };

  const onExpand = useCallback(async (keys, { expanded, node }) => {

    const key = node.key;
    if (expanded) {
      await loadData(treeData[key]);
    } else {
      unloadData(key, key);
      setTreeData({ ...treeData });
    }
    setExpandedKeys(keys);
  }, [treeData]);

  const searchData = useCallback(async (searchText = "", limit = 25, STORE = PAGE_STORE_NAME) => {
    return await new Promise(async (resolve, reject) => {
      const db = await openDB();
      const store = db.transaction(STORE).objectStore(STORE);

      const index = store.index('id');

      // const lowerBound = searchText.toLowerCase();
      // const upperBound = lowerBound + '\uffff';
      // const range = IDBKeyRange.bound([lowerBound, lowerBound], [upperBound, upperBound]);

      const request = index.get(state.page._id);

      let results = [];
      let count = 0;
      let lastResult = null;

      const handleResult = event => {

        const data = event.target.result;
        let results = [];


        if (data) {
          results = Object.values(data.elements).filter(res => {

            const title = res.name || res.tagName;

            if(!title)
            return;

            return title.includes(searchText);
          });
        }

        resolve(results);

        // const cursor = event.target.result;
        // if (cursor) {
        //   const record = cursor.value;
        //   const title = record.name || record.tagName;
        //   if (title.indexOf(searchText) > -1) {
        //     results.push(record);
        //     count++;
        //     if (count < limit) {
        //       lastResult = cursor.key;
        //       cursor.continue();
        //     }
        //   } else {
        //     cursor.continue();
        //   }
        // } else {
        //   resolve({ results, lastResult });
        // }
      };

      const handleError = event => {
        reject(event.target.error);
      };

      request.onsuccess = handleResult;
      request.onerror = handleError;


    })
  }, [state.page]);

  const onChange = useCallback(
    debounce(async (e) => {
      const value = e.target.value;
      setSearchValue(value);
    }, 500),
    []
  );

  useEffect(() => {


    if (!searchValue) {
      setTreeData({ ...treeData });
      return;
    }


    const fetchData = async () => {
      const results = await searchData(searchValue);

      const expandedKeys = await Promise.all(results.map(async item => {
        treeData[item._uid] = item;
        const parent = treeData[item.parent];
        if (!parent) {
          const node = await getData(state.page._id, item.parent);
          if (node)
            treeData[node._uid] = node;
        }
        return item.parent || '0';

      }).filter((item, i, self) => item && self.indexOf(item) === i));

      setExpandedKeys(expandedKeys);
      setAutoExpandParent(true);
      setTreeData({ ...treeData })
    }
    fetchData();

    return () => {

    }

  }, [searchValue]);

  const loop = useCallback((nodes, pos) =>
    nodes.map((key, i) => {
      const item = treeData[key];

      if (!item)
        return {};

      const { _uid, tagName, name, childNodes } = item;

      const tagTitle = name || tagName;
      const searchText = searchValue || '';
      const index = tagTitle.indexOf(searchText);
      const beforeStr = tagTitle.substr(0, index);
      const afterStr = tagTitle.substr(index + searchText.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: colorSuccess }}>{searchText}</span>
            {afterStr}
          </span>
        ) : (
          <span>{tagTitle}</span>
        );

      if (childNodes && childNodes.length > 0) {
        return {
          title,
          pos: pos + (key != 0 ? i : ""),
          key: _uid,
          childNodes: childNodes,
          children: loop(
            childNodes.filter(_uid => {
              if (_uid !== '0'){
                return _uid;
              }
            }
            ), pos + (key != 0 ? i : ""))
        }
      }
      return {
        title,
        pos: pos + i,
        key: _uid,
        childNodes: [],
        isLeaf: true,
      };
    }));




  const rootNode = ["0"];

  const treeNodes = useMemo(() => loop(rootNode, ""), [treeData]);

  const onSelect = useCallback((keys, { node }) => {
    setSelectedKeys(keys);
    onClickNavigator && onClickNavigator(null, node.key);

  }, [onClickNavigator]);

  const title = (item) => <div style={{ display: "flex", alignItems: "center", justifyContent: 'space-between', gap: 5, padding: 2 }}
  > <span>{item.title}</span>
    {selectedKeys.includes(item.key) &&
      <div onClick={(event) => event.stopPropagation()}>
        <Toolbar
          key={item.key}

          id={item.key}
          pos={item.pos}
          onCopy={onCopy}
          onDelete={onDelete}
          colorError={colorError} /> </div>}
  </div>

  const renderTreeNodes = (data) => {
    return data.map((item, index) => {

      if (item.children) {
        return (
          <Tree.TreeNode itemPos={item.pos} title={title(item)} key={item.key}>
            {renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return (
        <Tree.TreeNode
          itemPos={item.pos}
          title={title(item)}
          key={item.key} isLeaf />

      );
    });
  };

  const onDrop = (info) => {

    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.itemPos;
    const dragPos = info.dragNode.itemPos;
    if (dropKey && dragKey)
      onMove(dropKey, dragKey, info.dropToGap, dropPos, dragPos);
  };

  return (
    <div style={{ position: 'relative' }}>
      <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
      <Tree
        ref={treeRef}
        onDrop={onDrop}
        blockNode
        selectedKeys={selectedKeys}
        draggable
        height={"700px"}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        onSelect={onSelect}
        autoExpandParent={autoExpandParent}
        style={{ padding: 5 }}

      >
        {renderTreeNodes(treeNodes)}
      </Tree>

    </div>
  );
};


export default Navigator;