var PathUilt = module.exports = {};
var path = require('path')
var fs = require('fs')
var _path = __dirname;
var D = function (filename,path,required){
	this.filename = filename;
	this.path = path;
	this.required = required;
}
var list = [];

PathUilt.travel = function(__dirname){
    fs.readdirSync(__dirname).forEach(function(file){          //根据当前文件的绝对路径，获取当前目录的所有文件及目录
        if(file.split(".")[0] != undefined && file.split(".")[0]!=""){          //切割文件名称,判断是否为.xxx文件    false
            var urlname = path.join(__dirname,file);        //拼接路径+文件名称
                if(fs.statSync(urlname).isDirectory()){         //判断是否为文件夹   true
                    PathUilt.travel(urlname);           //递归循环 , 如果是文件夹,调用当前方法传文件路径，获取所有文件
                }else{
                    /**
                     * 获取目录下所有的文件名，路径,和文件内容
                     * @type {string}
                     */
                    var url = "."+urlname.split(_path)[1];  //url 获取文件的相对路径
                    var string = fs.readFileSync(url).toString();   //根据相对路径找到文件，读取文件内容，并转化为string类型
                    PathUilt.file(file,string,url); //调PathUilt.file方法  参数（文件名称,文件内容,文件的相对路径）
             }
        }
    })
}
/**
 * 获取文件传给list数组
 * @param file
 * @param string
 * @param url
 */
PathUilt.file = function(file,string,url){
    //console.log(file);
    var url_indexOf = url.indexOf(file);
    url = url.substring(0,url_indexOf); //url 获取文件的相对路径  不带文件名称
    console.log(file)
    if(file.indexOf("PathTest") == -1 && file.indexOf("cmd") == -1){          //判断file是否为主文件
        var model;
        if(string.indexOf("require(") != -1 && url.indexOf("node_modules") == -1){           //判断当前文件是否存在  ”require(“
            var stringLength = string.length;           //获取文件的总长度
            var j =[];
            while(true){
                var i = string.indexOf("require(");         //获取”require(“出现的第一个下标
                if(i==-1) break;                            //如果没有   break;
                var buf = string.substring(i,stringLength);         //截取字符串”require(“出现的第一个下标    到    文件长度
                var start_indexOf = buf.indexOf("(");               //获取截取到的字符串中的  "(" 出现的第一个下标
                var end_indexOf = buf.indexOf(")");                 //获取截取到的字符串中的  ")" 出现的第一个下标
                var str = buf.substring(start_indexOf+1,end_indexOf);       //截取字符串     起始下标：start_indexOf  结束下标:end_indexOf
                j.push(str)                                                 //截取的字符串传给数组j
                string = buf.substring(end_indexOf,stringLength);       //截取字符串并赋值给string  开始下标end_indexOf  到  结束下标 stringLength    重新开始while循环
            }
            model = new D(file,url,j);
            list.push(model);           //将所有对象封装为数组
        }
    }
    return list;
}

/*/!**
 * 根据list数组中的数据来进行文件的读写
 * @param list
 *!/*/
PathUilt.arry = function(list){         //接受list数组
    for(var i in list) {                 //遍历数组
        var string_start = "require(";      //起始的字符串    用于拼接
        var string_end = ");\r\n";              //结束的字符串    用于拼接
        var xx = list[i].filename;
        if (xx.indexOf("_url") == -1){
            fs.writeFileSync(list[i].path + list[i].filename + "_url.js", PathUilt.new_url_data(list[i].required, string_start, string_end));    //如果不存在  创建文件并写入数据  参数(文件路径,PathUilt.new_url_data函数(list[i].requir ed数组,起始的字符串,结束的字符串))
        }
    }
}

/*/!**
 * 如果文件不存在 ，添加文件并写入数据
 * @param list_required
 * @param string_start
 * @param string_end
 * @returns {string}
 *!/*/
PathUilt.new_url_data = function(list_required,string_start,string_end){
    var string = "";
    for(var j in list_required){        //遍历数组list_required
        string += string_start+list_required[j]+string_end;     //拼接字符串 ：例如：require('path');
    }
    return string;      //返回数组list_required的数据
}

PathUilt.travel(__dirname)
PathUilt.arry(list);
//





