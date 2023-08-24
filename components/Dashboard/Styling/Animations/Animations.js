
import { Button, Input, Card, Spin, Alert, Tooltip, InputNumber, Radio, Select, Divider } from "antd";
import { useState, useReducer, useEffect } from "react";

const { Option } = Select;
import IFrame from "@/components/Iframe/setting";

import { AnimationsIFrame } from "@/components/Iframe/setting";

import { MdRedo, MdUndo } from "react-icons/md";
import PreviewEditorNav from '../Style/Editor/PreviewEditorNav';
import useUndos from "@/lib/hooks/useUndos";

import RigthSideBar from "../Style/Editor/RightSideBar";
import ThemeServices from "@/lib/services/theme";

import { Preview } from './Preview';
import Add from './Add';
import CanvasEditor from "@/components/Editor/Canvas";
import { loadAnimationStyles } from "@/lib/utils/manageDB";

import {
  getAllCssData, clearStore, deleteStyleData,
  deleteAllActions, updateStyleData,
  storeAction, getAction, searchSelector,
  deleteAction, UNDO_STORE_NAME, REDO_STORE_NAME, STYLE_STORE_NAME, storePage
} from '@/lib/utils/db';



// const reducer = (state, action) => {


//   const udpateStyle = () => {
//     let index = state.selectors.findIndex(s => s.selectorText == action.selectorText);
//     if (index !== -1) {
//       const style = state.selectors[index].style;
//       state.selectors[index].style = { ...style, ...action.style }
//     }
//   }



//   const deleteSelector = () => {
//     let index = state.selectors.findIndex(s => s.selectorText === action.selectorText);
//     if (index !== -1) {
//       state.selectors.splice(index, 1);
//     }
//   }


//   const addAnimation = () => {
//     let index = state.animations.findIndex(anim => anim === action.animation?.name);
//     if (index == -1 && action.animation?.name) {
//       state.animations.push(action.animation.name);

//     }
//   }


//   const deleteAnimation = () => {
//     let index = state.animations.findIndex(anim => anim === action.animation?.name);
//     if (index !== -1) {
//       state.animations.splice(index, 1);
//     }

//   }


//   switch (action.type) {
//     case "start":
//       return { ...state, loading: true }
//     case "document":
//       return {
//         ...state, document: action.document,
//         error: ''
//       }
//     case "load":
//       return {
//         ...state, animations: action.data,
//         error: ''
//       }
//     case "edit":

//       addAnimation();
//       return {
//         ...state,
//         selectors: action.data,
//         animation: action.animation,
//         selector: null,
//         error: '',
//         isChange: false,
//       }

//     case "add":
//       return {
//         ...state,
//         selectors: [...state.selectors,
//         {
//           ...action.selector,
//           style: {},
//           index: undefined
//         }],
//         selector: action.selector,
//         ruleIndex: action.ruleIndex,
//         error: ''
//       }
//     case "update":
//       return {
//         ...state,
//         selector: action.selector,
//         ruleIndex: action.ruleIndex,

//         error: ''
//       }
//     case "change":
//       udpateStyle();
//       return {
//         ...state,
//         error: '',
//         isChange: true,

//       }
//     case "delete":
//       deleteSelector();
//       return { ...state, selector: null, error: '' }
//     case "deleteAnimation":
//       deleteAnimation();
//       return { ...state, selectors: [], animation: null, selector: null, error: '' }
//     case "close":
//       return { ...state, selector: null, error: '' }

