

// import React, { useEffect, useState, useRef } from 'react';
// import { Tooltip, Tag, Input, Select, Button, Space, Divider } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import Add from './Add';
// import { MdDelete } from 'react-icons/md';
// const { TextArea } = Input;
// const { Option } = Select;

// import { useCssNodeStates } from '../..';
// import Selector from '@/lib/utils/cssNode';


// export default function Animations({ selector, setSelector, document }) {

//   const [animations, setAnimations] = useState([]);

//   const [currentAnimation, setCurrentAnimation] = useState('');
//   const [animation, setAnimation] = useState(null);
//   const [step, setStep] = useState(-1);

//   const inputRef = useRef();
//   const editInputRef = useRef();

//   const [state, setState] = useState({
//     tags: [],
//     inputVisible: false,
//     inputValue: '',
//     editInputIndex: -1,
//     editInputValue: '',
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [newItem, setNewItem] = useState('');

//   useEffect( () => {

//     const sheet = document.styleSheets[0];
//     const cssRules = sheet.cssRules || sheet.rules;

//     const rules = Array.prototype.slice.call(cssRules).filter(rule => rule.type == 7);
//     setAnimations(rules);



//   }, []);

//   useEffect( () => {

//     if (!selector) {
//       setCurrentAnimation('');
//       setAnimation(null);
//     }

//   }, [selector]);



//   useEffect(() => {

//     if (!animation)
//       return;



//     const cssRules = animation.cssRules;


//     const _tags = Array.prototype.slice.call(cssRules).map(rule => rule);

//     setState({
//       tags: _tags, inputVisible: false,
//       inputValue: '',
//       editInputIndex: -1,
//       editInputValue: '',
//     })


//   }, [animation]);

//   useEffect(() => {

//     if (step < 0 || !animation)
//       return;

//     const sel = animation.cssRules[step];
//     if (sel)
//       setSelector({ style: sel.style, type: 'ANIMATION', name: animation.name });

//   }, [step])

//   function handleChange(index) {

//     if (!index <= -1 || index > animations.length)
//       return;
//     setCurrentAnimation(index);
//     const animation = animations[index];

//     setAnimation(animation);
//     setStep(-1);
//   }

//   let selectOptions = animations.map((item, i) => <Option key={item.name} value={i}> {item.name + 1} </Option>);

//   const handleSearch = (value) => {
//     const filteredOptions = animations.filter(item => item.name.includes(value));
//     if (filteredOptions.length <= 0)
//       setNewItem(value.trim());
//     else
//       setNewItem('');
//   };


//   const handleClose = removedTag => {

//     if (!animation)
//       return;

//     animation.deleteRule(removedTag.keyText);
//     const _tags = state.tags.filter(rule => rule.keyText !== removedTag.keyText);

//     setState({ ...state, tags: _tags });
//     setStep(-1);
//   };

//   const showInput = () => {
//     setState({ ...state, inputVisible: true });

//     if (inputRef.current)
//       inputRef.current.focus();
//   };

//   const handleInputChange = e => {


//     setState({ ...state, inputValue: e.target.value });
//   };


//   const handleInputConfirm = () => {
//     const { inputValue } = state;
//     let { tags } = state;
//     if (inputValue && tags.findIndex(tag => tag.keyText == inputValue) === -1) {

//       try {


//         animation.appendRule(`${inputValue} {}`);
//         const rules = animation.cssRules;
//         const tag = rules[rules.length - 1];

//         if (tag)
//           tags = [...tags, tag];

//        } catch (e) {

//        }

//     }

//     setState({
//       ...state,
//       tags,
//       inputVisible: false,
//       inputValue: '',
//     });
//   };

//   const handleEditInputChange = e => {
//     setState({ ...state, editInputValue: e.target.value });
//   };

//   const handleEditInputConfirm = () => {

//     const newTags = [...state.tags];
//     newTags[state.editInputIndex] = state.editInputValue;

//     setState({
//       ...state,
//       tags: newTags,
//       editInputIndex: -1,
//       editInputValue: '',
//     })

