<?php
session_start();
include('../pdoInc.php');

$roomQuestionData = array();
$roomQuestionData = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['content']) && isset($_SESSION['roomOwner'])) {

    $updateRoomQuestion = $dbh->prepare('UPDATE question SET content=? WHERE roomID=?');
    $updateRoomQuestion->execute(array($_POST['content'], $_SESSION['roomOwner']));

    $roomQuestionData = array("status" => "success", "roomQuestion" => $_POST['content'], 'roomOwner' => $_SESSION['roomOwner']);
}

echo json_encode($roomQuestionData);
