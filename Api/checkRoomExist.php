<?php
session_start();
include('../pdoInc.php');

$res = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['roomID'])) {

    // 先確認是否重複
    $findRoom = $dbh->prepare('SELECT roomID, roomName FROM room WHERE roomID = ?');
    $findRoom->execute(array($_POST['roomID']));
    $roomItem = $findRoom->fetch(PDO::FETCH_ASSOC);
    if ($findRoom->rowCount() != 0) {
        // 有找到才會放到 SESSION
        $_SESSION['roomID'] = $_POST['roomID'];
        $_SESSION['roomName'] = $roomItem['roomName'];
        $res = array("status" => "success");
    }
}

echo json_encode($res);