//   };

//   const addItem = async () => {

//     setIsLoading(true);

//     try {

//       let sheet = document.styleSheets[0];
//       const index = sheet.insertRule(`@keyframes ${newItem} {}`, sheet.cssRules.length);

//       const rule = sheet.cssRules[index];

//       setAnimations([...animations, rule])
//       setCurrentAnimation(animations.length);
//       setAnimation(rule);

//     }
//     catch (e) { }

//     setNewItem('');
//     setIsLoading(false);
//   }



//   return <Space size={2} align='start' direction='vertical'>
//     <label className='styling-label' style={{ textTransform: 'capitalize' }}>Animation: </label>
//     <Space size={2} align='start'>
//       <Select
//         allowClear
//         showSearch
//         value={currentAnimation}
//         style={{ width: '200px' }}
//         loading={isLoading}
//         placeholder="Please select"
//         onChange={handleChange}
//         onSearch={handleSearch}
//         optionFilterProp="children"
//         filterOption={(input, option) => (option?.key ?? '').includes(input)}

//         dropdownRender={menu => (
//           <div>
//             {newItem && <><div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
//               <Input style={{ flex: 'auto' }} value={newItem} />
//               <a
//                 style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
//                 onClick={addItem}
//               >
//                 <PlusOutlined />
//               </a>
//             </div>
//               <Divider style={{ margin: '4px 0' }} /></>}
//             {menu}
//           </div>
//         )}
//       >
//         {selectOptions}
//       </ Select>

//       <Tooltip placement="top" title="Delete Selector">
//         <Button
//           icon={<MdDelete size="medium" />}
//           onClick={(e) => {
//             e.preventDefault();

//             if (animation && currentAnimation >= 0) {

//               let sheet = document.styleSheets[0];
//               let cssRules = sheet.cssRules || sheet.rules;

//               const index = Array.prototype.slice.call(cssRules).indexOf(animation);

//               animations.splice(currentAnimation, 1);
//               sheet.deleteRule(index);

//               setCurrentAnimation('');
//               setSelector(null);
//             }

//           }}
//           className="ac-icons-btn"
//         > </Button>
//       </Tooltip>
//     </Space>

//     <Space size={2} align='start'>
//       {animation && <>
//         {state?.tags.sort((a, b) => {
//           if (parseInt(a.keyText) < parseInt(b.keyText)) return -1
//           if (parseInt(a.keyText) > parseInt(b.keyText)) return 1
//           return 0
//         }).map((tag, index) => {
//           // if (state.editInputIndex === index) {
//           //   return (
//           //     <Input
//           //       ref={editInputRef}
//           //       key={tag}
//           //       size="small"
//           //       className="tag-input"
//           //       value={state.editInputValue}
//           //       onChange={handleEditInputChange}
//           //       onBlur={handleEditInputConfirm}
//           //       onPressEnter={handleEditInputConfirm}
//           //     />
//           //   );
//           // }
//           const isLongTag = tag.keyText.length > 20;

//           const tagElem = (
//             <Tag
//               className="edit-tag"
//               key={tag.tag}
//               closable
//               onClose={() => handleClose(tag)}
//               style={{ cursor: 'pointer', border: step === index ? '1px solid #f88a24' : undefined, color: step === tag ? '#f88a24' : undefined }}
//               onClick={e => {
//                 e.preventDefault();
//                 setStep(index);
//               }}
//             >
//               <span
//               // onDoubleClick={e => {
//               //   e.preventDefault();

//               //     setState({ ...state, editInputIndex: index, editInputValue: tag });
//               //     if(editInputRef.current)
//               //       editInputRef.current.focus();


//               // }}
//               >
//                 {tag.keyText}
//               </span>
//             </Tag>
//           );
//           return tagElem;
//         })}

//         {state?.inputVisible && (
//           <Input
//             ref={inputRef}
//             type="text"
//             size="small"
//             className="tag-input"
//             value={state.inputValue}
//             onChange={handleInputChange}
//             onBlur={handleInputConfirm}
//             onPressEnter={handleInputConfirm}
//           />