//     case "clearError":
//       return { ...state, error: '' }
//     case "error":
//       return { ...state, error: action.error }
//     case "finish":
//       return { ...state, loading: false }
//     default:
//       return state;
//   }
// };

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



  const deleteAnimation = async () => {

    const key = action.key;
    await deleteStyleData(key);


  }

  switch (action.type) {
    case "start":
      return { ...state, loading: true }
    case "load":
      return {
        ...state, animations: action.data,
        error: ''
      }
    case "edit":
      return {
        ...state,
        elementType: action.elementType,
        animationName: action.animationName,
        selector: null,
        error: '',
      }
    case "add":
      addSelector();
      return {
        ...state,
        selector: action.selector,
        error: ''
      }
    case "delete":
      deleteSelector();
      return { ...state, selector: null, error: '' }
    case "deleteAnimation":
      deleteAnimation();
      return { ...state, animationName: '', selector: null, error: '' }
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



export default function Animations({ menuKeys }) {

  const [backgroundColor, setBackgroundColor] = useState('#fff');
  const [isChange, setIsChange] = useState(false);



  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    animationsName: "",
    elementType: [],
    selector: null,
    animations: [],
    animation: "",
    error: ''
  });



  useEffect(() => {


    const fetchData = async () => {
      try {
        dispatch({ type: 'start' });

        await clearStore(UNDO_STORE_NAME);
        await clearStore(REDO_STORE_NAME);
        await loadAnimationStyles(dispatch, true);
      } finally {

        dispatch({ type: 'finish' });
      }

    }

    fetchData();

  }, [])


  const onEdit = async (animationName) => {

    if (!animationName)
      return;

    dispatch({ type: 'edit', animationName: animationName, elementType: ['normal', animationName] });

  }


  const onSubmit = async () => {


    dispatch({ type: 'start' });


    try {

      const data = await getAllCssData(STYLE_STORE_NAME);

      if (!data) {
        throw new Error('Something went wrong.');
      }

      const animations = data.reduce((acc, cur) => {
        const { elementType, type, selectors, _uid } = cur;
        if (!acc[type]) {
          acc[type] = {};
        }
        acc[type][elementType] = { elementType, selectors, _uid };
        return acc;
      }, {});


      await ThemeServices.saveOrUpdateAnimation(animations);

      dispatch({
        type: 'clearError'
      })


    } catch (e) {
      dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

    } finally {
      dispatch({ type: 'finish' });
    }


  };

  const onDeleteAnimation = async (animationName, STORE = UNDO_STORE_NAME, redo) => {
    try {


      if (!animationName)
        throw new Error('Animation not selected!')

      const elementType = ['normal', animationName];

      const iframe = document.querySelector("#ac-editor-iframe-doc");
      let iframeDocument = iframe.contentDocument;

      const sheet = iframeDocument.styleSheets[0];
      const cssRules = sheet.cssRules || sheet.rules;
      const rules = Array.from(cssRules).filter(rule => rule.type === 7);
      const ruleIndex = rules.findIndex(item => item.name === animationName);

      if (ruleIndex >= 0) {
        sheet.deleteRule(ruleIndex);
        console.log(elementType);

        const res = await deleteStyleData(elementType);



        onAddAction({
          action: 'addAnimation',
          animation: {
            value: { ...res },
            elementType: elementType,
            animationName: animationName
          },

        }, STORE, redo);

        dispatch({
          type: 'deleteAnimation',
          key: state.elementType
        })

      }


    } catch (e) {
      console.log(e?.message)
      dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

    }
    finally {
    }
  };

  const onRevertAnimation = async (animation, STORE = UNDO_STORE_NAME, redo) => {
    try {

      const { animationName, elementType, value } = animation;
      if (!elementType || !animationName)
        throw new Error('Animation not selected!')

      const iframe = document.querySelector("#ac-editor-iframe-doc");
      let iframeDocument = iframe.contentDocument;

      const sheet = iframeDocument.styleSheets[0];
      const cssRules = sheet.cssRules || sheet.rules;
      const rules = Array.from(cssRules).filter(rule => rule.type === 7);
      const ruleIndex = rules.findIndex(item => item.name === animationName);

      let keyframesRule;
      if (ruleIndex < 0) {

        let cssText = '';
        const selectors = value.selectors;
        for (const selector in selectors) {
          const properties = selectors[selector].properties;
          cssText += `${selector} {`

          for (const property in properties) {
            console.log(property)
            const value = properties[property].value;
            cssText += `${property}: ${value}; `;

          }
          cssText += `}`

        }

        keyframesRule = `@keyframes ${animationName} {${cssText}}`;
        sheet.insertRule(keyframesRule, cssRules.length);

        await storePage(value, STYLE_STORE_NAME)

        onAddAction({
          action: 'deleteAnimation',
          animationName,
        }, STORE, redo);

        dispatch({ type: 'edit', animationName: animationName, elementType: ['normal', animationName] });

      }


    } catch (e) {
      dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

    }
    finally {
    }
  };

  const onSelectSelector = async (newSelector, STORE = UNDO_STORE_NAME, redo) => {

    try {

      let { selectorText, properties, animationName = state.animationName } = newSelector;

      if (!selectorText || !animationName) {
        throw new Error('Animation || Selector not found.');
      }

      dispatch({ type: 'start' });



      if (!validatClass(selectorText))
        throw new Error('Please Enter Valid Selector.');


      const iframe = document.querySelector("#ac-editor-iframe-doc");
      let iframeDocument = iframe.contentDocument;

      const sheet = iframeDocument.styleSheets[0];
      const cssRules = sheet.cssRules || sheet.rules;

      // Find the keyframes rule for the animation or create it if it doesn't exist
      let ruleIndex = -1;
      for (let i = 0; i < cssRules.length; i++) {
        const rule = cssRules[i];
        if (rule.type === 7 && rule.name === animationName) {
          ruleIndex = i;
          break;
        }
      }

      let keyframesRule;
      if (ruleIndex < 0) {
        keyframesRule = `@keyframes ${animationName} {}`;
        ruleIndex = sheet.insertRule(keyframesRule, cssRules.length);
      }


      const keyframesRules = cssRules[ruleIndex];
      // Find the rule for the current selector or create it if it doesn't exist
      let index = -1

      for (let i = 0; i < keyframesRules.cssRules.length; i++) {
        const selector = keyframesRules.cssRules[i].keyText;
        if (selector === selectorText) {
          index = i;
          break;
        }
      }


      let rule;
      if (index < 0) {
        const ruleText = `${selectorText} {}`;
        index = keyframesRules.appendRule(ruleText);
        rule = keyframesRules.cssRules[keyframesRules.cssRules.length - 1];
        onAddAction({
          action: 'deleteSelector',
          newSelector: {
            properties,
            selectorText,
            animationName
          },
          key: ["normal", animationName]
        }, STORE, redo);

      } else
        rule = keyframesRules.cssRules[index];

      const selector = {
        style: rule.style,
        properties,
        selectorText: rule.keyText,
        key: ["normal", animationName]
      };

      dispatch({ type: 'add', selector });

    } catch (e) {
      dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });
    } finally {
      dispatch({ type: 'finish' });
    }



  };


  const onDeleteSelector = async (selector, STORE = UNDO_STORE_NAME, isRedo) => {
    try {

      let { properties,
        selectorText,
        key, animationName = state.animationName } = selector;

      if (!animationName)
        throw new Error('Selector not found!');

      const iframe = document.querySelector("#ac-editor-iframe-doc");
      let iframeDocument = iframe.contentDocument;

      const sheet = iframeDocument.styleSheets[0];
      let cssRules = sheet.cssRules || sheet.rules;


      // Find the keyframes rule for the animation or create it if it doesn't exist
      let ruleIndex = -1;
      for (let i = 0; i < cssRules.length; i++) {
        const rule = cssRules[i];
        if (rule.type === 7 && rule.name === animationName) {
          ruleIndex = i;
          break;
        }
      }


      if (ruleIndex < 0) {
        throw new Error('Animation not found!');
      }



      let keyframeToDeleteKey = '';

      const keyframeRule = cssRules[ruleIndex];
      for (let i = 0; i < keyframeRule.cssRules.length; i++) {
        const rule = keyframeRule.cssRules[i];
        if (rule.keyText === selectorText) {
          keyframeToDeleteKey = rule.keyText;
          break;
        }
      }

      if (keyframeToDeleteKey) {
        keyframeRule.deleteRule(keyframeToDeleteKey);

        await updateStyleData(
          {
            type: key[0],
            elementType: key[1],
            selectorText
          },
          key,
          true
        );

        onAddAction({
          action: 'addSelector',
          newSelector: {
            animationName,
            properties,
            selectorText
          },
          key
        }, STORE, isRedo);

        dispatch({
          type: 'delete',
          selector: state.selector
        })


      } else {
        throw new Error('Selector not found!');
      }

      console.log(keyframeRule)


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

      let sheet = iframeDocument.styleSheets[0];
      let cssRules = sheet.cssRules || sheet.rules;

      const sel = { ...selector, key: undefined, style: undefined }
      const key = selector.key;

      const res = await searchSelector(key);
      const data = res?.selectors ? res.selectors : {};
      let savedSelector = data[selector.selectorText];


      // Find the keyframes rule for the animation or create it if it doesn't exist
      let ruleIndex = -1;
      for (let i = 0; i < cssRules.length; i++) {
        const rule = cssRules[i];
        if (rule.type === 7 && rule.name === state.animationName) {
          ruleIndex = i;
          break;
        }
      }

      if (ruleIndex < 0) {
        throw new Error('Animation not found!');
      }


      // Find the rule for the current selector or create it if it doesn't exist
      let index = -1

      for (let i = 0; i < cssRules[ruleIndex].cssRules.length; i++) {
        const sel = cssRules[ruleIndex].cssRules[i].keyText;
        if (sel === selector.selectorText) {
          index = i;
          break;
        }
      }


      let rule;
      if (index < 0)
        throw new Error('Rule not found!');

      rule = cssRules[ruleIndex].cssRules[index];

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
        await onSelectSelector(
          action.newSelector,
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
      case 'addAnimation':
        await onRevertAnimation(
          action.animation,
          STORE2, true);
        break;
      case 'deleteAnimation':
        await onDeleteAnimation(
          action.animationName,
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
    const regex = /^(100|[1-9][0-9]?|0)%|from|to$/;
    const isValid = regex.test(inputValue);
    return isValid;
  };



  const onChange = async (name, value, priority, unit) => {

    state.selector.properties[name] = { value, priority, unit }

    setIsChange(true);

  }

  const LeftTools = () => <span>Setting: &nbsp;&nbsp; <Input
    style={{ width: 50, height: 25, backgroundColor }} type="color" onChange={(e) => setBackgroundColor(e.target.value)} />
  </span>

  const RightTools = () => <>

    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 20 }}>
      <Tooltip placement="bottom" title="Undo">
        <Button
          icon={<MdUndo size={20} />}
          onClick={(e) => { e.preventDefault(); undo(); }}
        >  </Button>
      </Tooltip>

      <Tooltip placement="bottom" title="Redo">
        <Button
          icon={<MdRedo size={20} />}
          onClick={(e) => { e.preventDefault(); redo(); }}
        >  </Button>
      </Tooltip>

    </div>
  </>

  const [delay, setDelay] = useState(1);
  const [duration, setDuration] = useState(4);
  const [timeFun, setTimeFun] = useState('ease');
  const [direction, setDirection] = useState('normal');
  const [fillMode, setFillMode] = useState('none');
  const [playState, setPlayState] = useState('running');

  const [width, setWidth] = useState(30);
  const [height, setHeight] = useState(30);
  const [borderRadius, setBorderRadius] = useState(0);
  const [backgroundItemColor, setBackgroundItemColor] = useState('#ffffff');

  const inputs = `${duration + "s"} ${timeFun} ${delay + "s"} infinite ${direction} ${fillMode} ${playState}  ${state.animationName}`;
  const style = {
    animation: inputs,
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: `${borderRadius}px`,
    backgroundColor: backgroundItemColor
  }

  return <div ><Card loading={state.loading && !document}
    headStyle={{ padding: 10 }}
    bodyStyle={{ padding: 0 }}
    extra={<Button type="primary" onClick={onSubmit} loading={state.loading} disabled={!isChange}>Save</Button>}
    title={<><div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <LeftTools /> <div style={{ width: 400 }}>
        <Add onDelete={onDeleteAnimation}
          animation={state.animationName}
          onEdit={onEdit} />
      </div><RightTools /></div></>}>

    {state.error && <Alert message={state.error}
      style={{ margin: '10px 0' }} type="error" showIcon closable />}
    <div style={{ display: 'flex', minHeight: '85vh', position: 'relative' }}>


      <Spin tip="Loading" size="small" spinning={state.loading}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
      </Spin>


      <div style={{ width: 280 }}>
        {state.animationName ? (
          <div>
            <Card>
              <div style={{ marginBottom: 16 }}>
                <label>Width: </label>&nbsp; &nbsp;
                <InputNumber
                  value={width}
                  onChange={(value) => setWidth(value)}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Height: </label> &nbsp; &nbsp;
                <InputNumber
                  value={height}
                  onChange={(value) => setHeight(value)}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Border Radius: </label> &nbsp; &nbsp;
                <InputNumber
                  value={borderRadius}
                  onChange={(value) => setBorderRadius(value)}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Background:</label> &nbsp; &nbsp;
                <input
                  type="color"
                  value={backgroundItemColor}
                  onChange={(e) => setBackgroundItemColor(e.target.value)}
                />
              </div>
              <Divider orientation="left" orientationMargin="0">Animation</Divider>
              <div style={{ marginBottom: 16 }}>
                <label>Name: </label> &nbsp; &nbsp;
                <strong>{state.animationName}</strong>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Duration: </label> &nbsp; &nbsp;
                <InputNumber
                  value={duration}
                  onChange={(value) => setDuration(value)}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Timing Function: </label> &nbsp; &nbsp;
                <Select
                  style={{ width: 120 }}
                  value={timeFun}
                  onChange={(value) => setTimeFun(value)}
                >
                  <Option value="linear">linear</Option>
                  <Option value="ease">ease</Option>
                  <Option value="ease-in">ease-in</Option>
                  <Option value="ease-in-out">ease-in-out</Option>
                  <Option value="ease-out">ease-out</Option>
                  <Option value="cubic-bezier(0.1, -0.6, 0.2, 0)">
                    cubic-bezier(0.1, -0.6, 0.2, 0)
                  </Option>
                  <Option value="cubic-bezier(0, 1.1, 0.8, 4)">
                    cubic-bezier(0, 1.1, 0.8, 4)
                  </Option>
                  <Option value="steps(3, start)">steps(3, start)</Option>
                  <Option value="steps(4)">steps(4)</Option>
                </Select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Delay: </label>&nbsp; &nbsp;
                <InputNumber value={delay} onChange={(value) => setDelay(value)} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Direction: </label>&nbsp; &nbsp;
                <Select
                  style={{ width: 120 }}
                  value={direction}
                  onChange={(value) => setDirection(value)}
                >
                  <Option value="normal">normal</Option>
                  <Option value="reverse">reverse</Option>
                  <Option value="alternate">alternate</Option>
                  <Option value="alternate-reverse">alternate-reverse</Option>
                </Select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Fill Mode: </label>&nbsp; &nbsp;
                <Select
                  style={{ width: 120 }}
                  value={fillMode}
                  onChange={(value) => setFillMode(value)}
                >
                  <Option value="none">none</Option>
                  <Option value="forwards">forwards</Option>
                  <Option value="backwards">backwards</Option>
                  <Option value="both">both</Option>
                </Select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label>Play State: </label>&nbsp; &nbsp;
                <Radio.Group
                  value={playState}
                  onChange={(e) => setPlayState(e.target.value)}
                >
                  <Radio value="running">Running</Radio>
                  <Radio value="paused">Paused</Radio>
                </Radio.Group>
              </div>

            </Card>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>

        <AnimationsIFrame>
          <div style={{ backgroundColor, width: '100%', height: '100%' }}>
            <Preview style={style} />
          </div>
        </AnimationsIFrame>
      </div>

      <div style={{ height: '100%' }}>

        <RigthSideBar
          selector={state.selector}
          selectorKey={state.elementType}
          onSelect={onSelectSelector}
          onDelete={onDeleteSelector}
          onSubmit={onUpdateSelector}
          onChange={onChange}
          animation={true}
          width={'300px'}
          mode={"light"}
          menuKeys={menuKeys}
        >
          <div style={{ textAlign: 'right', marginTop: 10, padding: 10 }}>
            <Button type="primary" onClick={(e) => {
              e.preventDefault();
              onUpdateSelector(state.selector);
            }

            } loading={state.loading} disabled={!isChange}> Update </Button>
          </div>
        </RigthSideBar>
      </div>
    </div>





  </Card>
  </div>
}

