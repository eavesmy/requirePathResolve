var PathUilt_cmd = module.exports = {};
var fs = require('fs');
var child = require('child_process');
var path = require('path')
var _path = __dirname;
var exec = child.exec;
var D = function(url,filename){
    this.url = url;
    this.filename = filename;
}
var list = [];
/**
 * 获取所有文件   启动入口
 * @param __dirname
 */
PathUilt_cmd.query = function(__dirname){
    fs.readdirSync(__dirname).forEach(function(file){
        if(file.split(".")[0] != undefined && file.split(".")[0]!=""){
            var urlname = path.join(__dirname,file);
            if(fs.statSync(urlname).isDirectory() && urlname.indexOf("node_modules") == -1){
                PathUilt_cmd.query(urlname);
            }else{
                var url = path.relative(_path,urlname);
                var model = new D(urlname,file);
                list.push(model);
                PathUilt_cmd.cmd(url);
            }
        }
    })
}
/**
 * 判断不是_url.js的文件  和 路径带有node_modules的文件
 * @param url
 */
PathUilt_cmd.cmd = function(url){
    if(url.indexOf("_url") != -1 && url.indexOf("node_modules") == -1){
        var cmd = "node "+url;
        PathUilt_cmd.exec(cmd);
    }
}
/**
 * 运行_url.js文件
 * @param cmd
 */
PathUilt_cmd.exec = function(cmd){
    exec(cmd,function(err,stout,sterr){
        try{
            if (err) {
                PathUilt_cmd.err(err);
            }else{
                console.log("执行完成。",stout);
            }
            console.log(err)
        }catch(ReferenceError){
            console.log("异常");
        }
    })
};
/**
 *截取err路径
 */
PathUilt_cmd.err = function(err){
    var string = err.toString().split("'")[1];
    var error = err.toString().split("at Object.<anonymous>")[1];
    var error_path = error.substring(error.indexOf("(")+1,error.indexOf(")"))
    var data = error_path+"\r\n"+string+"\r\n";
    if(data.indexOf("node_modules") == -1){
        PathUilt_cmd.log("log.txt",data);
        PathUilt_cmd.file_replace(error_path,string,1);
    }
}
/**
 * 文件操作
 */
PathUilt_cmd.log = function(fileName,data,choice){
    if(fs.existsSync(fileName) && choice != ""){
        fs.appendFile(fileName,data)
    }else{
        fs.writeFileSync(fileName,data);
    }
}
/**
 * 获取文件内容
 */
PathUilt_cmd.file_data = function(url){
    return fs.readFileSync(url).toString();
}
/**
 * 获取文件相对路径
 */
PathUilt_cmd.path_relative = function(from,too){
    var url = path.relative(from,too);
    url = PathUilt_cmd.Escape(url);
    url = url.replace("../","./");
    if(url.split(".j")[1] == "s"){
        return url.split(".js")[0];
    }else{
        return url.split(".json")[0];
    }

}
/**
 * 路径转义
 */
PathUilt_cmd.Escape = function(str){
    return str.replace(/\\/g,"/");
}
/**
 * 替换文件内容
 */
PathUilt_cmd.file_replace = function(error_path,string){
    for(var i in list){
        if(string.indexOf(list[i].filename.split(".")[0]) != -1 && list[i].filename.indexOf("_url") == -1){
            var file_data = PathUilt_cmd.file_data(error_path.split("_url.js")[0]); //获取文件内容
            file_data = PathUilt_cmd.Escape(file_data);
            var Relative_path = PathUilt_cmd.path_relative(error_path.split("_url.js")[0],list[i].url);
            file_data = file_data.replace(string,Relative_path);
            PathUilt_cmd.log(error_path.split("_url.js")[0],file_data);
            require("./PathTest");
        }
    }
}
PathUilt_cmd.query(__dirname);
