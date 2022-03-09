import {ElementType} from "./model.js";

// 自定义babel的把jsx转虚拟dom的方法
export function createElement(type,config,...args) {
    const props = Object.assign({},config);
    const hasChildren = args.length > 0;
    const rawChildren = hasChildren ? [].concat(...args) : [];
    props.children = rawChildren.filter(c => c!=null  && c!=false).map(c => c instanceof Object ? c : createTextElement(c))
    return {type,props}
}


function createTextElement(value) {
    return createElement(ElementType.REACT_TEXT,{nodeValue:value})
}
