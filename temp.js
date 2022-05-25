var fs = require('fs');
var path = require('path');
var jsonfile = require('jsonfile');
var id = 1;

var dir = function (basePath, parent) {
  var jsonTree = [];
  var items;

  try {
    items = fs.readdirSync(basePath);
  } catch (e) {
    return null;
  }

  for (var itemCounter=0; itemCounter < items.length; itemCounter++) {
    var itemName = items[itemCounter];
    var newPath = basePath + path.sep + itemName;
    var stats;

    try {
      stats = fs.statSync(newPath);
    } catch (e) {
      return null;
    }

    var item = {
      id: id++,
      text: itemName
    };

    if (parent != null) {
      item.parent = parent
    }

    if (stats.isDirectory()) {
      var children = dir(newPath, item.id);
      if (children != []) {
        item.children = children; // Possibly array.push(dirSync()) or obj[newPath] = dirSync() ...?
      }
    }

    jsonTree.push(item);
  }

  return jsonTree;
}
var jsonStructure = dir('./dest', null);
var fileName = 'folderTree.json';
jsonfile.writeFile(fileName,jsonStructure,{spaces:2},(err)=>{
    // console.log(err)
})