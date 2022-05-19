<?php
session_start();
include('../pdoInc.php');

$roomData = array();
$roomData = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['personID']) && isset($_SESSION['roomOwner'])) {

    $updateRoom = $dbh->prepare('UPDATE message SET mainPersonID=? WHERE roomID=?');
    $updateRoom->execute(array($_POST['personID'], $_SESSION['roomOwner']));

    // 更新資料
    $_SESSION['roomMainPersonID'] = $_POST['personID'];

    $roomData = array("status" => "success", "personID" => $_POST['personID']);
}

echo json_encode($roomData);
