<?php
session_start();
include('../pdoInc.php');

$newMemberData = array();
$newMemberData = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['name']) && isset($_POST['img']) && isset($_POST['roomID'])) {
    $roomID = $_POST['roomID'];
    // 有 id 就是 update
    if (isset($_POST['id'])) {
        $updateMember = $dbh->prepare('UPDATE member SET  name=?,img = ? WHERE id=? AND roomID=?');
        $updateMember->execute(array($_POST['name'], $_POST['img'], $_POST['id'], $roomID));
    } else {
        $addMember = $dbh->prepare('INSERT INTO member (roomID, name, img ) VALUES (?, ?, ?)');
        $addMember->execute(array($roomID, $_POST['name'], $_POST['img']));
    }

    $newMemberData = array("status" => "success", "name" => $_POST['name']);

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

    $newMemberData = array("status" => "success", "name" => $_POST['name'], "member" => $members);


    // 更新資料
    $_SESSION['roomMemberNumber'] = $roomMemberNumber;
    $_SESSION['roomMember'] = $members;
}

echo json_encode($newMemberData);
