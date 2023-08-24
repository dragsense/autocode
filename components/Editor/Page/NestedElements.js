import React, { useState, useEffect, useRef } from 'react';
const e = React.createElement;

import { getData } from "@/lib/utils/db";

import ELements from './Elements';
import Components from './components';

export default function NestedElements({
  componentType = 'none',
  mapIndex,
  mapValue,
  parent,
  childs,
  setFormStates,
  formStates,
  colStates,
  setColStates,
  docStates,
  docRelations,
  props,
  index,
  setProps,
  states,
  children,
  setStates }) {


  return <Components type={componentType} states={states} index={index}>{childs.map((_uid, index) => {



    return <ELements
      mapValue={mapValue}
      mapIndex={mapIndex}
      parent={parent}
      index={index}
      states={states}
      props={props}
      setProps={setProps}
      formStates={formStates}
      setFormStates={setFormStates}
      docStates={docStates}
      colStates={colStates}
      setColStates={setColStates}
      docRelations={docRelations}
      setStates={setStates}
      key={_uid}
      _uid={_uid} />
  })}</Components>

}