var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react/lib/ReactTestUtils');
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

        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} />);
        let rootNode = ReactDOM.findDOMNode(root);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        root.handleChange({target:{value:2}});

        TestUtils.Simulate.blur(input);
        expect(rootNode.classList.length).toBe(2);
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

        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onBlur={onBlur}/>);
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

        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onFocus={onFocus} />);
        expect(root.state).toBeTruthy();
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'quill-contents');
        TestUtils.Simulate.focus(input);
        expect(focusTest).toBe(1);
    });

    it('handle having outside onChangeSelection', function () {
        let value = '<div>1</div>';
        let selectionTest = 0;
        let selectMe = () => {
            selectionTest = 1;
        };

        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onChangeSelection={selectMe} />);
        root.handleChangeSelection(0, 0, root);
        expect(selectionTest).toBe(1);
    });

    it('handle focus', function () {
        let value = '0';

        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value}/>);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');

        TestUtils.Simulate.focus(input);
    });

    it('works a field is required', function () {
        let value = '0';
        let changeMe = () => {
            value = 1;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor required value={value} onChange={changeMe}/>);
        let rootNode = ReactDOM.findDOMNode(root);
        expect(root.state).toBeTruthy();
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        expect(root.state.requiredField.showRequired).toBe(true);
    });

    it('the required label should not show up if the field is not required', function () {
        let what = '';
        let changeMe = () => {
            value = 1;
        };
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={what} onChange={changeMe}/>);
        expect(root.state).toBeTruthy();
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'quill-contents');
        TestUtils.Simulate.focus(input);
        TestUtils.Simulate.blur(input);
        input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        expect(root.state.requiredField.showRequired).toBe(false);
    });

    it('should have a validator function', function() {
        let value = '0';
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        expect(root.validate().isValid).toBe(true);
    });

    it('should fail validator if there is no value and field is required', function() {
        let value = '';
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} required />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        expect(root.validate().isValid).toBe(false);
    });

    it('should call register if a validator is present', function() {
        let value = '';
        let validator = {
            register: _.noop,
        };
        spyOn(validator, 'register');
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor validator={validator} value={value} required />);
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'sh-rich-text-editor-quill');
        expect(validator.register).toHaveBeenCalled();
    });

    it('should call unregister if a validator is present', function() {
        let value = '';
        let validator = {
            register: _.noop,
            unregister: _.noop,
        };
        spyOn(validator, 'unregister');
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor validator={validator} value={value} required />);
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
        spyOn(validator, 'unregister');
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor validator={validator} value={value} required />);
        root.validate(true);
        expect(root.state.classList.shTouched).toBe(true);
    });

    it('changing props should update state', function() {
        let value = '<div>1</div>';
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} required />);
        var props = {
            value: '<div>0</div>'
        };
        root.componentWillReceiveProps(props);
        expect(root.state.value).toBe('<div>0</div>');
    });

    it('changing props without value should not update state', function() {
        let value = '<div>1</div>';
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} required />);
        expect(root.state.value).toBe('<div><br></div>');
        var props = {};
        root.componentWillReceiveProps(props);
        expect(root.state.value).toBe('<div><br></div>');
    });

    it('calling clearText() should clear out the text area', function() {
        let value = 'test';
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} />);
        root.clearText();
        expect(root.getText()).toBe('<div style=""><br></div>');
    });

    it('should set the default font and size', function() {
        let value = '';
        let defaultFont = 'Verdana';
        let defaultFontSize = 'Large';
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} defaultFont={defaultFont} defaultFontSize={defaultFontSize} />);
        root.clearText();
        expect(root.getText()).toBe('<div style="font-family: Verdana;font-size: Large;"><br></div>');
    });

    it('should validate when updating the text', function () {
        let value = '';
        let validator = {
            validate: _.noop,
            register: _.noop
        };
        spyOn(validator, 'validate');
        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} validator={validator} />);
        root.handleChange({
            target: {
                value: 'the fat lazy cat'
            }
        });
        expect(validator.validate).toHaveBeenCalled();
    });
});