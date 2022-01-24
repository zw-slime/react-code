import React from './render.js'
import {ElementType} from "./model.js";


const stories = [
    { name: "Didact introduction", url: "http://bit.ly/2pX7HNn" },
    { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH" },
    { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" },
    { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746" },
    { name: "Components and state", url: "http://bit.ly/2rE16nh" }
];

const storyElement=({name,url}) => {
    const likes = Math.ceil(Math.random() * 1000);
    const buttonElement = {
        type:ElementType.REACT_BUTTON,
        props: {
            onClick: () => alert("hi"),
            children: [
                {type:ElementType.REACT_TEXT, props:{ nodeValue:likes}},
                {type:ElementType.REACT_TEXT, props:{ nodeValue:'❤️'}}
            ]
        }
    };

    const linkElement = {
        type: ElementType.REACT_LINK,
        props: {
            href: url,
            children:[{type:ElementType.REACT_TEXT,props:{nodeValue:name}}]
        }
    }
    return {
        type: ElementType.REACT_LI,
        props: {
            children:[buttonElement,linkElement]
        }
    }
}

const RootElement = {
    type:ElementType.REACT_DIV,
    props: {
        children: [
            {
                type: ElementType.REACT_UL,
                props: {
                    children: stories.map(storyElement)
                }
            }
        ]
    }
}


console.warn(React)
React.render(RootElement,document.getElementById('root'))
