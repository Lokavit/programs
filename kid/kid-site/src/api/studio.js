import { HTTP } from "./http";

export function getHeaderInfo() {
  return HTTP({
    url: "getHeaderInfo",
    method: "GET",
  });
}

/**
 * @function 根据url获取当前参数值对应工作室信息
 * @param {*} id 机构工作室id
 */
export function getStudioInfo(id) {
  return HTTP({
    url: `studio/getStudioInfo/${id}`,
    method: "GET",
  });
}

/**
 * @function 教师列表
 * @param {*} data 需要拉取的教师
 */
export function postTeacherList(data) {
  return HTTP({
    url: "managerTeacher/getListNoLogin",
    method: "POST",
    data,
  });
}

/**
 * @function 作品列表
 * @param {*} data
 */
export function postProjectList(data) {
  return HTTP({
    url: "project/listByStudioId",
    method: "POST",
    data,
  });
}

export function getCourseList(params) {
  return HTTP({
    url: "course/getListForTrainingStudio",
    method: "GET",
    params,
  });
}
