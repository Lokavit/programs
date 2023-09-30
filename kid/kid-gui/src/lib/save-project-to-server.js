/*
 * @Author: Satya
 * @Date: 2020-08-24 17:35:27
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-23 13:54:07
 * doc:保存项目到服务器
 */

import queryString from "query-string";
import xhr from "xhr";

/**
 * 将项目JSON保存到项目服务器.
 * This should eventually live in scratch-www.
 * @param {number} projectId 项目的ID，如果是新项目，则为null.
 * @param {object} vmState JSON项目表示形式.
 * @param {object} params 请求参数.
 * @property {?number} params.originalId 原始项目ID，如果复制/混音.
 * @property {?boolean} params.isCopy 一个标志，指示此保存是否正在创建副本.
 * @property {?boolean} params.isRemix 一个标志，指示此保存是否正在创建混音.
 * @property {?string} params.title 项目名称.
 * @return {Promise} A promise that resolves when the network request resolves.
 */
export default function (projectId, vmState, params) {
  console.log("将项目JSON保存到项目服务器:", projectId);
  const opts = {
    body: vmState,
    // If we set json:true then the body is double-stringified, so don't
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const creatingProject =
    projectId === null || typeof projectId === "undefined";
  const queryParams = {};
  if (params.hasOwnProperty("originalId"))
    queryParams.original_id = params.originalId;
  if (params.hasOwnProperty("isCopy")) queryParams.is_copy = params.isCopy;
  if (params.hasOwnProperty("isRemix")) queryParams.is_remix = params.isRemix;
  if (params.hasOwnProperty("title")) queryParams.title = params.title;
  let qs = queryString.stringify(queryParams);
  if (qs) qs = `?${qs}`;
  if (creatingProject) {
    Object.assign(opts, {
      method: "post",
      url: `${STORAGE.projectHost}/${qs}`,
    });
  } else {
    Object.assign(opts, {
      method: "put",
      url: `${STORAGE.projectHost}/${projectId}${qs}`,
    });
  }
  return new Promise((resolve, reject) => {
    xhr(opts, (err, response) => {
      if (err) return reject(err);
      if (response.statusCode !== 200) return reject(response.statusCode);
      let body;
      try {
        // Since we didn't set json: true, we have to parse manually
        body = JSON.parse(response.body);
      } catch (e) {
        return reject(e);
      }
      body.id = projectId;
      if (creatingProject) {
        body.id = body["content-name"];
      }
      resolve(body);
    });
  });
}
