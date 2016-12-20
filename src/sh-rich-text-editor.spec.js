var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
import * as _ from 'lodash';

var ShRichTextEditor = require('./sh-rich-text-editor').default;

describe('root', function () {
    it('renders without problems', function () {
        let value = 'Test';
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value}/>);
        expect(root).toBeTruthy();
    });

    it('input styles not be set to empty if there is a value', function () {
        let value = '';
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChange={changeMe} />);
        let rootNode = ReactDOM.findDOMNode(root);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        root.handleChange({target:{value:2}});

        TestUtils.Simulate.blur(input);
        expect(rootNode.classList.length).toBe(3);
    });

    it('set classes from parent', function () {
        let value = '';
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor className="spam" value={value} />);
        let rootNode = ReactDOM.findDOMNode(root);
        expect(rootNode.classList).toContain('spam');
    });

    it('handle having outside onBlur', function () {
        let value = 'test';
        let blurTest = 0;
        let onBlur = () => {
            blurTest = 1;
        };
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onBlur={onBlur}  onChange={changeMe} />);
        expect(root.state).toBeTruthy();
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'quill-contents');
        TestUtils.Simulate.blur(input);
        expect(blurTest).toBe(1);
    });

    it('handle having outside onFocus', function () {
        let value = '0';
        let focusTest = 0;
        let onFocus = () => {
            focusTest = 1;
        };
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onFocus={onFocus} onChange={changeMe} />);
        expect(root.state).toBeTruthy();
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'quill-contents');
        TestUtils.Simulate.focus(input);
        expect(focusTest).toBe(1);
    });

    it('handle having outside onChangeSelection', function () {
        let value = '<p>1</p>';
        let selectionTest = 0;
        let selectMe = () => {
            selectionTest = 1;
        };
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChangeSelection={selectMe} onChange={changeMe} />);
        root.handleChangeSelection(0, 0, root);
        expect(selectionTest).toBe(1);
    });

    it('handle focus', function () {
        let value = '0';
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChange={changeMe} />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');

        TestUtils.Simulate.focus(input);
    });

    it('should handle keyUp events (field is not required)', function() {
        let value = '1';
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChange={changeMe} />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        expect(value).toBe('1');
        root.clearText();           // We have to "cheat" here because Quill doesn't handle keyUp events sent through React TestUtils
        root.handleKeyUp({key: 'Backspace'});
        expect(value).toBe('<p><span style="">&nbsp;</span></p>');
    });

    it('should handle keyUp events (field is required)', function() {
        let value = '1';
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} required onChange={changeMe} />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        expect(value).toBe('1');
        root.clearText();           // We have to "cheat" here because Quill doesn't handle keyUp events sent through React TestUtils
        root.handleKeyUp({key: 'Backspace'});
        expect(value).toBe('<p><span style="">&nbsp;</span></p>');
    });

    it('works a field is required', function () {
        let value = '0';
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor required value={value} onChange={changeMe} />);
        let rootNode = ReactDOM.findDOMNode(root);
        expect(root.state).toBeTruthy();
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        expect(root.state.classList.showRequired).toBe(true);
    });

    it('the required label should not show up if the field is not required', function () {
        let value = '';
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChange={changeMe} />);
        expect(root.state).toBeTruthy();
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'quill-contents');
        TestUtils.Simulate.focus(input);
        TestUtils.Simulate.blur(input);
        input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        expect(root.state.classList.showRequired).toBe(false);
    });

    it('should have a validator function', function() {
        let value = '0';
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChange={changeMe} />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        expect(root.validate().isValid).toBe(true);
    });

    it('should fail validator if there is no value and field is required', function() {
        let value = '';
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChange={changeMe} required />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        expect(root.validate().isValid).toBe(false);
    });

    it('should call register if a validator is present', function() {
        let value = '';
        let validator = {
            register: _.noop,
        };
        let changeMe = (newVal) => {
            value = newVal;
        };
        spyOn(validator, 'register');
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor validator={validator} value={value} onChange={changeMe} required />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        expect(validator.register).toHaveBeenCalled();
    });

    it('should call unregister if a validator is present', function() {
        let value = '';
        let validator = {
            register: _.noop,
            unregister: _.noop,
        };
        let changeMe = (newVal) => {
            value = newVal;
        };
        spyOn(validator, 'unregister');
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor validator={validator} value={value} onChange={changeMe} required />);
        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(root).parentNode);
        expect(validator.unregister).toHaveBeenCalled();
    });

    it('should be able to unmount a plane component', function() {
        let value = '';
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} required />);
        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(root).parentNode);
    });

    it('should call set class to touched a form as been submitted by the shForm', function() {
        let value = '';
        let validator = {
            register: _.noop,
            unregister: _.noop,
        };
        let changeMe = (newVal) => {
            value = newVal;
        };
        spyOn(validator, 'unregister');
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor validator={validator} value={value} onChange={changeMe} required />);
        root.validate(true);
        expect(root.state.classList.shTouched).toBe(true);
    });

    it('changing props should update state', function() {
        let value = '';
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChange={changeMe} required />);
        expect(root.state.classList.empty).toBe(true);
        var props = {
            value: '<p>0</p>'
        };
        root.componentWillReceiveProps(props);
        expect(root.state.classList.empty).toBe(false);
    });

    it('changing props without value should not update state', function() {
        let value = '<p>1</p>';
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChange={changeMe} required />);
        expect(value).toBe('<p>1</p>');
        var props = {};
        root.componentWillReceiveProps(props);
        expect(value).toBe('<p>1</p>');
    });

    it('calling clearText() should clear out the text area', function() {
        let value = 'test';
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChange={changeMe} />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'quill-contents');
        TestUtils.Simulate.blur(input);
        root.clearText();
        expect(value).toBe('<p><span style="">&nbsp;</span></p>');
    });

    it('should focus the editor when calling the component\'s focus method', function() {
        let value = 'test';
        let callbacks = {
            changeMe: _.noop,
            focusMe: _.noop
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChange={callbacks.changeMe} onFocus={callbacks.focusMe} />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'quill-contents');
        spyOn(callbacks, 'focusMe');
        TestUtils.Simulate.blur(input);
        root.focus();
        expect(root.state.classList.focused).toBe(true);
        expect(callbacks.focusMe).not.toHaveBeenCalled();
    });

    it('should blur the editor when calling the component\'s blur method', function() {
        let value = 'test';
        let callbacks = {
            changeMe: _.noop,
            blurMe: _.noop
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChange={callbacks.changeMe} onBlur={callbacks.blurMe} />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'quill-contents');
        spyOn(callbacks, 'blurMe');
        TestUtils.Simulate.focus(input);
        root.blur();
        expect(root.state.classList.focused).toBe(false);
        expect(callbacks.blurMe).not.toHaveBeenCalled();
    });

    it('should set the default font and size', function() {
        let value = '';
        let defaultFont = 'Verdana';
        let defaultFontSize = 'Large';
        let changeMe = (newVal) => {
            value = newVal;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChange={changeMe} defaultFont={defaultFont} defaultFontSize={defaultFontSize} />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'quill-contents');
        TestUtils.Simulate.blur(input);
        root.clearText();
        expect(value).toBe('<p><span style="font-family: Verdana; font-size: Large;">&nbsp;</span></p>');
    });

    it('should validate when updating the text', function () {
        let value = '';
        let validator = {
            validate: _.noop,
            register: _.noop
        };
        let changeMe = (newVal) => {
            value = newVal;
        };
        spyOn(validator, 'validate');
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} validator={validator} onChange={changeMe} />);
        root.handleChange({
            target: {
                value: 'the fat lazy cat'
            }
        });
        expect(validator.validate).toHaveBeenCalled();
    });
});