<?php
session_start();
include('../pdoInc.php');

$newGalleryData = array();
$newGalleryData = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['id']) && isset($_SESSION['roomOwner'])) {

    $deleteGallery = $dbh->prepare('DELETE FROM gallery WHERE id=? and roomID=?');
    $deleteGallery->execute(array($_POST['id'], $_SESSION['roomOwner']));


    $newGalleryData = array("status" => "success", "id" => $_POST['id']);

    // getGallery
    $findRoomGallery = $dbh->prepare('SELECT * FROM gallery WHERE roomID = ? ORDER BY id ASC');
    $findRoomGallery->execute(array($_SESSION['roomOwner']));

    $images = array();
    while ($galleryItem = $findRoomGallery->fetch(PDO::FETCH_ASSOC)) {

        $person = array();
        $person = array("id" => $galleryItem['id'], "name" => $galleryItem['name'], "img" => $galleryItem['img']);

        array_push($images, $person);
    }

    // 更新資料
    $_SESSION['roomGallery'] = $images;
}

echo json_encode($newGalleryData);
