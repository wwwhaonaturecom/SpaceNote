<?php
require_once("spaceNote.php");

$SN = new spaceNote();
$Time = date("Y-m-d H:s:i");

if($_SERVER['REQUEST_METHOD']=='POST'){
    $reply = new Reply($_POST['replyID'],$_POST['UID'],$_POST['Uname'],$_POST['Note'],$Time);
    
    $SN->saveReply($reply);
}

?>