import React from 'react';


import ELements from './Elements';
export default function NestedElements({
  childs, elements, states,setStates, setColStates, colStates, docStates, formStates, setFormStates  }) {


  return childs.map((_uid, index) => {

    const child = elements[_uid];
    return <>
     <ELements
     setColStates={setColStates}
     colStates={colStates}
     elements={elements}
     setStates={setStates}
     states={states}
      element={child}
      index={index}
      docStates={docStates}
      formStates={formStates}
      setFormStates={setFormStates}
      key={child._uid}
    /> 
    </>
  })

}