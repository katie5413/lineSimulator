<?php
session_start();
include('../pdoInc.php');

$roomQuestionData = array();
$roomQuestionData = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['content']) && isset($_POST['roomID'])) {
    $roomID = $_POST['roomID'];

    $updateRoomQuestion = $dbh->prepare('UPDATE question SET content=? WHERE roomID=?');
    $updateRoomQuestion->execute(array($_POST['content'], $roomID));

    $roomQuestionData = array("status" => "success", "roomQuestion" => $_POST['content'], 'roomOwner' => $roomID);
}

echo json_encode($roomQuestionData);
