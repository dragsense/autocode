


import { useEffect, useState } from "react";

import { Cascader } from "antd";
;

export default function ElementMapping({ cascaderStates, state, setState, setIsChange }) {

  const [currentMap, setCurrentMap] = useState([]);


  useEffect(() => {

    if (!cascaderStates)
      return;

console.log(cascaderStates);
      setCurrentMap(cascaderStates.filter(
        state => state.type == 'STATES'
       || state.type == 'PROPS' 
       || state.type == 'GLOBAL'
      || state.type == 'COLSTATES')
        .map(state => {
          return {
            ...state,
            children: state.children.filter(state => state.type == "array" ||
            state.type == "arraylength" 
            ||
             state.type == 'images').map(state => {  
              return {
                ...state,
                children: null
              }
            })
          }
        }
        ));

  }, [cascaderStates]);

  const onChangekey = (keys) => {


    if (keys === undefined || keys[0] === undefined) {
      setState({ ...state, map: undefined });

    } else {

      const value = [...keys];

      const map = state.map ?? {};

      map.type = value[0];
      value.shift();
      map.key = value;

      setState({ ...state, map });
    }

    setIsChange(true);

  }


  return <>

    <Cascader style={{ width: '100%' }} options={currentMap}
      value={state.map
        ?
        [state.map.type, ...(Array.isArray(state.map.key) ?
          state.map.key : [])] : [undefined]}
      onChange={onChangekey}>

    </Cascader>
  </>
};


