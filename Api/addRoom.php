<?php
session_start();
include('../pdoInc.php');

$newRoomData = array();
$newRoomData = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['code']) && isset($_POST['newRoomName'])) {

    // 先確認是否重複
    $findRoom = $dbh->prepare('SELECT id FROM room WHERE roomID = ?');
    $findRoom->execute(array($_POST['code']));
    $roomItem = $findRoom->fetch(PDO::FETCH_ASSOC);
    if ($findRoom->rowCount() != 0) {
        $newRoomData = array("status" => "duplicate");
    } else {
        // 開一個新房間
        $password = hash('sha256', $_POST['password']);
        $addRoom = $dbh->prepare('INSERT INTO room (roomID, roomName, roomPassword ) VALUES (?, ?, ?)');
        $addRoom->execute(array($_POST['code'], $_POST['newRoomName'], $password));

        // 順便開一個存對話的 table
        $addRoomMsg = $dbh->prepare('INSERT INTO message (roomID ) VALUES (?)');
        $addRoomMsg->execute(array($_POST['code']));

        // 再順便開一個存問題的 table
        $addRoomQuestion = $dbh->prepare('INSERT INTO question (roomID ) VALUES (?)');
        $addRoomQuestion->execute(array($_POST['code']));

        // // 存到 Session
        $_SESSION['roomID'] = $_POST['code'];
        $_SESSION['roomName'] = $_POST['newRoomName'];
        $_SESSION['roomOwner'] = $_POST['code'];
        $newRoomData = array("status" => "success", "code" => $_POST['code']);
    }
}

echo json_encode($newRoomData);
