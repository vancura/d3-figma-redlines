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
                <h1>D3 Redlines</h1>
            </header>

            <section className="l-selector-grid">
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

        </div>);
    }


}


ReactDOM.render(<D3Redlines />, document.getElementById("app"));
