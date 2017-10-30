import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import 'draft-js/dist/Draft.css';
import Rich from './Rich';

import {Editor, EditorState, ContentState, convertFromHTML, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';


const dummyStorageText = '{"entityMap":{},"blocks":[{"key":"foma3","text":"jkslafsajkflsajkl","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}';
const htmlMarkUp = `
<h6>見出し</h6>
<p><strong>太字</strong></p>
<p><em>斜体字</em></p>
<p><span style="text-decoration: line-through;">打ち消し線</span></p>
<p style="text-align: left;">左寄せ</p>
<p style="text-align: center;">中央寄せ</p>
<p style="text-align: right;">右寄せ</p>
<p><a href="https://twitter.com/">https://twitter.com/</a></p>
<p><iframe src="//www.youtube.com/embed/rbVg3iaqqBQ" width="425" height="350"></iframe></p>
<p><img src="https://images.unsplash.com/photo-1463740839922-2d3b7e426a56?auto=format&amp;fit=crop&amp;w=3819&amp;q=60&amp;ixid=dW5zcGxhc2guY29tOzs7Ozs%3D" alt=""></p>
`;
const blocksFromHTML = convertFromHTML(htmlMarkUp);
const state = ContentState.createFromBlockArray(
  blocksFromHTML.contentBlocks,
  blocksFromHTML.entityMap
);

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
    const content = this.state.editorState.getCurrentContent();
    console.log(convertToRaw(content));
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
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
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

