<?php
session_start();
include('../pdoInc.php');


if (isset($_POST['roomID'])) {
    $roomID = $_POST['roomID'];
    $message = array();

    // getRoomInfo
    $findRoomMsg = $dbh->prepare('SELECT roomID, content FROM message WHERE roomID = ?');
    $findRoomMsg->execute(array($roomID));
    if ($msgItem = $findRoomMsg->fetch(PDO::FETCH_ASSOC)) {
        $message = $msgItem['content'];
    }

    // 更新資料
    $_SESSION['roomMsg'] = $message;

    echo json_encode($message);
}
