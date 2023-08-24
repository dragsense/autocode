
const ResizePadding = {

    Action: (itemRef, outterBox, index, nodeRect, selector, mousePos, setValue, unit = "px") => {

        const innerBox = nodeRect.boxModel.content;
        const node = selector;

        let padding = 0;

        if (index == 0) {
            padding = innerBox.x - mousePos.x;


            if (padding <= 0)
                node.style.paddingLeft = 0 + unit;
            else{
                node.style.paddingLeft = padding + unit;

                setValue(node.style.paddingLeft)
                itemRef.style.width = (outterBox.x + outterBox.width) -mousePos.x  + 'px';
                    
            }
        } else

            if (index == 1) {

                padding = innerBox.y - mousePos.y;

                if (padding <= 0)
                    node.style.paddingTop = 0 + unit;
                else {
                    node.style.paddingTop = padding + unit;

                    setValue(node.style.paddingTop)
                    itemRef.style.height = (outterBox.y + outterBox.height) - mousePos.y + 'px';
                }
            } else

                if (index == 2) {
                    padding = mousePos.x - (innerBox.x + innerBox.width);

                    if (padding <= 0)
                        node.style.paddingRight = 0 + unit;
                    else {
                        node.style.paddingRight = padding + unit;

                        setValue(node.style.paddingRight)
                        itemRef.style.width = mousePos.x - outterBox.x + 'px';
                    
                    }
                } else
                    if (index == 3) {

                        padding = mousePos.y - (innerBox.y + innerBox.height);

                        if (padding <= 0)
                            node.style.paddingBottom = 0 + unit;
                        else {
                            node.style.paddingBottom = padding + unit;

                            setValue(node.style.paddingBottom)
                            itemRef.style.height = mousePos.y - outterBox.y + 'px';
                        }
                    }


    }, Reset: (setValue, itemRef, index, selector) => {

        const node = selector;

        

        if (index == 0 && node.style.paddingLeft) {
            node.style.paddingLeft = null;
            

            setValue(node.style.paddingLeft);
            itemRef.style.width = 'auto';


        } else

            if (index == 1 && node.style.paddingTop) {
                node.style.paddingTop = null;
                setValue(node.style.paddingTop);
                itemRef.style.height = 'auto';
            }
            else

                if (index == 2 && node.style.paddingRight) {
                    node.style.paddingRight = null;
                    setValue(node.style.paddingRight);
                    itemRef.style.width = 'auto';
                } else
                    if (index == 3 && node.style.paddingBottom) {

                        node.style.paddingBottom = null;
                        setValue(node.style.paddingBottom);

                        console.log(node.style.paddingBottom)
                        itemRef.style.height = 'auto';
                    }
    }


};

export default ResizePadding;