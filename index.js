module.exports = function(){
  var inquirer     = require("inquirer");
  var generate     = require("ascii-tree").generate;
  var fs           = require("fs");
  var escaperegex  = function(text) {
    return text.replace(/[-.\\\[\]|^$()?+*{}]/g,function(m){return "\\"+m;});
  };
  inquirer.prompt([{type: "list", name: "fileYesNo", message: "Will you use an editor to write down the ascii tree, or do you have a file with it?", choices: ["Use editor", "Use already-existing file"]}]).then(function(answers){
    if (answers.fileYesNo == "Use editor") {
      var thingy;
      inquirer.prompt([{type: "editor", name: "editIt", message: "Please write the tree (Example: #RootNode\\n##Sibling\\n###Sibling of Sibling)", validate: function(text){
        if (text.length < 1) return "Don't leave it empty!";
        if (/^\s+$/.test(text)) return "Don't leave it empty!";
        if (/^[^#]+#/.test(text)) text = text.replace(/^[^#]+#+$/, function(selection){
          var bad = selection.match(/^([^#]+)#/)[1];
          return selection.replace(new RegExp(escaperegex(bad) + "$"), "");
        });
        if (!(/#/.test(text))) return "Needs at least 1 node.";
        if (/#.+\n[^#]+$/.test(text)) text = text.replace(/#.+\n[^#]+$/, function(selection){
          var bad = selection.match(/^#.+(\n[^#]+)$/)[1];
          return selection.replace(new RegExp(escaperegex(bad) + "$"), "");
        });
        text = text.replace(/^\s+/, "").replace(/\s+$/, "");
        try {
          thingy = generate(text);
        } catch (err) {
          return err.message;
        }
        return true;
      }}]).then(function(answer){
        console.log("\n\n\x1b[1mGenerated Tree:\x1b[0m\n\n" + thingy);
        process.exit(0);
      });
    } else {
      var filethingy;
      inquirer.prompt([{type: "input", name: "path", message: "Please insert the directory of the file. (Example: /Users/YourName/myfile.txt, or ./dir/file.txt)", validate: function(text){
        if (!(fs.existsSync(text))) return "Invalid path!";
        if (fs.lstatSync(text).isDirectory()) return "File must not be a directory!";
        if (fs.accessSync(text, fs.R_OK)) return "No access to reading the file!";
        var thetext = fs.readFileSync(text, "utf8");
        if (thetext.length < 1) return "File must not be empty!";
        if (/^\s+$/.test(thetext)) return "File must not be empty!";
        if (!(/#/.test(thetext))) return "Needs at least 1 node.";
        if (/^[^#]+#/.test(thetext)) thetext = thetext.replace(/^[^#]+#+$/, function(selection){
          var bad = selection.match(/^([^#]+)#/)[1];
          return selection.replace(new RegExp(escaperegex(bad) + "$"), "");
        });
        if (/#.+\n[^#]+$/.test(thetext)) thetext = thetext.replace(/#.+\n[^#]+$/, function(selection){
          var bad = selection.match(/^#.+(\n[^#]+)$/)[1];
          return selection.replace(new RegExp(escaperegex(bad) + "$"), "");
        });
        try {
          filethingy = generate(thetext.replace(/^\s+/, "").replace(/\s+$/, ""));
        } catch (err) {
          return err.message;
        }
        return true;
      }}]).then(function(answer){
        var thetext = fs.readFileSync(answer.path, "utf8");
        console.log("\n\n\x1b[1mGenerated Tree:\x1b[0m\n\n" + filethingy);
        process.exit(0);
      });
    }
  });
};
