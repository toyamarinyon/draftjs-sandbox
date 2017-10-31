import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import 'draft-js/dist/Draft.css';
import Rich from './Rich';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
import Immutable from 'immutable';

import {Editor, EditorState, ContentState, convertFromHTML, RichUtils,getSafeBodyFromHTML, convertToRaw, convertFromRaw, DefaultDraftBlockRenderMap} from 'draft-js';

const blockRenderMap = Immutable.Map({
  'align-left': {
    element: 'div'
  }
});

// Include 'paragraph' as a valid block and updated the unstyled element but
// keep support for other draft default block types
const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    case 'align-left': return 'align-left';
    case 'align-center': return 'align-center';
    case 'align-right': return 'align-right';
    default: return null;
  }
}

const dummyStorageText = '{"entityMap":{},"blocks":[{"key":"foma3","text":"jkslafsajkflsajkl","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}';
const htmlMarkUp = `
<h6>見出し</h6>
<p><strong>太字</strong></p>
<p><em>斜体字</em></p>
<p>打ち消し線</p>
<p style="text-align: left">左寄せ</p>
<p style="text-align: center">中央寄せ</p>
<p style="text-align: right">右寄せ</p>
<p><a href="https://twitter.com/">https://twitter.com/</a></p>
<p><img src="https://images.unsplash.com/photo-1463740839922-2d3b7e426a56?auto=format&amp;fit=crop&amp;w=3819&amp;q=60&amp;ixid=dW5zcGxhc2guY29tOzs7Ozs%3D" alt=""/></p>`;
let options = {
  customBlockFn(element) {
    let {tagName} = element;
    if (
      tagName === 'P' &&
      element.style.textAlign
    ) {
      return {type: `align-${element.style.textAlign}`};
    }
  },
};
const state = stateFromHTML(htmlMarkUp, options);

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    console.log(JSON.parse(dummyStorageText));
    // this.state = {editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(dummyStorageText)))};
    this.state = {editorState: EditorState.createWithContent(state)};
    // this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }
  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }
  _onLogClick() {
    let options = {
      blockStyleFn(block) {
        switch (block.get('type')) {
          case 'align-left':
          case 'align-right':
          case 'align-center':
            return { style: { textAlign: block.get('type').substring(6) } };
        }
      }
    };
    const content = this.state.editorState.getCurrentContent();
    console.log(stateToHTML(content, options));
  }
  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }
  render() {
    return (
      <div>
        <button onClick={this._onBoldClick.bind(this)}>Bold</button>
        <button onClick={this._onLogClick.bind(this)}>Log</button>
        <Editor
        blockStyleFn={getBlockStyle}
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          blockRenderMap={extendedBlockRenderMap}
        />
        <Rich />
      </div>
    );
  }
}

ReactDOM.render(
  <MyEditor />,
  document.getElementById('root')
);
registerServiceWorker();

