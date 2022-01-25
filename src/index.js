/** @jsx createElement */
import React from './render.js'
import { createElement } from "./createElement";


const stories = [
    { name: "Didact introduction", url: "http://bit.ly/2pX7HNn" },
    { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH" },
    { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" },
    { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746" },
    { name: "Components and state", url: "http://bit.ly/2rE16nh" }
];

// step1 自定义vdom
// const storyElement=({name,url}) => {
//     const likes = Math.ceil(Math.random() * 1000);
//     const buttonElement = {
//         type:ElementType.REACT_BUTTON,
//         props: {
//             onClick: () => alert("hi"),
//             children: [
//                 {type:ElementType.REACT_TEXT, props:{ nodeValue:likes}},
//                 {type:ElementType.REACT_TEXT, props:{ nodeValue:'❤️'}}
//             ]
//         }
//     };
//
//     const linkElement = {
//         type: ElementType.REACT_LINK,
//         props: {
//             href: url,
//             children:[{type:ElementType.REACT_TEXT,props:{nodeValue:name}}]
//         }
//     }
//     return {
//         type: ElementType.REACT_LI,
//         props: {
//             children:[buttonElement,linkElement]
//         }
//     }
// }
//
// const RootElement = {
//     type:ElementType.REACT_DIV,
//     props: {
//         children: [
//             {
//                 type: ElementType.REACT_UL,
//                 props: {
//                     children: stories.map(storyElement)
//                 }
//             }
//         ]
//     }
// }


// step2 使用babel来解析jsx
const RootElement = <div><ul>{stories.map(storyElement)}</ul></div>;

function storyElement({ name, url }) {
    const likes = Math.ceil(Math.random() * 100);
    return (
        <li>
            <button>{likes}❤️</button>
            <a href={url}>{name}</a>
        </li>
    );
}

React.render(RootElement,document.getElementById('root'))
