/** @jsx createElement */
import React from './render.js'
import {createElement} from "./createElement.js";

const stories = [
    { name: "Didact introduction", url: "http://bit.ly/2pX7HNn" },
    { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH" },
    { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" },
    { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746" },
    { name: "Components and state", url: "http://bit.ly/2rE16nh" }
];

class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Didact Stories</h1>
                <Time></Time>

                <ul>
                    {this.props.stories.map(story => {
                        return <Story name={story.name} url={story.url} />;
                    })}
                </ul>
            </div>
        );
    }
}

class Story extends React.Component {
    constructor(props) {
        super(props);
        this.state = { likes: Math.ceil(Math.random() * 100) };
    }
    like() {
        this.setState({
            likes: this.state.likes + 1
        });
    }
    render() {
        const { name, url } = this.props;
        const { likes } = this.state;
        const likesElement = <span />;
        return (
            <li>
                <button onClick={e => this.like()}>{likes}<b>❤️</b></button>
                <a href={url}>{name}</a>
            </li>
        );
    }
}


class Time extends React.Component {
    constructor(props) {
        const time = new Date().toLocaleTimeString();
        super(props);
        this.state = {time: time}

        setInterval(()=> {
            const time = new Date().toLocaleTimeString();
            this.setState({time})
        },1000)
    }

    render() {
        return <h1>{this.state.time}</h1>
    }
}

React.render(<App stories={stories} />, document.getElementById("root"));
