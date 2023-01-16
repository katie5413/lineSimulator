<?php
session_start();
include('../pdoInc.php');

if (isset($_POST['roomID'])) {
    $roomID = $_POST['roomID'];
    $mainPersonID = array();

    // getRoomInfo
    $findRoomMsg = $dbh->prepare('SELECT roomID, mainPersonID FROM message WHERE roomID = ?');
    $findRoomMsg->execute(array($roomID));
    if ($msgItem = $findRoomMsg->fetch(PDO::FETCH_ASSOC)) {
        $mainPersonID = $msgItem['mainPersonID'];
    }

    // 更新資料
    $_SESSION['roomMainPersonID'] = $mainPersonID;

    echo $mainPersonID;
}
