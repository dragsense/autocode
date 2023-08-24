
const ResizeMargin = {

    Action: (itemRef, outterBox, index, nodeRect, selector, mousePos, setValue, unit = "px") => {

        const innerBox = nodeRect.rect;
        const node = selector;

        let margin = 0;

        if (index == 0) {
            margin = innerBox.x - mousePos.x;


            if (margin <= 0)
                node.style.marginLeft = 0 + unit;
            else {
                node.style.marginLeft = margin + unit;

                setValue(node.style.marginLeft)
                itemRef.style.width = (outterBox.x + outterBox.width) - mousePos.x + 'px';

            }
        } else

            if (index == 1) {

                margin = innerBox.y - mousePos.y;

                if (margin <= 0)
                    node.style.marginTop = 0 + unit;
                else {
                    node.style.marginTop = margin + unit;

                    setValue(node.style.marginTop)
                    itemRef.style.height = (outterBox.y + outterBox.height) - mousePos.y + 'px';
                }
            } else

                if (index == 2) {
                    margin = mousePos.x - (innerBox.x + innerBox.width)

                    if (margin <= 0)
                        node.style.marginRight = 0 + unit;
                    else {
                        node.style.marginRight = margin + unit;

                        setValue(node.style.marginRight)
                        itemRef.style.width = mousePos.x - outterBox.x + 'px';

                    }
                } else
                    if (index == 3) {

                        margin = mousePos.y - (innerBox.y + innerBox.height);

                        if (margin <= 0)
                            node.style.marginBottom = 0 + unit;
                        else {
                            node.style.marginBottom = margin + unit;

                            setValue(node.style.marginBottom)
                            itemRef.style.height = mousePos.y - outterBox.y + 'px';
                        }
                    }


    }, Reset: (setValue, itemRef, index, selector) => {

        const node = selector;

        if (index == 0 && node.style.marginLeft) {
            node.style.marginLeft = null;
            setValue(node.style.marginLeft);
            itemRef.style.width = 'auto';


        } else

            if (index == 1  && node.style.marginTop) {
                node.style.marginTop = null;
                setValue(node.style.marginTop);
                itemRef.style.height = 'auto';
            }
            else

                if (index == 2  && node.style.marginRight) {
                    node.style.marginRight = null;
                    setValue(node.style.marginRight);
                    itemRef.style.width = 'auto';
                } else
                    if (index == 3  && node.style.marginBottom) {

                        node.style.marginBottom = null;
                        setValue(node.style.marginBottom);
                        itemRef.style.height = 'auto';
                    }
    }

};

export default ResizeMargin;