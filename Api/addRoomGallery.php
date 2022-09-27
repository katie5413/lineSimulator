<?php
session_start();
include('../pdoInc.php');

$res = array();
$res = array("status" => "404");

// 檢查是否有代碼
if (isset($_POST['name']) && isset($_POST['img'])) {

    // 有 id 就是 update
    if (isset($_POST['id'])) {
        $updateGallery = $dbh->prepare('UPDATE gallery SET name=?,img = ? WHERE id=? AND roomID=?');
        $updateGallery->execute(array($_POST['name'], $_POST['img'], $_POST['id'], $_SESSION['roomOwner']));
    } else {
        $addGallery = $dbh->prepare('INSERT INTO gallery (roomID, name, img ) VALUES (?, ?, ?)');
        $addGallery->execute(array($_SESSION['roomOwner'], $_POST['name'], $_POST['img']));
    }

    $res = array("status" => "success", "name" => $_POST['name']);

    // getGallery
    $findRoomGallery = $dbh->prepare('SELECT * FROM gallery WHERE roomID = ? ORDER BY id ASC');
    $findRoomGallery->execute(array($_SESSION['roomOwner']));

    $images = array();
    while ($galleryItem = $findRoomGallery->fetch(PDO::FETCH_ASSOC)) {

        $image = array();
        $image = array("id" => $galleryItem['id'], "name" => $galleryItem['name'], "img" => $galleryItem['img']);

        array_push($images, $image);
    }

    $res = array("status" => "success", "name" => $_POST['name'], "gallery" => $images);


    // 更新資料
    $_SESSION['roomGallery'] = $images;
}

echo json_encode($res);
