import {ElementType} from "./model.js";




const Render = (element,parentDom) => {
    const {type,props} = element;

    const isTextElement = type === ElementType.REACT_TEXT;

    const dom = isTextElement ? document.createTextNode(""):document.createElement(type);

    const isListener = name => name.startsWith('on');
    Object.keys(props).filter(isListener).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType,props[name])
    })


    const isAttribute = name => !isListener(name) && name !== "children";
    Object.keys(props).filter(isAttribute).forEach(name => {
        dom[name]= props[name]
    })

    const childrenElements = props.children || [];
    childrenElements.forEach(childrenElement => Render(childrenElement,dom));

    parentDom.appendChild(dom)
}


const React =  {
    render:Render
}

export default React;