//         )}
//         {!state?.inputVisible && (
//           <Tag className="site-tag-plus" onClick={showInput}>
//             <PlusOutlined /> Add Step
//           </Tag>
//         )}

//       </>}



//     </Space>
//   </Space>

// }


import {  ExclamationCircleFilled } from '@ant-design/icons';

import { RiDeleteBin2Line } from 'react-icons/ri';

import React, { useState, useEffect, useMemo, useReducer } from "react";
import { Modal, Divider, Alert, Select, Button, Typography, theme, Tooltip } from "antd";
import Fuse from "fuse.js";
import { getAllKeys, STYLE_STORE_NAME } from '@/lib/utils/db';

const { Option } = Select;
const { Text } = Typography;
const { confirm } = Modal;

const fuseOptions = {
   
};



export default function Animations({ onEdit, animation, onDelete }) {

    const [searchTerm, setSearchTerm] = useState("");
    const [validationResult, setValidationResult] = useState(null);

    const [animations, setAnimations] = useState([]);

    const {
        token: { colorError },
    } = theme.useToken();

    const search = useMemo(() => {
        const fuse = new Fuse(animations, fuseOptions);
        const results = fuse.search(searchTerm);
        return results;
    }, [animations]);


    useEffect(() => {

        if (!searchTerm) {
            setAnimations([...animations]);
            return;
        }
        const fetchData = async () => {
            const res = await getAllKeys(STYLE_STORE_NAME);
            const data = res ? res : [];
            console.log(res)
            setAnimations([...data])
        }

        fetchData();
        return () => {
            setAnimations([])
        }

    }, [searchTerm]);
    

    function handleSelectOption(value) {
        
        onEdit(value);
    }

    const handleAddNew = () => {
        
        onEdit(searchTerm, true);

    };


    function handleSearchInput(value) {

        if (value && !validateSearchInput(value)) {
            return;
        }

        setSearchTerm(value);
        setValidationResult('');

    }

    const validateSearchInput = (inputValue, option) => {
        const regex = /^[a-zA-Z_]+$/;
        const isValid = regex.test(inputValue);
        setValidationResult(isValid ? 'valid' : 'invalid');
        return isValid;
    };

    const onClose = () => {
        setValidationResult('')
    };




    return <>

        <Select
            style={{
                width: '100%', marginRight: 10
            }}
            allowClear
            showSearch
            value={animation}
            placeholder="Please Select Animation"
            onSearch={handleSearchInput}
            onChange={handleSelectOption}


            dropdownRender={menu => (<>


                {search.length === 0 &&
                    validationResult === 'invalid' ? (<>
                        <Alert style={{ margin: '5px 0' }} type="error" onClose={onClose} closable message={`Please enter a valid name (e.g my-snimstion).`}>

                        </Alert>
                        <Divider style={{ margin: '4px 0' }} />
                    </>) :
                    searchTerm !== '' && <div>
                        <Button onClick={handleAddNew}>
                            Add new: {searchTerm}
                        </Button>
                        <Divider style={{ margin: '4px 0' }} />
                    </div>
                }

                {menu}


            </>)}

        >

            {animations.map(animation => <Option value={animation}>
                {animation}
            </Option>)}
        </Select>


        <Tooltip placement="top" title="Delete Animation">
                    <Button
                        size='small'
                        ghost
                        icon={<RiDeleteBin2Line style={{ color: colorError }} />}
                        onClick={(e) => {
                            e.preventDefault();

                            confirm({
                                title: 'Are you sure to delete this aniamtion?',
                                content: "This action can't be undo.",

                                icon: <ExclamationCircleFilled />,
                                okText: 'Yes',
                                okType: 'danger',
                                cancelText: 'No',
                                onOk() {
                                    onDelete(animation);
                                },
                                onCancel() {

                                },
                            });
                        }}
                    > </Button>
                </Tooltip>



    </>

}

