// import { Button, Space, Tooltip } from "antd";
// import { QuestionCircleFilled } from "@ant-design/icons";
// import { useState, useEffect } from "react";
// import { SketchPicker } from 'react-color';

// import { AiFillLayout, AiOutlineFontSize } from 'react-icons/ai';
// import {
//     MdUndo,
//     MdTextFields,
//     MdCropSquare,
//     MdSelectAll,
//     MdGradient,
//     MdOutlineBorderOuter,
//     MdOutlineFlipToFront,
//     MdViewQuilt, MdRestartAlt, MdNat, MdList , MdDelete, MdRedo
// } from 'react-icons/md';
// import { FaImage } from 'react-icons/fa';

// import Typography from "./Typography";
// import Background from "./Background";
// import Size from "./Size";
// import Spacing from "./Spacing";
// import Position from "./Position";
// import Border from "./Border";
// import Other from "./Other";
// import Display from "./Display";
// import Transform from "./Transform";
// import { Animations } from "./Animation";

// import SwitchComponents from "@/components/Panel";
// import IFrame from "@/components/Iframe/setting";
// import { useCssNodeStates } from "..";

// import { Element } from "./Element";
// import { RenderHtml, H1, H2, H3, H4, H5, H6, P, A, Label, Input, Textarea, Submit, _Button, Span, Div, Section, _Display, Animation } from "./Elements";


// const elements = ['HTML', 'DISPLAY']

// import List from './List';



// export default function Style({ isLoading, selector, setSelector, setUState, undoStyle, redoStyle }) {

//     const [element, setElement] = useState('');

//     const [avtiveTab, setActiveTab] = useState('1');
//     const { document, setIframeDocumnet, removeCssRule, getElementStyle } = useCssNodeStates();
//     const [style, setStyle] = useState(null);
//     const [uStyle, _setUStyle] = useState(null);

//     const [colorPicker, setColorPicker] = useState(false);
//     const [color, setColor] = useState("#fff");

//     const [display, setDisplay] = useState({});




//     const setUStyle = (style, name, value, priority) => {
//         setUState({
//             fun: () => {
//                 style.setProperty(name, value, priority);
//             }
//         })
//     }

//     useEffect(async () => {

//         if (!selector) {
//             setStyle(null);
//             setElement('');
//             return;
//         }


//         setElement(selector.type);
//         setStyle(selector.style);

//     }, [selector])


//     useEffect(() => {

//         if (element === 'DISPLAY')
//             setDisplay({ ...display });

//     }, [element])

//     const onChangeColor = (color) => {
//         setColor(color.hex)
//         document.body.style.backgroundColor = color.hex;
//     }



