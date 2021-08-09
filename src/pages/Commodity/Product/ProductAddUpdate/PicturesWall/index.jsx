import React, { Component } from 'react'
import PropTpyes from 'prop-types'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from '../../../../../api/index'
import { BASE_IMG_URL } from '../../../../../utils/constant';

//用于上传图片的组件 

function getBase64(file) {
 return new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
 });
}


export default class PicturesWall extends Component {

 static propTypes = {
  imgs: PropTpyes.array
 }

 constructor(props) {//构造器
  super(props)
  let fileList = []//默认为空数组
  //若传入imgs属性则赋值给fileList
  const { imgs } = this.props
  if (imgs && imgs.length > 0) {
   fileList = imgs.map((img, index) => ({
    uid: -index,//建议为负数
    name: img,
    status: 'done',
    url: BASE_IMG_URL + img,
   }))
  }
  //指定初始状态
  this.state = {
   previewVisible: false,//控制大图是否显示
   previewImage: '',//大图url
   previewTitle: '',//大图标题
   fileList//所有已上传图片的数组
  };
 }

 //关闭大图显示
 handleCancel = () => this.setState({ previewVisible: false });

 //显式指定文件对应的大图
 handlePreview = async file => {
  if (!file.url && !file.preview) {
   file.preview = await getBase64(file.originFileObj);
  }

  this.setState({
   previewImage: file.url || file.preview,
   previewVisible: true,
   previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
  });
 };

 //file是当前操作的图片（上传/删除）
 //filelist是所有已上传图片的数组
 handleChange = async ({ file, fileList }) => {
  // console.log('handleChange--1', file, fileList[fileList.length - 1], file === fileList[fileList.length - 1]);

  if (file.status === 'done') {//上传一张图片，此函数会调用三次，
   // 只有最后一次才存在response,此时状态为done
   //一旦上传成功，将当前上传的file的信息修正(name，url）
   const result = file.response
   if (result.status === 0) {
    message.success('上传图片成功')
    const { name, url } = result.data
    file.name = name
    file.url = url
   } else {
    message.error('上传图片失败')
   }
  } else if (file.status === 'removed') {//删除图片
   const result = await reqDeleteImg(file.name)//从后台删除图片
   if (result.status === 0) {
    message.success('删除图片成功')
   } else {
    message.error('删除图片失败')
   }
  }
  //更新文件列表状态
  this.setState({ fileList })
 };

 //获取所有待提交的图像名
 getImgs = () => {
  return this.state.fileList.map(file => file.name)
 }

 render() {
  const { previewVisible, previewImage, fileList, previewTitle } = this.state;
  const uploadButton = (
   <div>
    <PlusOutlined />
    <div style={{ marginTop: 3 }}>Upload</div>
   </div>
  );
  return (
   <>
    <Upload
     action="/manage/img/upload"//上传图片的接口地址
     accept='image/*'//限定只接受图片
     listType="picture-card"//显示图片的样式
     name='image' //请求参数名
     fileList={fileList}//指定所有已上传图片文件的列表
     onPreview={this.handlePreview}//
     onChange={this.handleChange}
    >
     {fileList.length >= 3 ? null : uploadButton}
    </Upload>
    <Modal
     visible={previewVisible}
     title={previewTitle}
     footer={null}
     onCancel={this.handleCancel}
    >
     <img alt="example" style={{ width: '100%' }} src={previewImage} />
    </Modal>
   </>
  );
 }
}