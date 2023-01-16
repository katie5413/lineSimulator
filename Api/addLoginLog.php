<?php
session_start();
include('../pdoInc.php');

$logData = array();
$logData = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['roomID'])) {
    $roomID = $_POST['roomID'];

    $addLog = $dbh->prepare('INSERT INTO loginLog (roomID, time) VALUES (?, ?)');
    $addLog->execute(array($roomID, date("Y/m/d H:i:s")));


    $logData = array("status" => "success", 'roomID' => $roomID, 'time' => date("Y/m/d H:i:s"));
}

echo json_encode($logData);
