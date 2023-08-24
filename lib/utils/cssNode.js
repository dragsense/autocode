

export const classes = [];


function Selector() {
    this.name = '';
    this.rule = null;
    this.conditionText = '';
    this.keyFrameText = '',
        this.rules = [];
    this.type = 1;
    this.class = false;
    this.id = false;
    this.index = 0;
}

export const createCSS = async (element) => {

    let css = '';
    // for (const node of CssNodes) {


    //     // if (node.type === 7)
    //     //     css = css + "@keyframes " + node.keyFrameText + "{" + await createCSS(node.rule.cssRules) + "}";
    //     // else
    //     // if (node.type === 4) 
    //     // {
    //     //     css = css + "@media " + node.rule.mediaText + "{" + await createCSS(node.rule.cssRules) + "}";   
    //     // }
    //     // else
    //     css = css + node.cssText;

    // }

        for await (let selector of element.selectors) {
            css += selector.selectorText + ' {\n';

            for  (let property  in selector.style) {
                css += '  ' + property  + ': ' +  selector.style[property] + ';\n';
            }

            css += '}\n';
        }

    return css;

}

const regExp = /\(([^)]+)\)/;

export const addRule = async (document, value, type, content, breakPoint, keyframe) => {

    if (!document)
        return null;
    const sheet = document.styleSheets[0];
    //sheet.addRule(value);

    let selector = await findSelector(document, value);

    if (selector)
        return selector;

    selector = new Selector();


    try {

        let index = 0;
        if (type === 1) {

            index = sheet.insertRule(`${value} {}`, sheet.cssRules.length);
            const rule = sheet.cssRules[index];
            Object.assign(rule.style, { ...content });
            selector.name = rule.selectorText;
            selector.rule = rule;
            selector.index = index;

        }
        else
            if (type === 4) {

                index = sheet.insertRule(`@media ${breakPoint} {}`, sheet.cssRules.length);
                const rule = sheet.cssRules[index];

                if (rule.conditionText.startsWith('print')) {
                    selector.name = 'print';
                }
                else
                    if (rule.conditionText.startsWith('screen')) {
                        selector.name = 'screen';
                    } else
                        if (rule.conditionText.startsWith('all')) {
                            selector.name = 'all';
                        }


                selector.conditionText = regExp.exec(rule.conditionText)[1];
                selector.index = index;
                selector.type = 4;
                selector.rule = rule;

            } else if (type === 7) {
                const index = sheet.insertRule(`@keyframes ${keyframe} {}`, sheet.cssRules.length);
                const rule = sheet.cssRules[index];
                selector.keyFrameText = rule.name;
                selector.type = 7;
                selector.rule = rule;

            }
    }
    catch (e) {
        return null;
    }


    return selector;
}


export const getCssSelector = async (document, value, type) => {

    if (!document)
        return null;
    const sheet = document.styleSheets[0];
    //sheet.addRule(value);

    let selector = await findSelector(document, value);


    if (selector)
        return selector;

    selector = new Selector();

    let index = 0;
    index = sheet.insertRule(`${value} {}`, sheet.cssRules.length);
    const rule = sheet.cssRules[index];
    selector.name = rule.selectorText;
    selector.rule = rule;

    return selector;
}


export async function findSelector(document, text) {

    if (!text)
        return null;

    try {
        const rules = document.styleSheets[0].rules || document.styleSheets[0].cssRules;
        //const index = rules.findIndex(rule => rule.selectorText === selector);

        // if(index > -1) {
        // const selector = new Selector();
        // const rule = sheet.cssRules[index];
        // selector.name = rule.selectorText;
        // selector.rule = rule;
        // return selector;
        // }
        // else {
        //     return null;
        // }
        for await (var x of rules) {

            if (x.selectorText === text.toLowerCase()) {
                const selector = new Selector();
                const rule = x;
                selector.name = rule.selectorText;
                selector.rule = rule;

                return selector;
                //         //ret[rules[x].selectorText] = ret[rules[x].selectorText] + ' ' + rules[x].style.cssText;
            }

        }
        return null;
    }
    catch (error) {
        console.log(error);
    }


}

export const laodSelecters = async (document, type) => {


    if (!document)
        return [];



    const selecters = [];
    const sheet = document.styleSheets[0];
    const cssRules = sheet.cssRules || sheet.rules;



    let index = 0;
    for await (const rule of cssRules) {
        const selector = new Selector();

        if (rule.type === type) {

            if (type === 1)
                selector.name = rule.selectorText.replace(/\s{2,}/g, ' ').trim().toLowerCase();
            else
                if (type === 4) {

                    if (rule.conditionText.startsWith('print')) {
                        selector.name = 'print';
                    }
                    else
                        if (rule.conditionText.startsWith('screen')) {
                            selector.name = 'screen';
                        } else
                            if (rule.conditionText.startsWith('all')) {
                                selector.name = 'all';
                            }

                    selector.conditionText = regExp.exec(rule.conditionText)[1];
                    for (const r of rule.cssRules) {
                        const sel = new Selector();
                        sel.name = r.selectorText.replace(/\s{2,}/g, ' ').trim().toLowerCase();
                        sel.rule = r;
                        selector.rules.push(sel);
                    }
                }
                else
                    if (type === 7) {
                        selector.keyFrameText = rule.name;
                        // for (const r of rule.cssRules) {
                        //     const sel = new Selector();
                        //     sel.name = r.keyText.replace(/\s{2,}/g, ' ').trim().toLowerCase();
                        //     sel.rule = r;
                        //     selector.rules.push(sel);
                        // }
                    }


            selector.index = index;
            selector.rule = rule;
            selector.type = type;
            selecters.push(selector);


        }
        index++;

    }



    return selecters;

}



export default Selector;