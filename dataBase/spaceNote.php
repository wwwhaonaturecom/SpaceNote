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

    function loadData($lngFrom,$lngTo,$latFrom,$latTo){
        // echo "loadData start<br>";
        global $dataBuf;
        $sql = "SELECT * FROM `spaceNoteData_demo` 
        WHERE Longitude > $lngFrom and Longitude <= $lngTo and Latitude > $latFrom and Latitude <= $latTo;";
        //根据经纬度筛选数据
        $result = mysqli_query($this->db->conn,$sql);
        if($result == null){
            echo "error:".mysqli_error()."<br>";
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

    function __destruct()
    {
        //mysqli_close($this->db->conn);
    }
}
?>