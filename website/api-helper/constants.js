export const ValidateProps = {
  user: {
    name: { type: 'string', minLength: 1, maxLength: 50 },
    password: { type: 'string', minLength: 8 },
    email: { type: 'string', minLength: 1 },
  },
  page: {
    name: { type: 'string', minLength: 2, maxLength: 280 },
    slug: { type: 'string', minLength: 2, maxLength: 280 },
    status: {type: 'boolean'},

    setting: {type: 'object'},
    states: {type: 'object'},
    scripts: {type: 'object'},
    layout: {type: 'object'},
    elements: { type: 'object'},
    styles: { type: 'object'},
    components: {type: 'array'},
    collections: {type: 'array'},
    collection: {type: 'object'},
    forms: {type: 'array'}
  },
  collection: { 
    name: { type: 'string', minLength: 2, maxLength: 280 },
    slug: { type: 'string', minLength: 2, maxLength: 280 },
    body : { type: 'array' },
    setting: {type: 'object'},
    states: {type: 'object'},
    scripts: {type: 'object'},
    layout: {type: 'object'},
    relationships: { type: 'array' },

   },
   form: { 
    name: { type: 'string', minLength: 2, maxLength: 280 },
    slug: { type: 'string', minLength: 2, maxLength: 280 },
    emailbody : {type: 'object'},
    states: {type: 'object'},
    setting: {type: 'object'},
    body : { type: 'array' },

    
   },
   component : {
     name: { type: 'string', minLength: 1, maxLength: 280 },
     body : { type: 'array' },
     states: {type: 'object'},
   },
   media : {
    name: { type: 'string', minLength: 1, maxLength: 280 },
   },
   document :{
    name: { type: 'string', minLength: 1, maxLength: 280 },
    slug: { type: 'string', minLength: 2, maxLength: 280 },

     states: { type: 'object' },
     _id: { type: 'string', minLength: 1, maxLength: 280 },
     relationships: { type: 'array' },
     setting: {type: 'object'},

   },
   layout : {
    name: { type: 'string', minLength: 1, maxLength: 280 },
    components : { type: 'object' },
    topComponent : { type: 'boolean' },
    bottomComponent : { type: 'boolean' },


   },
   setting : {
    webtitle: { type: 'string', minLength: 1, maxLength: 280 },
    desc: { type: 'string', minLength: 0, maxLength: 280 },
    timezone: { type: 'string', minLength: 0, maxLength: 280 },
    lang: { type: 'string', minLength: 0, maxLength: 280 },
    homePage: { type: 'string', minLength: 0, maxLength: 280 },
    errorPage: { type: 'string', minLength: 0, maxLength: 280 },
    pageSetting : { type: 'object' },
   },
   backup: {
    id: { type: 'string', minLength: 1, maxLength: 280 },
   },
   theme : {
     color : {
      name: { type: 'string', minLength: 1, maxLength: 280 },
      color: { type: 'string', minLength: 1, maxLength: 280 },
     },
     variable : {
      name: { type: 'string', minLength: 1, maxLength: 280 },
      value: { type: 'string', minLength: 1, maxLength: 280 },
     },
     font : {
      name: { type: 'string', minLength: 1, maxLength: 280 },
      fontFamily: { type: 'string', minLength: 1, maxLength: 280 },
      src: { type: 'array' },
     },
     icon : {
      name: { type: 'string', minLength: 1, maxLength: 280 },
      classes: { type: 'string' },
      svg: { type: 'string'},
     },
     style : {
      elementType: { type: 'string', minLength: 1, maxLength: 280 },
      styles: { type: 'object' },
     },
     animations: { type: 'object' },

     js : {
      code: { type: 'string', minLength: 1, maxLength: 10000 },
     },
     css : {
      code: { type: 'string', minLength: 1, maxLength: 10000 },
     },
     templates: {
      name: { type: 'string', minLength: 1, maxLength: 280 },

     }
    
   }
};
