
const pxToPercentage = (p, s) => {

    return Math.round(p / s * 100);
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

const ResizeContent = {

    Action: (itemRef, outterBox, index, nodeRect, selector, mousePos, setValue, unit = "px") => {

        const innerBox = nodeRect.boxModel.content;
        const node = selector;

        let content = 0;


        if (index == 2) {

            content = mousePos.x - innerBox.x;

            if (content <= 0)
                node.style.width = 0 + unit;
            else {

                if (unit == '%')
                    node.style.width = clamp(pxToPercentage(content, innerBox.width), 0, 100) + '%';
                else
                    node.style.width = content + 'px';


                setValue(node.style.width)
                itemRef.style.width = mousePos.x - outterBox.x + 'px';

            }
        } else
            if (index == 3) {

                content = mousePos.y - innerBox.y;

                if (content <= 0)
                    node.style.height = 0 + unit;
                else {


                    if (unit === '%')
                        node.style.height = clamp(pxToPercentage(content, innerBox.height), 0, 100) + '%';
                    else
                        node.style.height = content + 'px';

                    setValue(node.style.height)
                    itemRef.style.height = mousePos.y - outterBox.y + 'px';
                }
            }


    }, Reset: (setValue, itemRef, index, selector) => {

        const node = selector;

        if (index == 2 && node.style.width) {
            node.style.width = null;
            setValue(node.style.width)
            itemRef.style.width = 'auto';
        } else
            if (index == 3 && node.style.height) {

                node.style.height = null;

                setValue(node.style.height)
                itemRef.style.height = 'auto';

            }
    }

};

export default ResizeContent;