


function Component({ component, children }) {


    
    const onDragStart = (e) => {

        const tag =  {
            "tagName": "div",
            "type": "layout",
            "layout": "body",
            "nodeValue": "",
            "childNodes": ["0"],
            "component" : {_id: component._id},
          }

        e.dataTransfer.setData('text/plain', JSON.stringify(tag));
      };


    return (
        <div   draggable={true}

        onDragStart={onDragStart}>
            {children}
        </div>
    );

}

export default Component;