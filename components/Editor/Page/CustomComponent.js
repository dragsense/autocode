// import React, { useEffect, forwardRef, useState, useMemo } from "react";

// import ComponentServices from "@/lib/services/components";
// import Element from "./Element";

// const e = React.createElement;



// export default forwardRef(({
//     parent,
//     node,
//     index,
//     element,
//     props,
//     setProps,
//     formStates,
//     setFormStates,
//     docStates,
//     docRelations,
//     colStates,
//     setColStates,
//     children,
//     hoverPosition,
//     mapValue,
//     mapIndex,
//     hovering,
//     component = false,
//     onSelect
// }, ref) => {


//     const [states, setStates] = useState([]);
//     const [customComponent, setCustomComponent] = useState(null);


//     const load = async (path) => {


//         try {




//             const component = element.component;


//             const _id =component._id;
//             let newStates = [];

//             if (_id) {
//                 const res = await ComponentServices.get(_id);

//                 newStates = Array.isArray(res.component?.states) ? res.component.states : [];
//                 setStates([...newStates]);
//             }

//             if (component.custom) {
//                 setCustomComponent(true);
//             }

//             if (component.componentType) {
//             newStates.push({ key: 'componentType', defaultValue: component.componentType, type: 'wrapper'  });
//             newStates.push({ key: 'slideIndex', defaultValue: 0, type: 'number', min: 0,  });
//             newStates.push({ key: 'slides', defaultValue: [], type: 'ARRAY' });
//             newStates.push({ key: 'activeItem', defaultValue: 0, type: 'BOOLEAN' });
//             newStates.push({ key: 'slideHeight', defaultValue: '200px', type: 'TEXT' });

//             }




//             setStates([...newStates]);


//         } catch (e) {
//             console.log(e?.message)
//         } finally {
//         }

//     };

//     useEffect(() => {

//         if (!element.component)
//             return;

//             load();

//     }, [component.componentType]);


//     return <Element ref={ref}
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
//         component={component}
//         mapValue={mapValue}
//         mapIndex={mapIndex}
//         onSelect={onSelect}
//     >

//         {customComponent ? <>{`<Component>`}{children} {`</Component>`}</> : children}

//     </Element>



// });



// import React, { useEffect, forwardRef, useState, useMemo } from "react";

// import ComponentServices from "@/lib/services/components";
// import Element from "./Element";

// const e = React.createElement;



// const Component = ({}) => {


//     const [states, setStates] = useState([]);
//     const [customComponent, setCustomComponent] = useState(null);


//     const load = async (path) => {


//         try {

//             const component = element.component;


//             const _id =component._id;
//             let newStates = [];

//             if (_id) {
//                 const res = await ComponentServices.get(_id);

//                 newStates = Array.isArray(res.component?.states) ? res.component.states : [];
//                 setStates([...newStates]);
//             }

//             if (component.custom) {
//                 setCustomComponent(true);
//             }

//             setStates([...newStates]);

//         } catch (e) {

//         } finally {
//         }

//     };

//     useEffect(() => {

//         if (!element.component)
//             return;

//             load();

//     }, [component.componentType]);


//     return <Element ref={ref}
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
//         component={component}
//         mapValue={mapValue}
//         mapIndex={mapIndex}
//         onSelect={onSelect}
//     >

//         {customComponent ? <>{`<Component>`}{children} {`</Component>`}</> : children}

//     </Element>



// };


// export default Component;


import React, { useEffect } from "react";



import ElementSetting from "./ElementSetting";


const CustomComponent = (props) => {

    const { children, customPath, node, mapValue, mapIndex } = props;


    const loadComponent = async (path) => {
    };

    useEffect(() => {
        loadComponent(customPath);
    }, [])




    return (
        <div id="custom-component">

            <ElementSetting
                {...props}
                attributes={node.attributes}
                classes={node.classes}
                conditions={node.conditions}
                mapValue={mapValue}
                mapIndex={mapIndex}
            >
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '5px', backgroundColor: '#f2f2f2', padding: '5px 10px', borderRadius: '3px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}>&lt;{customPath}&gt;</div>
                {children}
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '5px', backgroundColor: '#f2f2f2', padding: '5px 10px', borderRadius: '3px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}>&lt;/CustomComponent&gt;</div>
            </ElementSetting>

        </div>
    );


};


export default CustomComponent;