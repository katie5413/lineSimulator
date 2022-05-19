<?php
session_start();
include('../pdoInc.php');

$newMemberData = array();
$newMemberData = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['id']) && isset($_SESSION['roomOwner'])) {

    $deleteMember = $dbh->prepare('DELETE FROM member WHERE id=? and roomID=?');
    $deleteMember->execute(array($_POST['id'], $_SESSION['roomOwner']));


    $newMemberData = array("status" => "success", "id" => $_POST['id']);

    // getMembers
    $findRoomMember = $dbh->prepare('SELECT * FROM member WHERE roomID = ? ORDER BY id ASC');
    $findRoomMember->execute(array($_SESSION['roomOwner']));

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
}

echo json_encode($newMemberData);
