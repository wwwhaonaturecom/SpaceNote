<?php
require_once("spaceNote.php");

$SN = new spaceNote();
$Time = date("Y-m-d H:s:i");

if($_SERVER['REQUEST_METHOD']=='POST'){
    $SN->loadReply($_POST['replyID']);
}

?>