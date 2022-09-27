<?php
session_start();
include('../pdoInc.php');
if (isset($_SESSION['roomID'])) {
    // getGallery
    $findRoomGallery = $dbh->prepare('SELECT * FROM gallery WHERE roomID = ? ORDER BY id ASC');
    $findRoomGallery->execute(array($_SESSION['roomID']));

    $images = array();
    while ($galleryItem = $findRoomGallery->fetch(PDO::FETCH_ASSOC)) {

        $image = array();
        $image = array("id" => $galleryItem['id'], "name" => $galleryItem['name'], "img" => $galleryItem['img']);

        array_push($images, $image);
    }

    // 更新資料
    $_SESSION['roomGallery'] = $images;
    echo json_encode($images);
} else {
    echo null;
}
