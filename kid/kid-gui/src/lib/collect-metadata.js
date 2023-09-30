// /**
//  * 报告遥测事件.
//  * @param {string} event - projectWasCreated，projectDidLoad，projectDidSave，projectWasUploaded之一
//  */
// // TODO进行遥测HOC并将其移到那里
// const collectMetadata = function (vm, projectName = "", locale = "") {
//   console.log("collectMetadata:", projectName);
//   // TODO将大部分或全部这些内容移到VM / Runtime上的collectMetadata（）方法中
//   const metadata = {
//     projectName: projectName,
//     language: locale,
//     spriteCount: 0,
//     blocksCount: 0,
//     costumesCount: 0,
//     listsCount: 0,
//     scriptCount: 0,
//     soundsCount: 0,
//     variablesCount: 0,
//   };

//   for (const target of vm.runtime.targets) {
//     ++metadata.spriteCount;
//     metadata.blocksCount += Object.keys(target.sprite.blocks._blocks).length;
//     metadata.costumesCount += target.sprite.costumes_.length;
//     metadata.scriptCount += target.sprite.blocks._scripts.length;
//     metadata.soundsCount += target.sprite.sounds.length;
//     for (const variableName in target.variables) {
//       const variable = target.variables[variableName];
//       if (variable.type === "list") {
//         ++metadata.listsCount;
//       } else {
//         ++metadata.variablesCount;
//       }
//     }
//   }

//   return metadata;
// };

// export default collectMetadata;
