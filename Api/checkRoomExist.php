<?php
session_start();
include('../pdoInc.php');

$res = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['roomID'])) {

    // 先確認是否重複
    $findRoom = $dbh->prepare('SELECT id FROM room WHERE roomID = ?');
    $findRoom->execute(array($_POST['roomID']));
    $roomItem = $findRoom->fetch(PDO::FETCH_ASSOC);
    if ($findRoom->rowCount() != 0) {
        $res = array("status" => "exist");
    }
}

echo json_encode($res);
