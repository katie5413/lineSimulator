<?php
session_start();
include('../pdoInc.php');
if (isset($_SESSION['roomID'])) {
    $roomID = $_SESSION['roomID'];
    // getMembers
    $findRoomMember = $dbh->prepare('SELECT * FROM member WHERE roomID = ? ORDER BY id ASC');
    $findRoomMember->execute(array($roomID));

    $roomMemberNumber = 0;
    $members = array();
    while ($memberItem = $findRoomMember->fetch(PDO::FETCH_ASSOC)) {

        $person = array();
        $person = array("id" => $memberItem['id'], "name" => $memberItem['name'], "img" => $memberItem['img']);

        array_push($members, $person);
        $roomMemberNumber++;
    }

    // 更新資料
    $_SESSION['roomMemberNumber'] = $roomMemberNumber;
    $_SESSION['roomMember'] = $members;
    echo json_encode($members);
} else {
    echo null;
}
