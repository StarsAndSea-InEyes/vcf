import request from '@/utils/request'
import qs from 'qs'

// 从本地获取HPO数据
export function getHpoJson() {
  return request({
    url: `json/test.json`,
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'get',
  })
}
// 从服务器获取HPO数据
export function getWebHpoJson(pageNum,pageSize) {
  const data = {
    pageNum,
    pageSize,
  }
  return request({
    url: `/database/getHpoList`,
    method: 'get',
    params: data
  })
}
// 从本地通过关系获取父节点下的HPO数据
export function getNextHpoJson() {
  return request({
    url: `json/edges.json`,
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'get',
  })
}
//创建项目
export function getCreateTask(data) {
  const encodedData = qs.stringify(data);
  return request({
    url: `/task/create`,
    method: 'post',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: encodedData
  })
}
//获取我的生信项目
export function getLetterTasks() {
  return request({
    url: `/task/getMyTaskList`,
    method: 'get',
  })
}
//获取HG19_Variant_summary列表
export function getHg19List(pageNum,pageSize) {
  const data = {
    pageNum,
    pageSize,
  }
  return request({
    url: `/database/getHg19List`,
    method: 'get',
    params: data
  })
}
//获取gene列表
export function getGeneList(pageNum,pageSize) {
  const data = {
    pageNum,
    pageSize,
  }
  return request({
    url: `/database/getGeneList`,
    method: 'get',
    params: data
  })
}
//获取HPO对应疾病
export function getDiseaseByHpo(hpoid) {
  const data = {
    hpoId:hpoid,
  }
  return request({
    url: `/database/getDiseaseByHpo`,
    method: 'get',
    params: data
  })
}
//获取HPO对应基因
export function getGeneByHpo(hpoid) {
  const data = {
    hpoId:hpoid,
  }
  return request({
    url: `/database/getGeneByHpo`,
    method: 'get',
    params: data
  })
}
//获取HPO对应基因
export function getGeneByHpoInfo(hpoid,pageNum,pageSize) {
  const data = {
    hpoId:hpoid,
    pageNum:pageNum,
    pageSize:pageSize
  }
  return request({
    url: `/database/getGeneByHpoInfo`,
    method: 'get',
    params: data
  })
}
//为任务添加家系样本
export function postGenealogy(data) {
  // const data={
  //   genealogies:arr,
  //   taskId:id
  // }
  return request({
    url: `/task/postGenealogy`,
    method: 'post',
    data: data
  })
}
//获取任务的家系样本栏
export function getTaskGenealogies(data) {

  return request({
    url: `/task/getTaskGenealogies`,
    method: 'get',
    params: data
  })
}
//获取分析任务上传的文件信息
export function getTaskUploadFileInfo(data) {
  return request({
    url: `/task/getTaskUploadFileInfo`,
    method: 'get',
    params: data
  })
}
//为任务文件添加与家系样本的关系信息
export function postTaskFile(data) {
  return request({
    url: `/task/postTaskFile`,
    method: 'post',
    data: data
  })
}