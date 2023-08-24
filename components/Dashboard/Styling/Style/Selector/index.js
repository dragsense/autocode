

// import React, { useEffect, useState, useMemo } from 'react';
// import { Tooltip, Button, Input, Select, Divider, Space } from 'antd';
// import VirtualList from "rc-virtual-list";

// import Add from './add';
// import { MdDelete } from 'react-icons/md';
// import { PlusOutlined } from '@ant-design/icons';

// const { TextArea } = Input;
// const { Option } = Select;

// import Searchable from './Searchable';


// export function Selecters({ document, editorSelector, selector, setSelector, mediaQuery, setMediaQuery }) {


//     const [selectors, setSelectors] = useState([]);
//     const [currentSelector, setCurrentSelector] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [newItem, setNewItem] = useState('');



//     useEffect(async () => {

//         setSelector(null);


//         // if (mediaQuery) {
//         //     const cssRules = mediaQuery.cssRules;
//         //     const rules = Array.prototype.slice.call(cssRules).map(rule => rule)
//         //     setSelectors(rules);

//         // } else {
//         //     const sheet = document.styleSheets[0];
//         //     const cssRules = sheet.cssRules || sheet.rules
//         //     const rules = Array.prototype.slice.call(cssRules).filter(rule => rule.type == 1)
//         //     setSelectors(rules);
//         // }

//     }, [mediaQuery]);

//     useEffect(async () => {

//         if (!selector) setCurrentSelector('');

//     }, [selector]);

//     useEffect(async () => {

//         if (!editorSelector)
//             return;


//         const findIndex = selectors.findIndex(item => item.selectorText == editorSelector.replace(/\s+/g, ""));


//         if (findIndex == -1) {
//             editorSelector += selectors.length;
//             await addItem(editorSelector, 'editor');
//         }
//         else {
//             const rule = selectors[findIndex];

//             if (rule) {
//                 setSelector({ rule, style: rule.style, type: 'editor', name: rule.selectorText });
//                 setCurrentSelector(editorSelector);

//             }
//         }

//     }, [editorSelector]);

//     function handleChange(index) {


//         if (index == undefined || index <= -1 || index > selectors.length) {
//             setSelector(null);
//             return;
//         }

//         setCurrentSelector(index)

//         const rule = selectors[index];


//         if (rule)
//             setSelector({ rule, style: rule.style, type: 'HTML', name: rule.selectorText });


//     }

//     let selectOptions = selectors.map((item, i) => <Option key={item.selectorText + i} value={i}> {item.selectorText + " " + (i + 1)} </Option>);

//     const handleSearch = (rule) => {


//         setSelector(rule);
//         // const filteredOptions = selectors.filter(item => item.selectorText == value.replace(/\s+/g, ""));

//         // if (filteredOptions.length <= 0)
//         //     setNewItem(value.trim());
//         // else
//         //     setNewItem('');
//     };

//     const addItem = async (_newItem, type = 'HTML') => {

//         setIsLoading(true);

//         try {

//             let sheet = document.styleSheets[0];
//             if (mediaQuery)
//                 sheet = mediaQuery;

//             const index = sheet.insertRule(`${_newItem} {}`, sheet.cssRules.length);

//             const rule = sheet.cssRules[index];

//             setSelectors([...selectors, rule])
//             setCurrentSelector(selectors.length);
//             setSelector({
//                 rule,
//                 style: rule.style,
//                 type: type,
//                 name: rule.selectorText
//             });

//         }
//         catch (e) { }

//         setNewItem('');
//         setIsLoading(false);
//     }


//     return (
//         <Space size={2} align='start' direction='vertical'>
//             <label className='styling-label' style={{ textTransform: 'capitalize' }}>Seclector: </label>

//             <Searchable document={document} onAdd={()=>{}} onSelect={(() => {})} />
//              <Space size={2} align='start'>
//              {/*   <Select
//                     allowClear
//                     showSearch
//                     value={currentSelector}
//                     style={{ width: '200px' }}
//                     loading={isLoading}
//                     placeholder="Please select"
//                     onChange={handleChange}
//                     onSearch={handleSearch}
//                     filterOption={(input, option) => (option?.key ?? '').includes(input)}

