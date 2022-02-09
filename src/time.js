import React from './render.js'
import {ElementType} from "./model.js";

const rootDom = document.getElementById("root");
function tick() {
    const time = new Date().toLocaleTimeString();
    const clockElement = {
        type: ElementType.REACT_H1,
        props: {
            children: [
                {
                    type: ElementType.REACT_TEXT,
                    props: {
                        nodeValue: time
                    }
                }
            ]
        }
    };
    React.render(clockElement, rootDom);
}

tick();
setInterval(tick, 1000);
