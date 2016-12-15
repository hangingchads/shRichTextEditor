import React from 'react';
import Quill from 'quill';
import ReactQuill from 'react-quill';
import ShCore from 'sh-core';
import * as _ from 'lodash';
import './sh-rich-text-editor.scss';

class ShRichTextEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classList: {
                shRichTextEditor: true,
                empty: true,
                focused: false,
                showRequired: false,
                prompt: true
            },
            validStatus: 'unknown'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelection = this.handleChangeSelection.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.validate = this.validate.bind(this);
    }

    validate(onSubmit) {
        let newState = _.clone(this.state);
        if (onSubmit) {
            newState.classList.shTouched = true;
        }
        let rtn = {isValid: true};

        newState.classList.shInvalid = false;
        if (this.props.required && this.isEmpty(this.refs.quill.getEditorContents().trim())) {
            newState.classList.shInvalid = true;

            rtn.isValid = false;
            rtn.msg = 'Required';
        }

        this.setState(newState);
        return rtn;
    };

    componentWillMount() {
        if (this.props.validator) {
            this.props.validator.register(this, this.validate);
        }
    };

    componentWillUnmount() {
        if (this.props.validator) {
            this.props.validator.unregister(this);
        }
    };

    componentWillReceiveProps(props) {
        if (!_.isUndefined(props.value) && !_.isEqual(props.value, this.refs.quill.getEditorContents())) {
            var newState = _.clone(this.state);
            newState.classList.empty = this.isEmpty(props.value);
            newState.classList.prompt = this.isEmpty(props.value);
            this.setState(newState, this.validate);
        }
    };

    componentDidMount() {
        if (this.props.value) {
            let value = this.props.value;
            let isEmpty = this.isEmpty(value);
            this.setState(
                {
                    classList: {
                        shRichTextEditor: true,
                        showRequired: this.props.required,
                        empty: isEmpty,
                        prompt: isEmpty
                    }
                }
            );
        }
    };

    handleChange(value) {
        if (this.props.validator) {
            this.props.validator.validate();
        } else {
            this.validate();
        }
        this.props.onChange(value);
    };

    handleChangeSelection(range, oldRange, source) {
        this.props.onChangeSelection(range, oldRange, source);
    };

    handleFocus(event) {
        this.focus();
        this.props.onFocus(event);
    };

    handleBlur(event) {
        this.blur();
        this.props.onBlur(event);
    };

    handleComponentFocus() {
        this.refs.quill.focus();
    }

    handleComponentBlur() {
        this.refs.quill.blur();
    }

    handleKeyUp(event) {
        let isEmpty = this.isEmpty(this.refs.quill.getEditorContents().trim());
        var newState = _.clone(this.state);
        newState.classList.empty = isEmpty;
        newState.classList.showRequired = (isEmpty && this.props.required);
        this.setState(newState);
    };

    focus() {
        let newState = _.clone(this.state);
        newState.classList.shTouched = true;
        newState.classList.focused = true;
        newState.classList.prompt = false;
        this.setState(newState);
    }

    blur() {
        this.validate();
        let isEmpty = this.isEmpty(this.refs.quill.getEditorContents().trim());
        var newState = _.clone(this.state);
        newState.classList.empty = isEmpty;
        newState.classList.focused = false;
        newState.classList.showRequired = (isEmpty && this.props.required);
        newState.classList.prompt = isEmpty;
        this.setState(newState);
        this.refs.quill.blur();
    }

    clearText() {
        let defaultText = this.getDefaultStyle('');
        this.refs.quill.setEditorContents(this.refs.quill.getEditor(), defaultText);
        this.handleChange(defaultText);
    };

    isEmpty(value) {
        return ((value === '') || (value === '<p></p>') || (value === '<p><br></p>') || (value === this.getDefaultStyle('')));
    };

    getDefaultStyle(value) {
        let { defaultFont, defaultFontSize } = this.props;
        if ((value === '') || (value === '<p></p>') || (value === '<p><br></p>')) {
            let defaultText = '<p><span style="';
            if (defaultFont !== '') {
                defaultText += 'font-family: ' + defaultFont + ';';
            }
            if (defaultFontSize !== '') {
                defaultText += ' font-size: ' + defaultFontSize + ';';
            }
            defaultText += '">&nbsp;</span></p>';
            return defaultText;
        }
        return value;
    };


    render() {
        let {
            value,
            label,
            onFocus,
            onBlur,
            required,
            quillModules,
            quillFormats,
            defaultFont,
            defaultFontSize,
            ...other
        } = this.props;

        value = this.getDefaultStyle(value);

        return (
            <div id="react-quill-editor"
                 className={this.props.className ? ShCore.getClassNames(this.state.classList) + ' ' + this.props.className : ShCore.getClassNames(this.state.classList)}>
                <ReactQuill ref="quill"
                            className="sh-rich-text-editor-quill"
                            theme="snow"
                            bounds={".quill-contents"}
                            modules={quillModules}
                            formats={quillFormats}
                            value={value}
                            onFocus={this.handleComponentFocus}
                            onBlur={this.handleComponentFocus}
                            onChange={this.handleChange}
                            onChangeSelection={this.handleChangeSelection}
                            toolbar={false}
                            tabindex="-1"
                            {...other}
                >
                    <div
                        key="editor"
                        ref="editor"
                        className="quill-contents"
                        dangerouslySetInnerHTML={{__html: value}}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        onKeyUp={this.handleKeyUp}
                    />
                </ReactQuill>
                <div className="quill-contents-label">
                    <span className="label">{label}</span>
                    <span className="required-label">required</span>
                </div>
            </div>
        );
    };
}

function getQuillModules() {
	let fontsToAdd = ['Arial', 'Calibri', 'Comic Sans MS', 'Georgia', 'Impact', 'Monospace',
        'Sans-Serif', 'Serif', 'Tahoma', 'Times New Roman', 'Verdana'];
  
	return {
      toolbar: [ 
          [{'font': fontsToAdd}, {'size': ['small', 'medium', 'large', 'huge']}],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'align': [] }],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}], 
          [{ 'color': [] }, { 'background': [] }], 
          ['link', 'image']
      ],
      clipboard: true
  };
}


function getQuillFormats() {
	return [ 
      "font", "size",
      "bold", "italic", "underline", "strike",
      "align",
      "list", "bullet", "indent",
      "color", "background",
      "link", "image" 
  ];
}

ShRichTextEditor.propTypes = {
  value: React.PropTypes.string.isRequired,
  label: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  onChangeSelection: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  quillModules: React.PropTypes.object,
  quillFormats: React.PropTypes.array,
  validator: React.PropTypes.object,
  required: React.PropTypes.bool,
  defaultFont: React.PropTypes.string,
  defaultFontSize: React.PropTypes.string
}

ShRichTextEditor.defaultProps = {
    validator: null,
    onChange: _.noop,
    onChangeSelection: _.noop,
    onFocus: _.noop,
    onBlur: _.noop,
    label: '',
    quillModules: getQuillModules(),
    quillFormats: getQuillFormats(),
    required: false,
    defaultFont: '',
    defaultFontSize: ''
}


export default ShRichTextEditor;