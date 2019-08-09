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


    showHelper = (id: string) => {
        // TODO: Clean up this mess

        switch (id) {
            case "ghostbox":
                document.getElementById("helper-ghostbox").classList.add("is-visible");
                break;

            case "legend-left":
                document.getElementById("helper-legend-left").classList.add("is-visible");
                break;

            case "legend-right":
                document.getElementById("helper-legend-right").classList.add("is-visible");
                break;

            case "redline-h-top":
                document.getElementById("helper-redline-h-top").classList.add("is-visible");
                break;

            case "redline-v-top":
                document.getElementById("helper-redline-v-top").classList.add("is-visible");
                break;

            case "redline-v-bot":
                document.getElementById("helper-redline-v-bot").classList.add("is-visible");
                break;

            case "redline-h-bot":
                document.getElementById("helper-redline-h-bot").classList.add("is-visible");
                break;

            case "redline-h-left":
                document.getElementById("helper-redline-h-left").classList.add("is-visible");
                break;

            case "redline-v-left":
                document.getElementById("helper-redline-v-left").classList.add("is-visible");
                break;

            case "redline-h-right":
                document.getElementById("helper-redline-h-right").classList.add("is-visible");
                break;

            case "redline-v-right":
                document.getElementById("helper-redline-v-right").classList.add("is-visible");
                break;
        }
    };


    hideHelper = () => {
        // TODO: Iterate this crap

        document.getElementById("helper-ghostbox").classList.remove("is-visible");
        document.getElementById("helper-legend-left").classList.remove("is-visible");
        document.getElementById("helper-legend-right").classList.remove("is-visible");
        document.getElementById("helper-redline-h-top").classList.remove("is-visible");
        document.getElementById("helper-redline-v-top").classList.remove("is-visible");
        document.getElementById("helper-redline-v-bot").classList.remove("is-visible");
        document.getElementById("helper-redline-h-bot").classList.remove("is-visible");
        document.getElementById("helper-redline-h-left").classList.remove("is-visible");
        document.getElementById("helper-redline-v-left").classList.remove("is-visible");
        document.getElementById("helper-redline-h-right").classList.remove("is-visible");
        document.getElementById("helper-redline-v-right").classList.remove("is-visible");
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
            <header className="l-window-header">
                <img src={require("../images/d3-logo.svg")} />

                <article>
                    <h1>D3 Redlines</h1>
                    <p>Please select a Layer, Group or Frame and press buttons below to add a redline, legend or ghost box.</p>
                </article>
            </header>

            <section className="l-selector">
                <button id="button-legend-left" className="button button--secondary" onMouseOver={() => this.showHelper("legend-left")} onMouseOut={() => this.hideHelper()}>Legend</button>
                <button id="button-legend-right" className="button button--secondary" onMouseOver={() => this.showHelper("legend-right")} onMouseOut={() => this.hideHelper()}>Legend</button>

                <button id="button-ghostbox" className="button button--secondary" onMouseOver={() => this.showHelper("ghostbox")} onMouseOut={() => this.hideHelper()}>Ghost Box</button>

                <button id="button-redline-h-top" className="button button--secondary" onMouseOver={() => this.showHelper("redline-h-top")} onMouseOut={() => this.hideHelper()}>H Redline Top</button>
                <button id="button-redline-v-top" className="button button--secondary" onMouseOver={() => this.showHelper("redline-v-top")} onMouseOut={() => this.hideHelper()}>V Redline Top</button>
                <button id="button-redline-v-bot" className="button button--secondary" onMouseOver={() => this.showHelper("redline-v-bot")} onMouseOut={() => this.hideHelper()}>V Redline Bottom</button>
                <button id="button-redline-h-bot" className="button button--secondary" onMouseOver={() => this.showHelper("redline-h-bot")} onMouseOut={() => this.hideHelper()}>H Redline Bottom</button>

                <button id="button-redline-h-left" className="button button--secondary" onMouseOver={() => this.showHelper("redline-h-left")} onMouseOut={() => this.hideHelper()}>H Redline Left</button>
                <button id="button-redline-v-left" className="button button--secondary" onMouseOver={() => this.showHelper("redline-v-left")} onMouseOut={() => this.hideHelper()}>V Redline Left</button>
                <button id="button-redline-h-right" className="button button--secondary" onMouseOver={() => this.showHelper("redline-h-right")} onMouseOut={() => this.hideHelper()}>H Redline Right</button>
                <button id="button-redline-v-right" className="button button--secondary" onMouseOver={() => this.showHelper("redline-v-right")} onMouseOut={() => this.hideHelper()}>V Redline Right</button>

                <img src={require("../images/selection-bg.svg")} id="selection-bg" className="center" />
                <img src={require("../images/ghostbox.svg")} id="helper-ghostbox" className="center is-ghostbox" />
                <img src={require("../images/selection-fg.svg")} id="selection-fg" className="center" />

                <img src={require("../images/legend-left.svg")} id="helper-legend-left" className="center pad is-legend" />
                <img src={require("../images/legend-right.svg")} id="helper-legend-right" className="center pad is-legend" />

                <img src={require("../images/redline-h-left.svg")} id="helper-redline-h-left" className="center pad is-redline" />
                <img src={require("../images/redline-h-right.svg")} id="helper-redline-h-right" className="center pad is-redline" />
                <img src={require("../images/redline-h-top.svg")} id="helper-redline-h-top" className="center pad is-redline" />
                <img src={require("../images/redline-h-bot.svg")} id="helper-redline-h-bot" className="center pad is-redline" />
                <img src={require("../images/redline-v-top.svg")} id="helper-redline-v-top" className="center pad is-redline" />
                <img src={require("../images/redline-v-bot.svg")} id="helper-redline-v-bot" className="center pad is-redline" />
                <img src={require("../images/redline-v-right.svg")} id="helper-redline-v-right" className="center pad is-redline" />
                <img src={require("../images/redline-v-left.svg")} id="helper-redline-v-left" className="center pad is-redline" />


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
