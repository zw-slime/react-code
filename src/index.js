// /** @jsx createElement */
import React from './render.js'
import {ElementType} from "./model.js";
import {createElement} from "./createElement.js";

const randomLikes = () => Math.ceil(Math.random() * 100);
const stories = [
    { name: "Didact introduction", url: "http://bit.ly/2pX7HNn",likes: randomLikes() },
    { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH",likes: randomLikes() },
    { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" ,likes: randomLikes()},
    { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746",likes: randomLikes() },
    { name: "Components and state", url: "http://bit.ly/2rE16nh",likes: randomLikes() }
];

// step2 使用babel来解析jsx

function addStory() {
    stories.push({ name: "Didact introduction11111111", url: "http://bit.ly/2pX7HNn",likes: randomLikes() });
    React.render(RootElement(),document.getElementById('root'))
}

function deleteStory(index) {
    stories.splice(index,1);
    React.render(RootElement(),document.getElementById('root'))
}

const addLike =(story) => {
    story.likes++;
    console.log(stories,RootElement)
    React.render(RootElement(),document.getElementById('root'))
}

// 模拟babel把jsx语法转成虚拟dom
const RootElement = () => {
    return createElement('div',null,
        createElement('ui',null,stories.map(storyElement)),
        createElement('button',{onClick:()=> addStory()},'add+')
    )

}

function storyElement(story,index) {
    const { name, url, likes }= story
    return  createElement('li',null,
        createElement('button',{onClick:()=> addLike(story)},likes,
            createElement('b',null,"\u2764\uFE0F"),
        ),
        createElement('a',{href: url},name),
        createElement('button',{onClick:()=> deleteStory(index)},'delete - ')
    )
}


React.render(RootElement(),document.getElementById('root'))

console.warn(RootElement())