//     return <> {isLoading && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//         <Space wrap="true" style={{ paddingBottom: 10 }}>
//             <Tooltip placement="top" title="Typeography">
//                 <Button
//                     icon={<MdTextFields size="medium" />}
//                     onClick={(e) => { e.preventDefault(); setActiveTab('1') }}
//                     className={`ac-tabs-btn ${avtiveTab === '1' ? 'active' : ''}`}
//                 >  </Button>
//             </Tooltip>
//             <Tooltip placement="top" title="Size">
//                 <Button
//                     icon={<MdCropSquare size="medium" />}
//                     onClick={(e) => { e.preventDefault(); setActiveTab('2') }}
//                     className={`ac-tabs-btn ${avtiveTab === '2' ? 'active' : ''}`}
//                 >  </Button>
//             </Tooltip>
//             <Tooltip placement="top" title="Spacing">
//                 <Button
//                     icon={<MdSelectAll size="medium" />}
//                     onClick={(e) => { e.preventDefault(); setActiveTab('3') }}
//                     className={`ac-tabs-btn ${avtiveTab === '3' ? 'active' : ''}`}
//                 >  </Button>
//             </Tooltip>
//             <Tooltip placement="top" title="Background">
//                 <Button
//                     icon={<MdGradient size="medium" />}
//                     onClick={(e) => { e.preventDefault(); setActiveTab('4') }}
//                     className={`ac-tabs-btn ${avtiveTab === '4' ? 'active' : ''}`}
//                 >  </Button>
//             </Tooltip>
//             <Tooltip placement="top" title="Border">
//                 <Button
//                     icon={<MdOutlineBorderOuter size="medium" />}
//                     onClick={(e) => { e.preventDefault(); setActiveTab('5') }}
//                     className={`ac-tabs-btn ${avtiveTab === '5' ? 'active' : ''}`}
//                 > </Button>
//             </Tooltip>
//             <Tooltip placement="top" title="Position">
//                 <Button
//                     icon={<MdOutlineFlipToFront size="medium" />}
//                     onClick={(e) => { e.preventDefault(); setActiveTab('6') }}
//                     className={`ac-tabs-btn ${avtiveTab === '6' ? 'active' : ''}`}
//                 >  </Button>
//             </Tooltip>
//             <Tooltip placement="top" title="Display">
//                 <Button
//                     icon={<MdViewQuilt size="medium" />}
//                     onClick={(e) => { e.preventDefault(); setActiveTab('7') }}
//                     className={`ac-tabs-btn ${avtiveTab === '7' ? 'active' : ''}`}
//                 >   </Button>
//             </Tooltip>

//             <Tooltip placement="top" title="Transform">
//                 <Button
//                     icon={<MdNat size="medium" />}
//                     onClick={(e) => { e.preventDefault(); setActiveTab('8') }}
//                     className={`ac-tabs-btn ${avtiveTab === '8' ? 'active' : ''}`}
//                 >   </Button>
//             </Tooltip>

//             <Tooltip placement="top" title="Transform">
//                 <Button
//                     icon={<MdList size="medium" />}
//                     onClick={(e) => { e.preventDefault(); setActiveTab('9') }}
//                     className={`ac-tabs-btn ${avtiveTab === '9' ? 'active' : ''}`}
//                 >   </Button>
//             </Tooltip>

//             <Tooltip placement="top" title="Shadows, Transition, Animation">
//                 <Button
//                     onClick={(e) => { e.preventDefault(); setActiveTab('10') }}
//                     className={`ac-tabs-btn ${avtiveTab === '10' ? 'active' : ''}`}
//                 > Misc </Button>
//             </Tooltip>

//             <Tooltip placement="top" title="Undo">
//                 <Button
//                     icon={<MdUndo size="medium" />}
//                     className="ac-icons-btn"
//                     onClick={(e) => { e.preventDefault(); undoStyle(); _setUStyle(!uStyle); }}
//                 >  </Button>
//             </Tooltip>


//             <Tooltip placement="top" title="Redo">
//                 <Button
//                     icon={<MdRedo size="medium" />}
//                     className="ac-icons-btn"
//                     onClick={(e) => { e.preventDefault(); redoStyle(); _setUStyle(!uStyle); }}
//                 >  </Button>
//             </Tooltip>


//         </Space>
//         <div>



//             <Tooltip placement="left" title="Reset Current Style">
//                 <Button
//                     icon={<MdRestartAlt size="medium" />}
//                     onClick={(e) => {
//                         e.preventDefault();

//                         if (selector) {
//                             for (let i = selector.style.length; i--;) {
//                                 const nameString = selector.style[i];
//                                 selector.style.removeProperty(nameString);
//                             }

//                             setSelector(null);
//                         }

//                     }}
//                     className="ac-icons-btn"
//                 > </Button>
//             </Tooltip>



//         </div>


//     </div>}

//         <div className="inner-box" style={{ padding: 0 }}>


//             <div className="outter-box border w-40p">

//                 {isLoading && <div className="wrapper" style={{ height: 500, overflow: 'auto' }}>

