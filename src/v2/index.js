import {React} from "./render.js";

// const element = React.createElement("div", {
//     style: "background: salmon"
// },React.createElement("h1", null, "Hello World"), React.createElement("h2", {
//     style: "text-align:right"
// }, "from Didact"));




function Counter() {
    const [state, setState] = React.useState(1);
    console.warn(state)
    return React.createElement("h1", {
        onClick: () => setState(c => c + 1),
        style: "user-select:none"
    }, "Count: ", state);
}

const element = React.createElement(Counter, null);

const container = document.getElementById("root");
React.render(element, container);
