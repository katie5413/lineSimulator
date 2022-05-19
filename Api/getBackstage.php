<?php
session_start();
include('../pdoInc.php');
$roomData = array();
$roomData = array("status" => '404');
if (isset($_POST['code']) && isset($_POST['password'])) {
    // getRoomInfo
    $findRoom = $dbh->prepare('SELECT * FROM room WHERE roomID = ?');
    $findRoom->execute(array($_POST['code']));
    if ($roomItem = $findRoom->fetch(PDO::FETCH_ASSOC)) {

        // getMembers
        $findRoomMember = $dbh->prepare('SELECT * FROM member WHERE roomID = ? ORDER BY id ASC');
        $findRoomMember->execute(array($_POST['code']));

        $roomMemberNumber = 0;
        $members = array();
        while ($memberItem = $findRoomMember->fetch(PDO::FETCH_ASSOC)) {

            $person = array();
            $person = array("id" => $memberItem['id'], "name" => $memberItem['name'], "img" => $memberItem['img']);

            array_push($members, $person);
            $roomMemberNumber++;
        }

        // getRoomInfo
        $findRoomMsg = $dbh->prepare('SELECT roomID, mainPersonID, content FROM message WHERE roomID = ?');
        $findRoomMsg->execute(array($_POST['code']));
        if ($msgItem = $findRoomMsg->fetch(PDO::FETCH_ASSOC)) {
            $_SESSION['roomMsg'] = $msgItem['content'];
            $_SESSION['roomMainPersonID'] = $msgItem['mainPersonID'];
        }

        // 有找到才會放到 SESSION
        $_SESSION['roomID'] = $_POST['code'];
        $_SESSION['roomName'] = $roomItem['roomName'];
        $_SESSION['roomMemberNumber'] = $roomMemberNumber;
        $_SESSION['roomMember'] = $members;

        // check owner
        $password = hash('sha256', $_POST['password']);
        if ($roomItem['roomPassword'] == $password) {
            $_SESSION['roomOwner'] = $_POST['code'];
            $roomData = array("status" => 'backstage', "roomName" => $roomItem['roomName']);
        } else {
            $roomData = array("status" => 'wrongPass', "roomName" => $roomItem['roomName']);
        }
    }
}

echo json_encode($roomData);
