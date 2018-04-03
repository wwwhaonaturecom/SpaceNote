<?php
require_once("spaceNote.php");

$SN = new spaceNote();
// $Longitude=121.209;
// $Latitude=31.2895;
// $Range=1;
// $Select=0;

// $SN->loadData($Longitude-$Range, $Longitude+$Range, $Latitude-$Range, $Latitude+$Range, $Select);
if($_SERVER['REQUEST_METHOD']=='GET'){
   $SN->loadData($_GET['Longitude']-$_GET['Range'],$_GET['Longitude']+$_GET['Range'],$_GET['Latitude']-$_GET['Range'],$_GET['Latitude']+$_GET['Range'],$_GET['Select']);
}

?>