//                     dropdownRender={menu => (
//                         <div>
//                             {newItem && <><div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
//                                 <Input style={{ flex: 'auto' }} value={newItem} />
//                                 <a
//                                     style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
//                                     onClick={() => addItem(newItem)}
//                                 >
//                                     <PlusOutlined />
//                                 </a>
//                             </div>
//                                 <Divider style={{ margin: '4px 0' }} /></>}
//                             {menu}
//                         </div>
//                     )}
//                 >
//                     {selectOptions}
//                 </ Select> */}

//                 <Tooltip placement="top" title="Delete Selector">
//                     <Button
//                         icon={<MdDelete size="medium" />}
//                         onClick={(e) => {
//                             e.preventDefault();


//                             let sheet = mediaQuery ? mediaQuery : document.styleSheets[0];
//                             let cssRules = sheet.cssRules || sheet.rules;

//                             if (selector && currentSelector >= 0) {

//                                 const index = Array.prototype.slice.call(cssRules).indexOf(selector.rule);

//                                 selectors.splice(currentSelector, 1);
//                                 sheet.deleteRule(index);

//                                 setCurrentSelector('');
//                                 setSelector(null);
//                             }

//                         }}
//                         className="ac-icons-btn"
//                     > </Button>
//                 </Tooltip>
//             </Space>
//         </Space>
//     );
// }


import React, { useState, useEffect, useCallback, useMemo, useReducer } from "react";
import { Modal, Divider, Alert, Select, Button, Typography } from "antd";
import Fuse from "fuse.js";
import { debounce } from '@/lib/utils/utils'


import { searchSelector } from '@/lib/utils/db';


const { Option } = Select;
const { Text } = Typography;
const { confirm } = Modal;

const fuseOptions = {
    tokenize: true,
    matchAllTokens: true,
    location: 0,
    distance: 0,
    key: ['selectorText']
};



function SearchableSelector({ selectorKey, selector, onSelect, animation = false }) {

    const [searchTerm, setSearchTerm] = useState("");
    const [validationResult, setValidationResult] = useState(null);
    const [selectors, setSelectors] = useState({});

    const search = useMemo(() => {
        const fuse = new Fuse(selectors, fuseOptions);
        const results = fuse.search(searchTerm);
        return results;
    }, [selectors]);


    useEffect(() => {

        if (!searchTerm) {
            setSelectors({...selectors});
            return;
        }
        const fetchData = async () => {
            const res = await searchSelector(selectorKey);
            const data = res?.selectors ? res.selectors : {};
            setSelectors(data)
        }

        fetchData();
        return () => {
            setSelectors({})
        }

    }, [searchTerm]);

    function handleSelectOption(value) {
        onSelect(selectors[value]);
    }

    const handleAddNew = () => {
        const sel =   {selectorText: searchTerm.trim(), index: -1, properties: {}}
      
       onSelect(sel);
    };

    const handleSearchInput = useCallback(
        debounce(async (value) => {
            if (value && !validateSearchInput(value)) {
                return;
            }
            setSearchTerm(value);
            setValidationResult('');
        }, 500),
        []
    );



    const validateSearchInput = (inputValue, option) => {
        const regex = animation ? /^(100|[1-9][0-9]?|0)%|from|to$/ : /^(?:[^ ]* ?[^ ]*)?$/;
        const isValid = regex.test(inputValue);
        setValidationResult(isValid ? 'valid' : 'invalid');
        return isValid;
    };

    const onClose = () => {
        setValidationResult('')
    };


    return (<>

        <Select
            style={{
                width: '100%',
            }}
            allowClear
            showSearch

            value={selector?.selectorText}
            placeholder="Please Select Selector"
            onSearch={handleSearchInput}
            onChange={handleSelectOption}


            dropdownRender={menu => (<>


                {search.length === 0 &&
                    validationResult === 'invalid' ? (<>
                        <Alert style={{ margin: '5px 0' }} type="error" onClose={onClose} closable message={`Please enter a valid CSS selector name ${animation ? '(e.g. to, from OR 0% - 100%)' : '(e.g. .my-class)'}.`}>

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

            {Object.entries(selectors).map(([key, value]) => <Option value={key}>
                {key}
            </Option>)}
        </Select>




    </>
    );
}

export default SearchableSelector;