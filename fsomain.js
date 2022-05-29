#!/usr/bin/env node
let inparr = process.argv.slice(2);
let fs = require("fs");
let path = require("path");
//console.log(inparr);

let command = inparr[0];
let types = {
  pictures: ["jpg", "jpeg", "png"],
  media: ["mp4", "mp3"],
  archives: ["zip"],
  documents: ["pdf", "docx", "doc", "php"],
  app: ["exe"],
};
switch (command) {
  case "tree":
    treefn(inparr[1]);
    break;
  case "organize":
    orgnfn(inparr[1]);
    break;
  case "help":
    helpfn();
    break;
  default:
    console.log("please input right command");
}

function treefn(dirpath) {
  //console.log("Tree command implemented for the ", dirpath);
  if (dirpath == undefined) {
    //making the check dirpath is given
    //console.log("kindly enter the path");
    tree_helper(process.cwd(), "");
    return;
  } else {
    let doesExist = fs.existsSync(dirpath);
    if (doesExist) {
      // writing the rest part in organize_helper function for better readibilitty
      tree_helper(dirpath, ""); // the empty string is for the indentation purpose
    } else {
      console.log("kindly enter the correct path");
      return;
    }
  }
}
function orgnfn(dirpath) {
  // console.log("Organize command implemented for the ", dirpath);
  // 1. input a directory
  // 2.create directory for organized files
  // 3. identify type of every file in the input directory
  // 4. copy and cut the files to organized directory in the corresponding type directory
  let destpath;
  if (dirpath == undefined) {
    //making the check dirpath is given
    // console.log("kindly enter the path");
    destpath = process.cwd();
    return;
  } else {
    let doesExist = fs.existsSync(dirpath);
    if (doesExist) {
      destpath = path.join(dirpath, "organized_files");
      if (fs.existsSync(destpath) == false)
        // create destpath directory only if doesn't already exists
        fs.mkdirSync(destpath);

      // writing the rest part in organize_helper function for better readibilitty
      organize_helper(dirpath, destpath);
    } else {
      console.log("kindly please enter the correct path");
      return;
    }
  }
}

function tree_helper(dirpath, indent) {
  // second argument is indentaton spacing in tree
  let isFile = fs.lstatSync(dirpath).isFile();
  if (isFile) {
    let filename = path.basename(dirpath);
    console.log(indent + "├──" + filename);
  } else {
    let foldrname = path.basename(dirpath);
    console.log(indent + "└──" + foldrname);
    let folder = fs.readdirSync(dirpath);
    for (let i = 0; i < folder.length; i++) {
      let childpath = path.join(dirpath, folder[i]);
      tree_helper(childpath, indent + "\t");
    }
  }
}
function organize_helper(src, dest) {
  let childnames = fs.readdirSync(src);
  // console.log(childnames);
  for (let i = 0; i < childnames.length; i++) {
    let childAdds = path.join(src, childnames[i]);
    let isFile = fs.lstatSync(childAdds).isFile();
    if (isFile) {
      // console.log(childnames[i]);
      let ctg = getCategory(childnames[i]);
      // console.log(childnames[i], " belongs to ---> ", ctg);
      sendfile(childAdds, dest, ctg);
    }
  }
}

function sendfile(srcfilepath, dest, ctg) {
  let ctgpath = path.join(dest, ctg);
  if (fs.existsSync(ctgpath) == false) {
    fs.mkdirSync(ctgpath);
  }

  let filename = path.basename(srcfilepath);
  let destfilepath = path.join(ctgpath, filename);
  fs.copyFileSync(srcfilepath, destfilepath); // this copies files from src to dest
  //now we need to cut at original file so doing that below
  fs.unlinkSync(srcfilepath);
}
function getCategory(filename) {
  let ext = path.extname(filename);
  ext = ext.slice(1);
  //console.log(ext);
  for (let type in types) {
    let currtype = types[type];
    for (let i = 0; i < currtype.length; i++) {
      if (ext == currtype[i]) return type;
    }
  }
  return "other"; // specified type didnt found!!!!!
}
function helpfn() {
  console.log(`
  List of all the commands:
        node fsomain.js tree "directoryPath"
        node fsomain.js organize "directoryPath"
        node fsomain.js help
  `);
}
