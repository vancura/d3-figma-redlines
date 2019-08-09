import * as React from "react";
import * as ReactDOM from "react-dom";

import "../../external/figma-ui/main.min.css";
import "../../external/figma-plugin-ds/scss/figma-plugin-ds.scss";

import "../scss/main.scss";


declare function require(path: string): any;


// noinspection JSClassNamingConvention
class D3Redlines extends React.Component<{}, {showSelectionError: boolean; lineOffset: number}> {


    capSelect = React.createRef<HTMLSelectElement>();


    constructor(props) {
        super(props);

        this.state = {
            showSelectionError: false,
            lineOffset: 3
        };
    }


    sendMessage = (action, options) => {
        parent.postMessage({
            pluginMessage: {
                options,
                action
            }
        }, "*");
    };


    setLine = (direction, align) => {
        this.sendMessage("line", {
            direction,
            align,
            strokeCap: this.capSelect.current.value
        });
    };


    componentDidMount() {
        require("../../external/figma-ui/scripts.min.js");
        require("../../external/figma-plugin-ds/js/disclosure.js");
        require("../../external/figma-plugin-ds/js/iconInput.js");
        require("../../external/figma-plugin-ds/js/selectMenu.js");

        window.onmessage = event => {
            if (event.data.pluginMessage.type === "selection") {
                this.setState({
                    showSelectionError: !event.data.pluginMessage.data
                }, () => {
                    if (this.state.showSelectionError) {
                        setTimeout(() => this.setState({
                            showSelectionError: false
                        }), 3000);
                    }
                });
            }
        };
    }


    render() {
        return (<div className="l-main">
            <section
                onClick={() => this.setState({showSelectionError: false})}
                className={"visual-bell visual-bell--error " + (this.state.showSelectionError ? "" : "is-hidden")}>
                <span className="visual-bell__msg">Please select at least one element</span>
            </section>

            <header className="l-window-header">
                <img src={require("../images/d3-logo.svg")} />

                <article>
                    <h1>D3 Redlines</h1>
                    <p>Please select a Layer, Group or Frame and press buttons below to add a redline, legend or ghost box.</p>
                </article>
            </header>

            <section className="l-selector">
                <button id="legend-left" className="button button--secondary">Legend</button>
                <button id="legend-right" className="button button--secondary">Legend</button>

                <button id="ghostbox" className="button button--secondary">Ghost Box</button>

                <button id="redline-h-top" className="button button--secondary">H Redline Top</button>
                <button id="redline-v-top" className="button button--secondary">V Redline Top</button>
                <button id="redline-v-bot" className="button button--secondary">V Redline Bottom</button>
                <button id="redline-h-bot" className="button button--secondary">H Redline Bottom</button>

                <button id="redline-h-left" className="button button--secondary">H Redline Left</button>
                <button id="redline-v-left" className="button button--secondary">V Redline Left</button>
                <button id="redline-h-right" className="button button--secondary">H Redline Right</button>
                <button id="redline-v-right" className="button button--secondary">V Redline Right</button>

                <img src={require("../images/selection-bg.svg")} id="selection-bg" className="center" />
                <img src={require("../images/ghostbox.svg")} id="ghostbox" className="center ghostbox" />
                <img src={require("../images/selection-fg.svg")} id="selection-fg" className="center" />

                <img src={require("../images/legend-left.svg")} id="legend-left" className="center pad legend" />
                <img src={require("../images/legend-right.svg")} id="legend-right" className="center pad legend" />

                <img src={require("../images/redline-h-left.svg")} id="redline-h-left" className="center pad redline" />
                <img src={require("../images/redline-h-right.svg")} id="redline-h-right" className="center pad redline" />
                <img src={require("../images/redline-h-top.svg")} id="redline-h-top" className="center pad redline" />
                <img src={require("../images/redline-h-bot.svg")} id="redline-h-bot" className="center pad redline" />
                <img src={require("../images/redline-v-top.svg")} id="redline-v-top" className="center pad redline" />
                <img src={require("../images/redline-v-bot.svg")} id="redline-v-bot" className="center pad redline" />
                <img src={require("../images/redline-v-right.svg")} id="redline-v-right" className="center pad redline" />
                <img src={require("../images/redline-v-left.svg")} id="redline-v-left" className="center pad redline" />


{/*
                <div
                    className="align-icon horizontal top"
                    onClick={() => this.setLine("horizontal", "TOP")}
                />
*/}
            </section>

{/*
            <div className="content">
                <label htmlFor="select-cap">
                    <h4>Cap</h4>

                    <select
                        id="select-cap"
                        ref={this.capSelect}
                        className="select-menu"
                        required
                    >
                        <option value="STANDARD">Standard</option>
                        <option value="NONE">None</option>
                        <option value="ARROW_LINES">Line Arrow</option>
                        <option value="ARROW_EQUILATERAL">Triangle Arrow
                        </option>
                    </select>
                </label>
            </div>
*/}

            <footer className="l-window-footer">
                0.0.1
            </footer>

        </div>);
    }


}


ReactDOM.render(<D3Redlines />, document.getElementById("app"));
