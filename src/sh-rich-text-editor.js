import React from 'react';
import ReactQuill from 'react-quill';
import ShCore from 'sh-core';
import * as _ from 'lodash';
import './sh-rich-text-editor.scss';


class ShRichTextEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            classList: {
                shRichTextEditor: true,
                empty: true
            },
            validStatus: 'unknown',
            requiredField: {showRequired: false}
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSelection = this.handleChangeSelection.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.validate = this.validate.bind(this);
    }

    validate(onSubmit) {
        if (onSubmit) {
            this.state.classList.shTouched = true;
        }
        let rtn = {isValid: true};

        this.state.classList.shInvalid = false;

        if (this.props.required && this.state.value.trim() === '') {
            this.state.classList.shInvalid = true;

            rtn.isValid = false;
            rtn.msg = 'Required';
        }
        var newState = _.clone(this.state);
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
        if (!_.isUndefined(props.value) && !_.isEqual(props.value, this.state.value)) {
            var newState = _.clone(this.state);
            newState.classList.empty = !props.value;
            newState.value = props.value;
            this.setState(newState, this.validate);
        }
    };

    componentDidMount() {
        if (this.props.value) {
            this.setState(
                {
                    value: this.props.value,
                    classList: {shInputText: true}
                }
            )
        }

        if (this.props.required) {
            this.setState({requiredField: {showRequired: true}});
        }
    };

    handleChange(value) {
        this.setState({value: value}, ()=> {
            if (this.props.validator) {
                this.props.validator.validate();
            } else {
                this.validate();
            }
        });
        this.props.onChange(value);
    };

    handleChangeSelection(event) {
        this.props.onChangeSelection(event);
    };

    handleFocus(event) {
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
        this.refs.quill.focus();
        this.state.classList.shTouched = true;
        var newState = _.clone(this.state);
        this.setState(newState);
    };

    handleBlur(event) {
        this.validate();
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
        this.refs.quill.blur();
        var newState = _.clone(this.state);
        newState.classList.empty = !this.state.value;
        newState.requiredField.showRequired = (this.state.value.length < 1 && this.props.required);
        this.setState(newState);
    };

    getEditor() {
        return this.refs.quill.getEditor();
    }

    clearText() {
        let defaultText = this.setDefaultStyle('', this.props.toolbarItems);
        this.getEditor().setHTML(defaultText);
    };

    getText() {
        return this.getEditor().getHTML();
    }

    setDefaultStyle(value, toolbarItems) {
        let { defaultFont, defaultFontSize } = this.props;

        if ((value === '') || (value === '<div><br></div>') || (value === '<div></div>')) {
            let defaultText = '<div style="';
            if (defaultFont !== '') {
                defaultText += 'font-family: ' + defaultFont + ';';
                toolbarItems[0].items[0].items.forEach(element => {
                element.selected = (element.label === defaultFont);
                });
            }
            if (defaultFontSize !== '') {
                defaultText += 'font-size: ' + defaultFontSize + ';';
                toolbarItems[0].items[2].items.forEach(element => {
                element.selected = (element.label === defaultFontSize);
                });
            }
            defaultText += '"><br></div>';
            return defaultText;
        }
        return value;
    };

    render() {
        var {
            value,
            label,
            onFocus,
            onBlur,
            required,
            toolbarItems,
            ...other
        } = this.props;

        value = this.setDefaultStyle(value, toolbarItems);

        return (
            <div id="react-quill-editor" className={this.props.className ? ShCore.getClassNames(this.state.classList) + ' ' + this.props.className : ShCore.getClassNames(this.state.classList)}>
                <ReactQuill ref="quill"
                    className="sh-rich-text-editor-quill"
                    {...other}
                    theme="snow"
                    onChange={this.handleChange}
                    onChangeSelection={this.handleChangeSelection}
                >
                    <ReactQuill.Toolbar
                        key="toolbar"
                        ref="toolbar"
                        items={toolbarItems} 
                    />
                    <div className="quill-contents-label">
                        <span className="label">{label}</span>
                        <span className={"required-label " + ShCore.getClassNames(this.state.requiredField)}>required</span>
                    </div>
                    <div
                        key="editor"
                        ref="editor"
                        className="quill-contents"
                        dangerouslySetInnerHTML={{ __html: value }}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                    />
                </ReactQuill>
            </div>
        );
    };
}

function getToolbarConfig() {

  let toolbar = _.cloneDeep(ReactQuill.Toolbar.defaultItems);

  let fontsToAdd = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Comic Sans MS', value: 'Comic Sans MS, cursive' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Impact', value: 'Impact, sans-serif' },
    { label: 'Tahoma', value: 'Tahoma, sans-serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Calibri', value: 'Calibri, san-serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' }
  ].sort(function (a, b) {
    return a.label > b.label;
  })

  toolbar[0].items[0].items = [
    ...toolbar[0].items[0].items,
    ...fontsToAdd
  ];

  //remove link option
  toolbar[1].items.pop();

  //remove image option
  toolbar.pop();

  return toolbar;
}

ShRichTextEditor.propTypes = {
  value: React.PropTypes.string.isRequired,
  label: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  onChangeSelection: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  toolbarItems: React.PropTypes.array,
  validator: React.PropTypes.object,
  required: React.PropTypes.bool,
  defaultFont: React.PropTypes.string,
  defaultFontSize: React.PropTypes.string
}

ShRichTextEditor.defaultProps = {
    validator: null,
    onChange: _.noop,
    onChangeSelection: _.noop,
    onBlur: _.noop,
    label: '',
    toolbarItems: getToolbarConfig(),
    required: false,
    defaultFont: '',
    defaultFontSize: ''
}

export default ShRichTextEditor;