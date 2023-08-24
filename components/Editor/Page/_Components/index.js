import React, { useEffect, useState } from "react";
import Component from "./Component";
import { useComponentsStates } from "../../PageProvider";

export default function Components({ block, props, parent }) {

  const { get } = useComponentsStates();
  const [isLoading, setIsLoading] = useState(false);
  const [component, setCompoent] = useState(null);

  useEffect( () => {

    setIsLoading(true);
    if (block.id && block.component) {
      const comp =  get(block.id);
      setCompoent(comp)
    }
    else setCompoent(block);
    setIsLoading(false);

  }, [])

  return component ? React.createElement(Component, {
    key: component._uid,
    component: component,
    props,
    parent

  }) : <>{isLoading && 'Loading...'}</>
}