//                     <SwitchComponents active={avtiveTab}>

//                         <Typography style={style} setUStyle={setUStyle} index="1" />
//                         <Size style={style} setUStyle={setUStyle} index="2" />
//                         <Spacing style={style} setUStyle={setUStyle} index="3" />
//                         <Background style={style} setUStyle={setUStyle} selector={selector} index="4" />
//                         <Border style={style} setUStyle={setUStyle} selector={selector} index="5" />
//                         <Position style={style} setUStyle={setUStyle} index="6" />
//                         <Display style={style} setUStyle={setUStyle} setDisplay={setDisplay} selector={selector} index="7" />
//                         <Transform style={style} setUStyle={setUStyle} index="8" />
//                         <List style={style} setUStyle={setUStyle} index="9" />
//                         <Other style={style} setUStyle={setUStyle} selector={selector} index="10" />

//                     </SwitchComponents>

//                 </div>}
//             </div>

//             <div className="outter-box border w-60p">
//                 <div className="wrapper" style={{ position: 'sticky', top: 50, height: '100%', overflow: 'hidden' }}>
//                     <Space style={{ justifyContent: "space-between", width: '100%', marginBottom: 5 }}>
//                         <h3 style={{ margin: 0 }}>Preview: {selector?.name} {'{}'}</h3>
//                         <div style={{ width: 30, height: 30, outline: 'auto', background: color, position: 'relative' }} onClick={(e) => { e.preventDefault(); setColorPicker(!colorPicker) }}>
//                             <div style={{ position: 'absolute', top: 30, left: 30, zIndex: 100 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
//                                 {colorPicker &&
//                                     <SketchPicker
//                                         color={color}
//                                         onChangeComplete={onChangeColor}
//                                     />}
//                             </div>
//                         </div>
//                         {(selector?.type == "HTML" || selector?.type == "DISPLAY") && <Element element={element} setElement={setElement} elements={elements} type={"Preview Type"} />}

//                     </Space>
//                     <div className="hr-line"></div>
//                     <IFrame setIframeDocumnet={setIframeDocumnet}>
//                         <SwitchComponents active={element}>
//                             <RenderHtml index="HTML" cssSelector={selector?.name} />
//                             <_Display display={display} index="DISPLAY" />
//                             <Animation index="ANIMATION" animation={selector?.name} />
//                         </SwitchComponents>

//                     </IFrame>
//                 </div>
//             </div>
//         </div>

//     </>
// }


import { Button, Input, Card, Spin, Alert } from "antd";
import { useState, useReducer, useEffect } from "react";

import IFrame from "@/components/Iframe/setting";
import Fuse from "fuse.js";


import Editor from "./Editor";
import PreviewEditorNav from './Editor/PreviewEditorNav';
import useUndos from "@/lib/hooks/useUndos";
import CanvasEditor from '@/components/Editor/Canvas';


import ThemeServices from "@/lib/services/theme";

import Elements from "./Elements";


import {
    getAllCssData, clearStore,
    deleteAllActions, updateStyleData,
    storeAction, getAction, searchSelector,
    deleteAction, UNDO_STORE_NAME, REDO_STORE_NAME, STYLE_STORE_NAME
} from '@/lib/utils/db';

import { loadGlobalStyles } from "@/lib/utils/manageDB";

const reducer = (state, action) => {

    const deleteSelector = async () => {
        const selectorText = action.selectorText;
        if (selectorText) {
            const key = state.selector.key;
            await updateStyleData({ type: key[0], elementType: key[1], selectorText }, key, true);
        }
    }


    const addSelector = async () => {

        const selectorText = action.selector.selectorText;

        if (selectorText) {
            let selector = { ...action.selector, key: undefined, style: undefined };
            const key = action.selector.key;
            await updateStyleData({ type: key[0], elementType: key[1], ...selector }, key);
        }

    }


    switch (action.type) {
        case "start":
            return { ...state, loading: true }

        case "edit":
            return {
                ...state,
                elementType: action.elementType,
                selector: null,
                error: '',
            }
        case "addSelector":
            addSelector();
            return {
                ...state,
                selector: action.selector,
                error: ''
            }
        case "deleteSelector":
            deleteSelector();
            return { ...state, selector: null, error: '' }
        case "media":
            return { ...state, media: action.media, error: '' }
        case "clearError":
            return { ...state, error: '' }
        case "error":
            return { ...state, error: action.error }
        case "finish":
            return { ...state, loading: false }
        default:
            return state;
    }
};


