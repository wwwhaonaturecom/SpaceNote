<?php
    $file = $_FILES['file'];//得到传输的数据
    //得到文件名称
    $name = $file['name'];
    $username = $_POST['username'].".png";
    $type = strtolower(substr($name,strrpos($name,'.')+1)); //得到文件类型，并且都转化成小写
    $allow_type = array('jpg','jpeg','gif','png'); //定义允许上传的类型
    //判断文件类型是否被允许上传
    if(!in_array($type, $allow_type)){
    //如果不被允许，则直接停止程序运行
    return ;
    }
    //判断是否是通过HTTP POST上传的
    if(!is_uploaded_file($file['tmp_name'])){
    //如果不是通过HTTP POST上传的
    return ;
    }
    $upload_path = "/data/wwwroot/www.kgyzone.cn/app/baidu/img/"; //上传文件的存放路径
    //开始移动文件到相应的文件夹
    if(move_uploaded_file($file['tmp_name'],$upload_path.$_POST['username'].".png")){
    echo "Successfully!<br>";
    echo $upload_path.$_POST['username'].".png";
    echo "<br>";
    echo $_POST['username'];
    }else{
    echo "Failed!";
    echo $username;
    }
?>