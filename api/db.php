<?php

$host = "localhost";
$user = "root";
$password = "";
$database = "academic_system";

$conn = new mysqli($host, $user, $password, $database,3307);

if ($conn->connect_error)
{
    die("Database Connection Failed: " . $conn->connect_error);
}

?>