export default function Style({ }) {

    const [backgroundColor, setBackgroundColor] = useState('#fff');
    const [windowWidth, setWindowWidth] = useState("100%");


    const [minMax, setMinMax] = useState('');
    const [orientation, setOrientation] = useState("");

    const [classNames, setClassNames] = useState([]);

    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        elementType: [],
        selector: null,
        error: ''
    });

    const [isChange, setIsChange] = useState(false);

    const onEdit = async (elementType) => {



        if (!elementType)
            return;

        dispatch({ type: 'edit', elementType: [state.media || 'normal', elementType] });

        const fetchData = async () => {
            const res = await searchSelector(['normal', elementType]);
            const data = res?.selectors ? res.selectors : {};

            const classNames = new Set();

            Object.values(data).forEach((selector) => {
                if (selector.className) {
                    classNames.add(selector.className.trim());
                }
            });

            setClassNames([...classNames]);
        }

        fetchData();

    }


    useEffect(() => {


        const fetchData = async () => {
            try {
                dispatch({ type: 'start' });

                await clearStore(UNDO_STORE_NAME);
                await clearStore(REDO_STORE_NAME);
                await loadGlobalStyles(dispatch, true)
            } finally {
                dispatch({ type: 'finish' });
            }
        }

        fetchData();

    }, [])

    useEffect(() => {



        if (!windowWidth || windowWidth == '100%')
            dispatch({ type: 'media', media: '' })
        else {
            dispatch({ type: 'media', media: `(${minMax}-width: ${windowWidth}px)${orientation ? ` and (orientation: ${orientation})` : ''}` })

        }

    }, [minMax, orientation, windowWidth])

    const onSelectEditorSelector = async (elementType, selectorText) => {
        const res = await searchSelector(['normal', elementType]);
        const data = res?.selectors ? res.selectors : {};
        if (data[selectorText])
            onSelectSelector(data[selectorText]);
    }

    const onSubmit = async () => {

        dispatch({ type: 'start' });


        try {

            const data = await getAllCssData(STYLE_STORE_NAME);

            if (!data) {
                throw new Error('Something went wrong.');
            }

            const styles = data.reduce((acc, cur) => {
                const { elementType, type, mediaIndex, selectors, _uid } = cur;
                if (!acc[type]) {
                    acc[type] = {};
                }
                acc[type][elementType] = { elementType, selectors, mediaIndex, _uid };
                return acc;
            }, {});

            await ThemeServices.saveOrUpdateStyles(styles);

            dispatch({
                type: 'clearError'
            })


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        } finally {
            dispatch({ type: 'finish' });
        }


    };

    const onSelectSelector = async (newSelector, elementstate = '', STORE = UNDO_STORE_NAME) => {



        try {



            if (!newSelector || !state.elementType[1]) {
                throw new Error('Element || Selector not found.');
            }

            dispatch({ type: 'start' });


            let { selectorText, properties, index, type } = newSelector;

            if (!validatClass(selectorText))
                throw new Error('Please Enter Valid Classname.');

            const className = selectorText.substr(1);

            const iframe = document.querySelector("#ac-editor-iframe-doc");
            let iframeDocument = iframe.contentDocument;

            const styleSheets = iframeDocument.styleSheets;
            let sheet = null;

            for (let i = 0; i < styleSheets.length; i++) {
                sheet = styleSheets[i];
                if (sheet.ownerNode.id === 'ac-stylesheet-global')
                    break;
            }


            let cssRules = sheet.cssRules || sheet.rules;

            let rule = null;

            if (state.media) {
                let cssMediaRule = null;

                for (let i = 0; i < cssRules.length; i++) {
                    let tempRule = cssRules[i];
                    if (tempRule.conditionText === state.media) {
                        cssMediaRule = tempRule;
                        break;
                    }
                }

                if (!cssMediaRule) {
                    const mediaIndex = cssRules.length;
                    sheet.insertRule(`@media ${state.media} {}`, mediaIndex);
                    cssMediaRule = cssRules[mediaIndex];
                }

                let mediaRules = cssMediaRule.cssRules || cssMediaRule.rules;
                rule = mediaRules[index];

                for (let i = 0; i < mediaRules.length; i++) {
                    let tempRule = mediaRules[i];
                    if (tempRule.selectorText === selectorText) {
                        rule = tempRule;
                        break;
                    }
                }

                sheet = cssMediaRule;
                cssRules = mediaRules;
            } else {
                for (let i = 0; i < cssRules.length; i++) {
                    let tempRule = cssRules[i];
                    if (tempRule.selectorText === selectorText + elementstate) {
                        rule = tempRule;
                        break;
                    }
                }
            }

            if (!rule) {
                const newIndex = cssRules.length;
                sheet.insertRule(`${selectorText + elementstate} {}`, newIndex);
                rule = cssRules[newIndex];


                onAddAction({
                    action: 'deleteSelector',
                    newSelector: {
                        className,
                        properties,
                        selectorText
                    },
                    key: state.elementType
                }, STORE);


            }



            const selector = {
                style: rule.style,
                properties,
                className,
                selectorText: rule.selectorText,
                key: state.elementType
            };

            const classes = new Set([...classNames, className])
            setClassNames(classes);


            dispatch({ type: 'addSelector', selector });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            dispatch({ type: 'finish' });
        }



    };

    const onRevertSelector = async (newSelector, key, STORE = UNDO_STORE_NAME, isRedo) => {


        dispatch({ type: 'start' });
        try {
            let { selectorText, className, properties, index, type } = newSelector;

            const iframe = document.querySelector("#ac-editor-iframe-doc");
            let iframeDocument = iframe.contentDocument;

            const styleSheets = iframeDocument.styleSheets;
            let sheet = null;

            for (let i = 0; i < styleSheets.length; i++) {
                sheet = styleSheets[i];
                if (sheet.ownerNode.id === 'ac-stylesheet-global')
                    break;
            }
            let cssRules = sheet.cssRules || sheet.rules;

            let rule = null;

            if (state.media) {
                let cssMediaRule = null;

                for (let i = 0; i < cssRules.length; i++) {
                    let tempRule = cssRules[i];
                    if (tempRule.conditionText === state.media) {
                        cssMediaRule = tempRule;
                        break;
                    }
                }

                if (!cssMediaRule) {
                    const mediaIndex = cssRules.length;
                    sheet.insertRule(`@media ${state.media} {}`, mediaIndex);
                    cssMediaRule = cssRules[mediaIndex];
                }

                let mediaRules = cssMediaRule.cssRules || cssMediaRule.rules;
                rule = mediaRules[index];

                for (let i = 0; i < mediaRules.length; i++) {
                    let tempRule = mediaRules[i];
                    if (tempRule.selectorText === selectorText) {
                        rule = tempRule;
                        break;
                    }
                }

                sheet = cssMediaRule;
                cssRules = mediaRules;
            } else {
                for (let i = 0; i < cssRules.length; i++) {
                    let tempRule = cssRules[i];
                    if (tempRule.selectorText === selectorText) {
                        rule = tempRule;
                        break;
                    }
                }
            }

            if (!rule) {
                const newIndex = cssRules.length;
                sheet.insertRule(`${selectorText} {}`, newIndex);
                rule = cssRules[newIndex];
            }



            const selector = {
                style: rule.style,
                className,
                properties,
                selectorText: rule.selectorText,
                key
            };

            setClassNames((prevClassNames) => new Set([...prevClassNames, className]));

            onAddAction({
                action: 'deleteSelector',
                newSelector: {
                    className,
                    properties,
                    selectorText
                },
                key
            }, STORE, isRedo);

            dispatch({ type: 'addSelector', selector });

        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
        } finally {
            dispatch({ type: 'finish' });
        }



    };

    const onDeleteSelector = async (selector, STORE = UNDO_STORE_NAME, isRedo) => {
        try {

            if (!selector)
                throw new Error('Selector not found!');

            const iframe = document.querySelector("#ac-editor-iframe-doc");
            const iframeDocument = iframe.contentDocument;

            const { index, className,
                properties,
                selectorText,
                key } = selector;

                const styleSheets = iframeDocument.styleSheets;
                let sheet = null;
    
                for (let i = 0; i < styleSheets.length; i++) {
                    sheet = styleSheets[i];
                    if (sheet.ownerNode.id === 'ac-stylesheet-global')
                        break;
                }
            for (var i = 0; i < sheet.cssRules.length; i++) {
                var rule = sheet.cssRules[i];
                if (rule.selectorText === selectorText) {
                    sheet.deleteRule(i);
                    break;
                }
            }

            const elements = iframeDocument.body.querySelectorAll("[data-id]");
            elements.forEach(element => {
                element.style.outline = '1px dotted #bdbdbd';
            });

            await updateStyleData(
                {
                    type: key[0],
                    elementType: key[1],
                    selectorText
                },
                key,
                true
            );

            setClassNames((prevClassNames) => {
                const updatedClassNames = new Set(prevClassNames);
                updatedClassNames.delete(className);
                return updatedClassNames;
            });

            onAddAction({
                action: 'addSelector',
                newSelector: {
                    className,
                    properties,
                    selectorText
                },
                key
            }, STORE, isRedo);

            dispatch({
                type: 'deleteSelector',
                selector: state.selector
            })


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        }
        finally {
        }
    };

    const onUpdateSelector = async (selector, STORE = UNDO_STORE_NAME, isRedo) => {


        dispatch({ type: 'start' });

        try {

            if (!selector) {
                throw new Error('Selector not found!');
            }



            const iframe = document.querySelector("#ac-editor-iframe-doc");
            let iframeDocument = iframe.contentDocument;

            const styleSheets = iframeDocument.styleSheets;
            let sheet = null;

            for (let i = 0; i < styleSheets.length; i++) {
                sheet = styleSheets[i];
                if (sheet.ownerNode.id === 'ac-stylesheet-global')
                    break;
            }            
            
            let cssRules = sheet.cssRules || sheet.rules;

            const sel = { ...selector, key: undefined, style: undefined }
            const key = selector.key;

            const res = await searchSelector(key);
            const data = res?.selectors ? res.selectors : {};
            let savedSelector = data[selector.selectorText];


            let rule = null;
            for (let i = 0; i < cssRules.length; i++) {
                let tempRule = cssRules[i];
                if (tempRule.selectorText === selector.selectorText) {
                    rule = tempRule;
                    break;
                }
            }

            if (rule) {
                // Remove existing properties
                const styleDeclaration = rule.style;
                const properties = Array.from(styleDeclaration);
                properties.forEach(property => {
                    styleDeclaration.removeProperty(property);
                });

                if (!selector.properties)
                    selector.properties = {};
                Object.keys(selector.properties).forEach(key => {
                    
                    const value = selector.properties[key]?.value;
                    const priority = selector.properties[key]?.priority;
                    rule.style.setProperty(key, value, priority);
                });
            }

            if (savedSelector)
                onAddAction({
                    action: 'updateStyle',
                    savedSelector: {
                        ...savedSelector,
                    },
                    key: key
                }, STORE, isRedo);

            await updateStyleData({ type: key[0], elementType: key[1], ...sel }, key);


        } catch (e) {
            dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

        }
        finally {
            dispatch({ type: 'finish' });

        }


    };


    const onAddAction = async (action, STORE, isRedo) => {

        if (!isRedo) {
            // const actions = await getAllActions(REDO_STORE_NAME);
            await deleteAllActions(REDO_STORE_NAME);

            //await storeActions(actions, UNDO_STORE_NAME)
        }

        await storeAction(action, STORE);
    };

    const performAction = async (STORE1, STORE2) => {
        const action = await getAction(STORE1);

        if (!action)
            return;

        switch (action.action) {

            case 'addSelector':
                await onRevertSelector(
                    action.newSelector,
                    action.key,
                    STORE2, true);
                break;
            case 'deleteSelector':
                await onDeleteSelector(
                    { ...action.newSelector, key: action.key },
                    STORE2, true);
                break;
            case 'updateStyle':
                await onUpdateSelector(
                    { ...action.savedSelector, key: action.key },
                    STORE2, true);
                break;
            default:
                break;


        }

        await deleteAction(STORE1);
    };

    const undo = async () => {
        await performAction(UNDO_STORE_NAME, REDO_STORE_NAME);
    };

    const redo = async () => {
        await performAction(REDO_STORE_NAME, UNDO_STORE_NAME);

    };



    const validatClass = (inputValue) => {
        const regex = /^\.[a-zA-Z][\w-]*$/;
        const isValid = regex.test(inputValue);
        return isValid;
    };



    const onChange = async (val) => {
        // let otherProperties = {}
        // if (others)
        //     Object.keys(others).forEach((key) => {
        //         otherProperties[key] = others[key];
        //     })

        // state.selector.properties[key] = { value, ...otherProperties }
        setIsChange({});

    }

    const LeftTools = () => <span>Style: &nbsp;&nbsp; <Input
        style={{ width: 50, height: 25, backgroundColor }} type="color" onChange={(e) => setBackgroundColor(e.target.value)} />
    </span>

    const RightTools = () => <span></span>


    return <Card loading={state.loading && !document}
        headStyle={{ padding: 10 }}
        bodyStyle={{ padding: 0 }}
        extra={<Button type="primary" onClick={onSubmit} loading={state.loading}> Save </Button>}
        title={<><PreviewEditorNav
            undoStyle={undo}
            redoStyle={redo}
            windowWidth={windowWidth}
            setWindowWidth={setWindowWidth}
            minMax={minMax}
            setMinMax={setMinMax}
            orientation={orientation}
            setOrientation={setOrientation}
            LeftTools={LeftTools}
            RightTools={RightTools}
        /></>}>

        {state.error && <Alert message={state.error} style={{ margin: '10px 0' }} type="error" showIcon closable />}


        <Editor
            onDelete={onDeleteSelector}
            state={state}
            onSubmit={onUpdateSelector}
            onEdit={onEdit}
            onSelect={onSelectSelector}
            onChange={onChange}
            isChange={isChange}
        >

            <CanvasEditor windowWidth={windowWidth} setWindowWidth={setWindowWidth}>
                <Spin tip="Loading" size="small" spinning={state.loading}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                </Spin>
                <IFrame onLoad={onEdit}>
                    <div style={{ backgroundColor, width: '100%', height: '100%' }}>

                        <Elements
                            onSelect={onSelectEditorSelector}
                            className={state.selector?.className}
                            classNames={classNames}
                            elementType={state.elementType[1]}
                        />
                    </div>
                </IFrame>

            </CanvasEditor>

        </Editor>

    </Card>

}

