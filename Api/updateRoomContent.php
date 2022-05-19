<?php
session_start();
include('../pdoInc.php');

$roomContentData = array();
$roomContentData = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['content']) && isset($_SESSION['roomOwner'])) {

    $updateRoomContent = $dbh->prepare('UPDATE message SET content=? WHERE roomID=?');
    $updateRoomContent->execute(array($_POST['content'], $_SESSION['roomOwner']));

    // getRoomInfo
    $findRoomMsg = $dbh->prepare('SELECT mainPersonID, content FROM message WHERE roomID = ?');
    $findRoomMsg->execute(array($_SESSION['roomOwner']));
    if ($msgItem = $findRoomMsg->fetch(PDO::FETCH_ASSOC)) {
        $_SESSION['roomMsg'] = $_POST['content'];
        $_SESSION['roomMainPersonID'] = $msgItem['mainPersonID'];
    }

    $roomContentData = array("status" => "success", "roomMsg" => $_POST['content'], 'roomOwner' => $_SESSION['roomOwner']);
}

echo json_encode($roomContentData);
