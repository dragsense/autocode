// import React, { useEffect, forwardRef, useState, useMemo } from "react";

// import FormServices from "@/lib/services/forms";
// import Element from "./Element";
// import { getStateValue } from "../../../lib/utils/elementNode";

// const e = React.createElement;



// export default forwardRef(({
//     parent,
//     node,
//     index,
//     element,
//     props,
//     setProps,
//     states,
//     docStates,
//     docRelations,
//     setStates,
//     colStates,
//     setColStates,
//     children,
//     hoverPosition,
//     mapValue,
//     mapIndex,
//     hovering,
//     onSelect
// }, ref) => {


//     const [formStates, setFormStates] = useState([]);
//     //const [form, setForm] = useState(null);


//     const laod = async () => {
//         try {
//             const _id = element.form._id;


//             const res = await FormServices.get(_id);

//             const newFormStates = Array.isArray(res.form.states) ? res.form.states : [];
//             setFormStates(newFormStates);
//            // setForm(res.form);


//         } catch (e) {
//             console.log(e?.message)
//         } finally {
//         }
//     }

//     useEffect(() => {


//         if (!element.form)
//             return;

//             laod();


//     }, []);


//     const onSubmit = async (e) => {


//         if(!element.form) {
//             console.log("Sorry! Form not selected.");
//             return;
//         }



//         try {

//             const _id = element.form._id;

//             responseBody = JSON.stringify(formStates);
//             const formData = new FormData(e.currentTarget);
//             formData.forEach((value, property) => responseBody[property] = value);
//             const res = await FormServices.submit(_id, responseBody);

//             if (res.redirect)
//                 Router.push(res.redirect);
//             else {
//                 const successElem = document.querySelector('#' + element.messgaeID);

//                 if(successElem)
//                 element.innerText = res.message || 'Successfuly Submit. Thank You!';
//             }

//         } catch (e) {

//             const errorElem = document.querySelector('#' + element.errorId);

//             if (errorElem)
//                 errorElem.innerText = e?.message || 'Something went wrong. Please try again!';

//         } finally {

//         }

//     }


//     return <form onSubmit={onSubmit}><Element ref={ref}
//         index={index}
//         node={node}
//         hovering={hovering}
//         hoverPosition={hoverPosition}
//         parent={parent}
//         states={states}
//         props={props}
//         setProps={setProps}
//         docStates={docStates}
//         docRelations={docRelations}
//         setStates={setStates}
//         formStates={formStates}
//         setFormStates={setFormStates}
//         setColStates={setColStates}
//         colStates={colStates}
//         element={element}
//         mapValue={mapValue}
//         mapIndex={mapIndex}
//         onSelect={onSelect}
//     >

//         {children}</Element></form>



// });



import { debounce } from '@/lib/utils/utils'

import React, { useEffect, forwardRef, useState, useMemo, Children, useCallback } from "react";
import { message } from 'antd';
import ComponentServices from "@/lib/services/components";
import Element from "./Element";
import ElementMapping from './ElementMapping';

const e = React.createElement;
import { InlineSkeleton } from './Elements'
import { getData, storeData, getAllData } from "@/lib/utils/db";
import { getStateValue, updateStateValue, getStateRef } from '@/lib/utils/elementNode';
import FormServices from '@/lib/services/forms'

const Form = (props) => {

     const {
          children,
          _id,
          _states,
          _props,
          colStates,
          onChange,
          onSubmit,
          onClick, } = props;

     const onSubmitForm = async (e) => {
          e.preventDefault();

          const formElement = e.currentTarget;
          const formData = new FormData(formElement);

          const formDataObject = Object.fromEntries(formData.entries());

          let isValid = true;
          const data = {};

          Object.keys(formDataObject).forEach((key) => {

               const fieldData = formDataObject[key];
               const stateData = _states[key];
               const regexString = stateData.regex;
               const regex = new RegExp(regexString);

               if ((stateData.required && !fieldData) || !regex.test(fieldData)) {
                    stateData.error = 1;
                    isValid = false;
               }
               else {
                    stateData.error = 0;
                    data[key] = fieldData;

               }



          });

          if (isValid) {
               try {

                    const res = await FormServices.submit(_id, data);

                    if (res.status) {
                         _states["__setting__"].error = 0;
                         _states["__setting__"].success = 1;
                         onSubmit(_states)
                    }

               } catch (e) {

                    _states["__setting__"].error = 1;
                    _states["__setting__"].success = 0;

                    if (e?.states)
                         onSubmit(_states);

               } finally {

               }


          } else {
               _states["__setting__"].error = 1;
               _states["__setting__"].success = 0;
               onSubmit(_states)
          }


     }

     return <form action="/api/form" method="post" id="form" onSubmit={onSubmitForm}>
          {React.Children.map(children, (child) => {
               return child && React.cloneElement(child, {
                    onChange: onChange,
                    onClick: onClick,
                    _id: _id,
                    _states: _states,
                    _props: _props,
                    colStates: colStates
               })
          })}
     </form>



};


export default Form;