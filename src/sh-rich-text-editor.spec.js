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
        expect(rootNode.classList.length).toBe(2)
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
        expect(blurTest).toBe(1)
    });

    it('handle having outside onFocus', function () {
        let value = '0';
        let focusTest = 0;
        let onFocus = () => {
            focusTest = 1;
        };

        var root = TestUtils.renderIntoDocument(<ShRichTextEditor value={value} onFocus={onFocus}/>);
        expect(root.state).toBeTruthy();
        let input = TestUtils.findRenderedDOMComponentWithClass(root, 'quill-contents');
        TestUtils.Simulate.focus(input);
        expect(focusTest).toBe(1)
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

});