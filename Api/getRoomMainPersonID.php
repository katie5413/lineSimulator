<?php
session_start();
include('../pdoInc.php');
if (isset($_SESSION['roomMainPersonID'])) {
    echo $_SESSION['roomMainPersonID'];
} else {
    echo null;
}
