<?php
require_once("spaceNote.php");

$SN = new spaceNote();
$Time = date("Y-m-d H:s:i");

if($_SERVER['REQUEST_METHOD']=='POST'){
    $item = new Item($_POST['UID'],$_POST['Uname'],$_POST['Note'],$_POST['Lng'],$_POST['Lat'],$_POST['Alt'],$Time);
    
    $SN->saveData($item);
}

?>