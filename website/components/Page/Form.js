

import { debounce } from '@/lib/utils'

import React from "react";


const e = React.createElement;

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
                    formStates: _states,
                    _props: _props,
                    colStates: colStates
               })
          })}
     </form>



};


export default Form;