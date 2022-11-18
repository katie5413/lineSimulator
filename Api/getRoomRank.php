<?php
session_start();
include('../pdoInc.php');

// getRoomRank
$findRoomRank = $dbh->prepare('SELECT loginLog.roomID, room.managerEmail, room.roomName, room.id as createTime, COUNT(*) as times FROM loginLog LEFT JOIN room ON loginLog.roomID = room.roomID GROUP BY room.roomID ORDER BY room.id DESC');
$findRoomRank->execute();

$res = array();
while ($rankItem = $findRoomRank->fetch(PDO::FETCH_ASSOC)) {

    $item = array();
    $item = array("id" => $rankItem['roomID'], "name" => $rankItem['roomName'], "managerEmail" => $rankItem['managerEmail'], "times" => $rankItem['times']);

    array_push($res, $item);
}

echo json_encode($res);
