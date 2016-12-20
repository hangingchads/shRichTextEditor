import React from 'react'
import ReactDOM from 'react-dom';
import ShForm from 'sh-form';
import ShRichTextEditor from '../bin/sh-rich-text-editor';
require('../node_modules/sh-core/bin/main.css');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '<div><span style="color:red">This is a test</span></div>'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateText = this.updateText.bind(this);
    }

    handleChange(newVal) {
        console.log('Called handleChange()');
        this.state.text = newVal;
        this.setState(this.state);
    }

    updateText() {
        this.setState({
            text: 'this is the new text'
        })
    }

    handleFocus(event) {
        console.log('Called handleFocus()');
    }

    handleChangeSelection(range, oldRange, source) {
        console.log('Called handleChangeSelection()');
    }

    handleBlur(event) {
        console.log('Called handleBlur()');
    }

    handleSubmit() {
        alert(this.state.text);
        return false;
    }
    
    render() {
        return (
            <div>
                <ShForm onSubmit={this.handleSubmit}>
                    <ShRichTextEditor  value={this.state.text} required={true} onChange={this.handleChange} onBlur={this.handleBlur}
                        onFocus={this.handleFocus} onChangeSelection={this.handleChangeSelection} label="Text" defaultFont="Serif" defaultFontSize="Large" />
                    <button type="submit">Done</button><br />
                </ShForm>
                <button className="sh-btn" onClick={this.updateText}>Update Value</button><br />
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));