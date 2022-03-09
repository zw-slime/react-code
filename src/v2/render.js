function createElement(type,props,...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => typeof child ==='object' ? child : createTextElement(child))
        }
    }
}

function createTextElement(text) {
    return {
        type:'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}

function createDom(fiber) {
    const dom =
        fiber.type == "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(fiber.type)

    updateDom(dom,{},fiber.props)

  return dom
}

const isEvent = key => key.startsWith("on")
const isProperty = key =>
    key !== "children" && !isEvent(key)

const isNew = (prev, next) => key =>
    prev[key] !== next[key]
const isGone = (prev, next) => key => !(key in next)


function updateDom(dom,prevProps,nextProps) {
    console.warn(dom,prevProps,nextProps)
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(
            key =>
                !(key in nextProps) ||
                isNew(prevProps, nextProps)(key)
        )
        .forEach(name => {
            const eventType = name
                .toLowerCase()
                .substring(2)
            dom.removeEventListener(
                eventType,
                prevProps[name]
            )
        })

    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
            const eventType = name
                .toLowerCase()
                .substring(2)
            dom.addEventListener(
                eventType,
                nextProps[name]
            )
        })


    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach(name => {
            dom[name] = ""
        })



    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => {
            dom[name] = nextProps[name]
        })
}

function commitRoot() {
    deletions.forEach(commitWork)
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
}
function commitWork(fiber) {
    if(!fiber) {
        return
    }

    console.warn(444,fiber)

    let domParentFiber = fiber.parent
    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.parent
    }
    const domParent = domParentFiber.dom
    if(fiber.effectTag === 'placement' && fiber.dom != null) {
        domParent.appendChild(fiber.dom)
    } else if(fiber.effectTag === 'update' && fiber.dom != null) {
        updateDom(fiber.dom,fiber.alternate.props,fiber.props)
    } else if(fiber.effectTag === 'deletion') {
        commitDeletion(fiber.child,domParent)
    }

    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function commitDeletion(fiber,domParent) {
    if(fiber.dom) {
        domParent.removeChild(fiber.dom)
    } else {
        commitDeletion(fiber.child,domParent)
    }
}

function render(element,container) {
    wipRoot = {
        dom: container,
        props: {children:[element]},
        alternate: currentRoot
    }
    deletions = []
    nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null;
let wipRoot =null;
let currentRoot = null;
let deletions = []

function workLoop(deadline) {
    // 函数会接收到一个名为 IdleDeadline 的参数，这个参数可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态
    let shouldYield = false;


    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        shouldYield = deadline.timeRemaining() < 1
    }

    if(!nextUnitOfWork && wipRoot) {
        commitRoot()
    }

    requestIdleCallback(workLoop)
}

// 这个函数将在浏览器空闲时期被调用
requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
    const ifFunctionComponent = fiber.type instanceof Function
    if(ifFunctionComponent) {
        updateFunctionComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }

    if(fiber.child) {
        return fiber.child
    }

    let nexFiber = fiber
    while (nexFiber) {
        if(nexFiber.sibling) {
            return  nexFiber.sibling
        }
        nexFiber = nexFiber.parent
    }


}

let wipFiber = null
let hookIndex = null

function updateFunctionComponent(fiber) {
    wipFiber = fiber
    hookIndex = 0
    wipFiber.hooks = []
    const children =[fiber.type(fiber.props)]
    reconcileChildren(fiber, children)
}

function useState(initial) {
    const oldHook =
        wipFiber.alternate &&
        wipFiber.alternate.hooks &&
        wipFiber.alternate.hooks[hookIndex]
    const hook = {
        state: oldHook ? oldHook.state : initial,
        queue:[]
    }
    const actions = oldHook ? oldHook.queue : []

    actions.forEach(action => {
        hook.state = action(hook.state)
    })
    const setState = action => {
        console.warn(111)
        hook.queue.push(action)
        wipRoot = {
            dom: currentRoot.dom,
            props: currentRoot.props,
            alternate: currentRoot,
        }
        nextUnitOfWork = wipRoot
        deletions = []
    }
  wipFiber.hooks.push(hook)
    hookIndex++
    return [hook.state,setState]
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }
    reconcileChildren(fiber, fiber.props.children)
}


function reconcileChildren(wipFiber,elements) {
    let index = 0
    let oldFiber =
        wipFiber.alternate && wipFiber.alternate.child
    let prevSibling = null

    while (index < elements.length ||
    oldFiber != null) {
        const element = elements[index]

        let newFiber = null

        const sameType = oldFiber && element && element.type === oldFiber.type
        if(sameType) {
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom:oldFiber.dom,
                parent:wipFiber,
                alternate: oldFiber,
                effectTag:'update'
            }
        }

        if(elements && !sameType) {
            newFiber = {
                type: element.type,
                props: element.props,
                dom:null,
                parent:wipFiber,
                alternate:null,
                effectTag: 'placement'
            }
        }
        if(oldFiber && !sameType) {
            oldFiber.effectTag = "deletion"
            deletions.push(oldFiber);
        }

        if(oldFiber) {
            oldFiber = oldFiber.sibling
        }

        if(index === 0) {
            wipFiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
        index++
    }

}


export const React = {
    createElement,
    render,
    useState
}
