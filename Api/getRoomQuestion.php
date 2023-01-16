<?php
session_start();
include('../pdoInc.php');


if (isset($_POST['roomID'])) {
    $roomID = $_POST['roomID'];
    // getRoomQuestionData
    $findRoomQuestion = $dbh->prepare('SELECT content FROM question WHERE roomID = ? ');
    $findRoomQuestion->execute(array($roomID));

    if ($questionItem = $findRoomQuestion->fetch(PDO::FETCH_ASSOC)) {
        $_SESSION['roomQuestion'] = $questionItem['content'];
    }
    echo json_encode($_SESSION['roomQuestion']);
} else {
    echo null;
}
