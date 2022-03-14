import {ElementType} from "./model.js";



let rootInstance = null;


// 渲染dom
const Render = (element,container) => {
    const prevInstance = rootInstance;
    const nextInstance = reconcile(container, prevInstance, element);
    rootInstance = nextInstance;
}

// 协调算法 对比新旧节点
function reconcile(parentDom,instance,element) {
    if(instance == null) {
        // 第一次新建节点
        const newInstance = instantiate(element);
        parentDom.appendChild(newInstance.dom);
        return newInstance
    } else if(element == null) {
        // 删除节点
        parentDom.removeChild(instance.dom)
    } else if (element.type !== instance.element.type) {
        // 替换节点
        const newInstance = instantiate(element);
        parentDom.replaceChild(newInstance.dom,instance.dom);
        return newInstance
    } else if(typeof element.type === "string") {
        // 更新节点属性
        updateDomProperties(instance.dom,instance.element.props,element.props);
        instance.childInstances = reconcileChildren(instance, element);
        instance.element = element;
        return instance;
    } else {
        // 更新class
        instance.publicInstance.props = element.props;
        const childElement = instance.publicInstance.render();
        const oldChildInstance = instance.childInstance;
        const childInstance = reconcile(parentDom, oldChildInstance, childElement);
        instance.dom = childInstance.dom;
        instance.childInstance = childInstance;
        instance.element = element;
        return instance;
    }
}

// 子节点列表 新旧节点对比
function reconcileChildren(instance,element) {
    const dom = instance.dom;
    const childInstances = instance.childInstances;
    const nextChildElements = element.props.children || [];
    const newChildInstances = [];
    const count = Math.max(childInstances.length,nextChildElements.length);
    for(let i =0;i<count;i++) {
        const childInstance = childInstances[i];
        const childElement = nextChildElements[i];
        const newChildInstance = reconcile(dom, childInstance, childElement);
        newChildInstances.push(newChildInstance);
    }
    return newChildInstances.filter(instance => instance != null);
}

// 创建节点实例
function instantiate(element) {
    const {type,props} = element;
    const isDomElement = typeof type === "string";

    if(isDomElement) {
        // 创建dom元素
        const isTextElement = type === ElementType.REACT_TEXT;
        const dom = isTextElement ? document.createTextNode(""):document.createElement(type);
        updateDomProperties(dom,[],props)

        // 实例化子节点列表
        const childrenElements = props.children || [];

        const childInstances = childrenElements.map(instantiate);
        const childDoms = childInstances.map(childInstance => childInstance.dom);
        childDoms.forEach(childDom=> dom.appendChild(childDom));

        const instance = {dom, element, childInstances};
        return instance
    } else {
        const instance = {};
        const publicInstance = createPublicInstance(element, instance);
        const childElement = publicInstance.render();
        const childInstance = instantiate(childElement);
        const dom = childInstance.dom;

        Object.assign(instance, { dom, element, childInstance, publicInstance });
        return instance;
    }
}

function createPublicInstance(element,internalInstance) {
    const {type,props} = element;
    const publicInstance = new type(props);
    publicInstance.__internalInstance = internalInstance;
    return publicInstance
}

// 更新dom属性
function updateDomProperties(dom,prevProps,nextProps) {
    const isListener = name => name.startsWith('on');
    const isAttribute = name => !isListener(name) && name !== "children";

    Object.keys(prevProps).filter(isListener).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType,prevProps[name])
    })
    Object.keys(prevProps).filter(isAttribute).forEach(name => {
        dom[name]= null;
    })

    Object.keys(nextProps).filter(isListener).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType,nextProps[name])
    })
    Object.keys(nextProps).filter(isAttribute).forEach(name => {
        dom[name]= nextProps[name]
    })
}

class Component {
    constructor(props) {
        this.props = props;
        this.state = this.state || {}
    }

    setState(partialState) {
        this.state = Object.assign({},this.state,partialState)
        updateInstance(this.__internalInstance);
    }
}

function updateInstance(internalInstance) {
    const parentDom = internalInstance.dom.parentNode;
    const element = internalInstance.element
    reconcile(parentDom,internalInstance,element)
}


const React =  {
    render:Render,
    Component: Component
}

export default React;
