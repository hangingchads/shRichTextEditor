import React from 'react'
import ReactDOM from 'react-dom';
import ShForm from 'sh-form';
import ShRichTextEditor from '../bin/sh-rich-text-editor';
require('../node_modules/sh-core/bin/main.css');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(newVal) {
        console.log('Called handleChange()');
        this.state.text = newVal;
        this.setState(this.state);
    }

    handleFocus(event) {
        console.log('Called handleFocus()');
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
                    <ShRichTextEditor value={this.state.text} required={false} onChange={this.handleChange} onBlur={this.handleBlur}
                        onFocus={this.handleFocus} label="Text" />
                    <button type="submit">Done</button>
                </ShForm>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));