<?php
/* 20230505 改成進去房間才拿資料，節省載入時間，暫時不會用到這支 */

session_start();
include('../pdoInc.php');
$roomData = array();
$roomData = array("status" => '404');
if (isset($_POST['roomID'])) {

    // getRoomInfo
    $findRoom = $dbh->prepare('SELECT roomID, roomName FROM room WHERE roomID = ?');
    $findRoom->execute(array($_POST['roomID']));
    if ($roomItem = $findRoom->fetch(PDO::FETCH_ASSOC)) {

        // getImage
        $findRoomImage = $dbh->prepare('SELECT * FROM gallery WHERE roomID = ? ORDER BY id ASC');
        $findRoomImage->execute(array($_SESSION['roomID']));

        $images = array();
        while ($galleryItem = $findRoomImage->fetch(PDO::FETCH_ASSOC)) {

            $image = array();
            $image = array("id" => $galleryItem["id"], "name" => $galleryItem['name'], "img" => $galleryItem['img']);

            array_push($images, $image);
        }

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

        // getRoomInfo
        $findRoomMsg = $dbh->prepare('SELECT roomID, mainPersonID, content FROM message WHERE roomID = ?');
        $findRoomMsg->execute(array($_POST['roomID']));
        if ($msgItem = $findRoomMsg->fetch(PDO::FETCH_ASSOC)) {
            $_SESSION['roomMsg'] = $msgItem['content'];
            $_SESSION['roomMainPersonID'] = $msgItem['mainPersonID'];
        }

        // getRoomQuestion
        $findRoomQuestion = $dbh->prepare('SELECT content FROM question WHERE roomID = ? ');
        $findRoomQuestion->execute(array($_POST['roomID']));

        if ($questionItem = $findRoomQuestion->fetch(PDO::FETCH_ASSOC)) {
            $_SESSION['roomQuestion'] = $questionItem['content'];
        }

        $roomData = array("status" => 'success', "roomName" => $roomItem['roomName'], "roomImage" => $images, "roomMember" => $members, "roomMsg" => $msgItem['content'], "roomMainPersonID" => $msgItem['mainPersonID'], "roomQuestion" => $questionItem['content']);

        // 有找到才會放到 SESSION
        $_SESSION['roomID'] = $_POST['roomID'];
        $_SESSION['roomName'] = $roomItem['roomName'];
        $_SESSION['roomMemberNumber'] = $roomMemberNumber;
        $_SESSION['roomMember'] = $members;
        $_SESSION['roomImage'] = $images;

        echo json_encode($roomData);
    } else {
        echo json_encode($roomData);
    }
} else {
    echo json_encode($roomData);
}
