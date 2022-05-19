<?php
session_start();
include('../pdoInc.php');
if (isset($_SESSION['roomID'])) {
    echo $_SESSION['roomID'];
} else {
    echo null;
}
