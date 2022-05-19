<?php
session_start();
include('../pdoInc.php');
if (isset($_SESSION['roomMsg'])) {
    echo json_encode($_SESSION['roomMsg']);
} else {
    echo null;
}
