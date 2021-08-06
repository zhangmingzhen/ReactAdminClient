import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
// import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { thisStringValue } from 'es-abstract/es2019'


export default class RichTextEditor extends Component {

 static propTypes = {
  detail: PropTypes.string
 }

 constructor(props) {
  super(props);
  const html = this.props.detail//取得detail
  if (html) {//如果有值，则根据它显示
   const contentBlock = htmlToDraft(html);
   const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
   const editorState = EditorState.createWithContent(contentState);
   this.state = {
    editorState,
   }
  } else {//否则创建一个空的
   this.state = {
    editorState: EditorState.createEmpty(),//创建一个空的编辑对象
   }
  }
 }

 onEditorStateChange = (editorState) => {
  // console.log('onEditorStateChange',);
  this.setState({
   editorState,
  });
 };

 getDetail = () => {//返回输入数据对应的html格式的文本
  return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
 }

 uploadImageCallBack=(file)=> {
  return new Promise(
   (resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/manage/img/upload');
    const data = new FormData();
    data.append('image', file);
    xhr.send(data);
    xhr.addEventListener('load', () => {
     const response = JSON.parse(xhr.responseText);
     const url = response.data.url
     // resolve(response);
     resolve({data:{link:url}});

    });
    xhr.addEventListener('error', () => {
     const error = JSON.parse(xhr.responseText);
     reject(error);
    });
   }
  );
 }

 render() {
  const { editorState } = this.state;
  return (
   <Editor
    editorState={editorState}
    editorStyle={{ border: '1px solid black', minHeight: 200, padding: 10 }}
    onEditorStateChange={this.onEditorStateChange}//绑定监听
    toolbar={{
     image: {
      uploadCallback: this.uploadImageCallBack,//上传图片的回调
      alt: { present: true, mandatory: true }
     },
    }}
   />
  );
 }
}
