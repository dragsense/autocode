import React, { useEffect } from "react";
import List from "./List";
import Components from "./index";
import { fetcher } from "@/lib/fetch";


const getStateValue = (key, states) => {

  let value = states.find(state => state.key === key[0]);

  if (key[1])
    value = value.defaultValue.find((state, index) => state.key == key[1] || index == key[1]);


  if (key[2])
    value = value.defaultValue.find(state => state.key === key[2]);


  return value.defaultValue ?? value;
}
export default ({ component, props, parent, key }) => {
  const [error, setError] = React.useState("");


  const colStates = component.colStates ? component.colStates : [];

  const [states, setStates] = React.useState([
    ...component.states, ...colStates
  ]);

  // const [props, setProps] = React.useState([
  //   ...props
  // ]);

  // useEffect(() => {
  //   setProps([...props]);
  // }, [props]);

  useEffect(() => {
    setStates([...component.states])
  }, [component.states])

  useEffect( () => {
    try {
      eval(component.init?.mount);
    } catch (e) {
      setError(e.message);
    }

    return () => {

      try {
        eval(component.init?.unmount);
      } catch (e) {
        setError(e.message);
      }
    };
  }, []);

  const isMapping = component.map ? true : false;

  const mapping = (states) => {
    return getStateValue(component.map, states);
  };




  const conditions = !component.conditions
    ? true
    : element.conditions?.reduce((prev, current) => {

      const value = getStateValue(current.key, states);
      switch (current.type) {
        case '=':
          return value == current.value
          break;
        case '!=':
          return value != current.value
          break;
        case '<':
          return value < current.value
          break;
        case '<=':
          return value <= current.value
          break;
        case '>':
          return value > current.value
          break;
        case '>=':
          return value >= current.value
          break;
        default:
          return value == current.value
      }


    }, true);



  if (error)
    return (
      <div>
        <span style={{ color: "red" }}>An Error Has Occured.</span>
        <details>{error && error.toString()}</details>
      </div>
    );

  const RenderList = (mapValue) => {
    return component.elements.map((i, index) => {
      if (i.component) {
        return (
          <Components
            key={i._uid}
            parent={component.elements}
            block={i}
            props={props}
          />
        );
      }

      return (
        <List
          key={i._uid}
          element={i}
          mapValue={mapValue}
          component={component}
          parent={parent}
        
          props={props}
          states={states}
          setStates={setStates}
          index={index}
        />
      );
    });
  };

  const Render = isMapping
    ? mapping(states).map((val) =>
      RenderList(val)
    )
    : RenderList();

  return <React.Fragment>{conditions && Render}</React.Fragment>;
};
