<?php
session_start();
include('../pdoInc.php');


if (isset($_SESSION['roomID'])) {
    // getroomQuestionData
    $findRoomQuestion = $dbh->prepare('SELECT content FROM question WHERE roomID = ? ');
    $findRoomQuestion->execute(array($_SESSION['roomID']));

    if ($questionItem = $findRoomQuestion->fetch(PDO::FETCH_ASSOC)) {
        $_SESSION['roomQuestion'] = $questionItem['content'];
    }
    echo json_encode($_SESSION['roomQuestion']);
} else {
    echo null;
}
