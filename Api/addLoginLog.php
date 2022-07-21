<?php
session_start();
include('../pdoInc.php');

$logData = array();
$logData = array("status" => "404");

// 檢查是否有代碼
if (isset($_SESSION['roomID'])) {

    $addLog = $dbh->prepare('INSERT INTO loginLog (roomID, time) VALUES (?, ?)');
    $addLog->execute(array($_SESSION['roomID'], date("Y/m/d H:i:s")));


    $logData = array("status" => "success", 'roomID' => $_SESSION['roomID'], 'time'=> date("Y/m/d H:i:s"));
}

echo json_encode($logData);
