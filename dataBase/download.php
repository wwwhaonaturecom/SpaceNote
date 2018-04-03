<?php
require_once("spaceNote.php");

$SN = new spaceNote();

if($_SERVER['REQUEST_METHOD']=='GET'){
    $SN->loadData($_GET['Longitude']-$_GET['Range'],$_GET['Longitude']+$_GET['Range'],$_GET['Latitude']-$_GET['Range'],$_GET['Latitude']+$_GET['Range'],$_GET['Select']);
}

?>