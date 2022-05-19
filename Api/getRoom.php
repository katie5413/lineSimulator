<?php
session_start();
include('../pdoInc.php');
$roomData = array();
$roomData = array("status" => '404');
if (isset($_POST['roomID'])) {

    // getRoomInfo
    $findRoom = $dbh->prepare('SELECT roomID, roomName FROM room WHERE roomID = ?');
    $findRoom->execute(array($_POST['roomID']));
    if ($roomItem = $findRoom->fetch(PDO::FETCH_ASSOC)) {

        $roomData = array("status" => 'success', "roomName" => $roomItem['roomName']);

        // getMembers
        $findRoomMember = $dbh->prepare('SELECT * FROM member WHERE roomID = ? ORDER BY id ASC');
        $findRoomMember->execute(array($_POST['roomID']));

        $roomMemberNumber = 0;
        $members = array();
        while ($memberItem = $findRoomMember->fetch(PDO::FETCH_ASSOC)) {

            $person = array();
            $person = array("id" => $memberItem['id'], "name" => $memberItem['name'], "img" => $memberItem['img']);

            array_push($members, $person);
            $roomMemberNumber++;
        }

        $roomData = array("status" => 'success', "roomName" => $roomItem['roomName'], "roomMember" => $members);


        // getRoomInfo
        $findRoomMsg = $dbh->prepare('SELECT roomID, mainPersonID, content FROM message WHERE roomID = ?');
        $findRoomMsg->execute(array($_POST['roomID']));
        if ($msgItem = $findRoomMsg->fetch(PDO::FETCH_ASSOC)) {
            $_SESSION['roomMsg'] = $msgItem['content'];
            $_SESSION['roomMainPersonID'] = $msgItem['mainPersonID'];
        }

        $roomData = array("status" => 'success', "roomName" => $roomItem['roomName'], "roomMember" => $members, "roomMsg" => $msgItem['content'], "roomMainPersonID" => $msgItem['mainPersonID']);


        // getRoomQuestion
        $findRoomQuestion = $dbh->prepare('SELECT content FROM question WHERE roomID = ? ');
        $findRoomQuestion->execute(array($_SESSION['roomID']));

        if ($questionItem = $findRoomQuestion->fetch(PDO::FETCH_ASSOC)) {
            $_SESSION['roomQuestion'] = $questionItem['content'];
        }

        $roomData = array("status" => 'success', "roomName" => $roomItem['roomName'], "roomMember" => $members, "roomMsg" => $msgItem['content'], "roomMainPersonID" => $msgItem['mainPersonID'], "roomQuestion" => $questionItem['content']);

        // 有找到才會放到 SESSION
        $_SESSION['roomID'] = $_POST['roomID'];
        $_SESSION['roomName'] = $roomItem['roomName'];
        $_SESSION['roomMemberNumber'] = $roomMemberNumber;
        $_SESSION['roomMember'] = $members;
        echo json_encode($roomData);
    } else {
        echo json_encode($roomData);
    }
} else {
    echo json_encode($roomData);
}
