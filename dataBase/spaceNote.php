<?php

require_once("DB.php");

class Item{
    public $UID,$Uname,$Note,$Lng,$Lat,$Alt,$Time;
    function __construct($UID,$Uname,$Note,$Longitude,$Latitude,$Altitude,$Time){
        $this->UID = $UID;
        $this->Uname = $Uname;
        $this->Note = $Note;
        $this->Lng = $Longitude;
        $this->Lat = $Latitude;
        $this->Alt = $Altitude;
        $this->Time = $Time;
    }

    function show_data(){
        echo "<UID>$this->UID</UID>";
        echo "<Uname>$this->Uname</Uname>";
        echo "<Note>$this->Note</Note>";
        echo "<Longitude>$this->Lng</Longitude>";
        echo "<Latitude>$this->Lat</Latitude>";
        echo "<Altitude>$this->Alt</Altitude>";
        echo "<Time>$this->Time</Time>";        
    }
}

class Reply{
    public $UID,$Uname,$Content,$Time;
    function __construct($UID,$Uname,$Content,$Time){
        $this->UID = $UID;
        $this->Uname = $Uname;
        $this->Note = $Content;
        $this->Time = $Time;
    }
}


class SpaceNote{
    private $db;
    private $dataBuf = array();

    function __construct()
    {
        $this->db  = new DB();
    }

    function getdistance($lng1,$lat1,$lng2,$lat2){
        //将角度转为狐度
        $radLat1=deg2rad($lat1);//deg2rad()函数将角度转换为弧度
        $radLat2=deg2rad($lat2);
        $radLng1=deg2rad($lng1);
        $radLng2=deg2rad($lng2);
        $a=$radLat1-$radLat2;
        $b=$radLng1-$radLng2;
        $s=2*asin(sqrt(pow(sin($a/2),2)+cos($radLat1)*cos($radLat2)*pow(sin($b/2),2)))*6378.137*1000;
        return $s;
    }

    function loadData($lngFrom,$lngTo,$latFrom,$latTo,$select){
        global $dataBuf;
        $today=date("Y-m-d");
        $select_date = date("Y-m-d",strtotime($today." ".$select." day"));
        $sql = "SELECT * FROM `spaceNoteData_demo` 
        WHERE Longitude > $lngFrom and Longitude <= $lngTo and Latitude > $latFrom and Latitude <= $latTo and Time LIKE '".$select_date."%';";
        //echo $sql;
        //根据经纬度筛选数据
        $result = mysqli_query($this->db->conn,$sql);
        if($result == null){
            echo "error:".mysqli_error($this->db->conn)."<br>";
        }
        //echo var_dump($result);
        $i = 0;
        while($row = mysqli_fetch_array($result))
        {
            //$temp = new Item($row['UID'],$row['Uname'],$row['Note'],$row['Longitude'],$row['Latitude'],$row['Altitude'],$row['Time']);
            //先将结果放入一维数组中
            $temp["UID"] = $row['UID'];
            $temp["Uname"] = $row['Uname'];
            $temp["Note"] = $row['Note'];
            $temp["Lng"] = $row['Longitude'];
            $temp["Lat"] = $row['Latitude'];
            $temp["Alt"] = $row['Altitude'];
            $temp["Time"] = $row['Time'];
            //放入二维数组dataBuf中
            $dataBuf[$i++] = $temp;
//           echo "dataBuf:";
        //    echo var_dump($dataBuf);
        }
        
        //输出json格式字符串
        echo json_encode($dataBuf);        

        mysqli_free_result($result);
    }

    function saveData($item){
        $sql = "INSERT INTO `spaceNoteData_demo`(`UID`,`Uname`,`Note`,`Longitude`,`Latitude`,`Time`,`Altitude`) 
        VALUES ('".$item->UID."','".$item->Uname."','".$item->Note."','".$item->Lng."','".$item->Lat."','".$item->Time."','".$item->Alt."');";
        
        // echo var_dump($this->db->conn);
        $result = mysqli_query($this->db->conn,$sql);
        
        if(!$result){
            echo "Data save fail:".mysqli_error($this->db->conn);
        }else{
            echo "Data save successfully!!!";
        }
    }

    function saveReply($reply){
        //查询是否有该表
        $sql = "SELECT table_name FROM information_schema.TABLES WHERE table_name =`SN_reply_".$reply->ID."`;";
        $result = mysqli_query($this->db->conn,$sql);
        if(!$result) {
            //回复楼层不存在，创建新表
            $sql = "CREATE TABLE `SN_reply_".$reply->ID."` 
            ( 
                `ID` INT NOT NULL , 
                `UID` CHAR(7) NULL DEFAULT NULL , 
                `Uname` TINYTEXT NULL DEFAULT NULL , 
                `Content` TEXT NULL DEFAULT NULL , 
                `Time` TIMESTAMP NULL DEFAULT NULL , 
                UNIQUE `ID` (`ID`)
            ) ENGINE = InnoDB;";
        }

        $sql = "INSERT INTO `SN_reply_".$reply->ID."`(`UID`,`Uname`,`Content`,`Time`) 
        VALUES ('".$item->UID."','".$item->Uname."','".$item->Content."','".$item->Time."');";
        $result = mysqli_query($this->db->conn,$sql);
        
        if(!$result){
            echo "Data save fail:".mysqli_error($this->db->conn);
        }else{
            echo "Data save successfully!!!";
        }

    }

    function loadReply($replyID){
        $dataBuf = array();
        $sql = "SELECT * FROM `SN_reply_".$replyID.";";

        $result = mysqli_query($this->db->conn,$sql);
        if($result == null){
            echo "error:".mysqli_error($this->db->conn)."<br>";
        }

        $i = 0;
        while($row = mysqli_fetch_array($result))
        {
            //先将结果放入一维数组中
            $temp["UID"] = $row['UID'];
            $temp["Uname"] = $row['Uname'];
            $temp["Content"] = $row['Content'];
            $temp["Time"] = $row['Time'];
            //放入二维数组dataBuf中
            $dataBuf[$i++] = $temp;
        }
        
        //输出json格式字符串
        echo json_encode($dataBuf);        

        mysqli_free_result($result);
    }

    function __destruct()
    {
        //mysqli_close($this->db->conn);
    }
}
?>