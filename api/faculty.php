<?php

include "db.php";

$action = $_GET["action"] ?? "";

/* FETCH FACULTY */
if ($action === "fetch")
{
    $result = $conn->query("SELECT * FROM faculty ORDER BY id DESC");
    $data = [];

    while ($row = $result->fetch_assoc())
    {
        $data[] = $row;
    }

    echo json_encode($data);
}

/* ADD FACULTY */
if ($action === "add")
{
    $input = json_decode(file_get_contents("php://input"), true);

    $name = $input["name"];
    $department = $input["department"];
    $email = $input["email"];

    $stmt = $conn->prepare(
        "INSERT INTO faculty (name, department, email)
         VALUES (?, ?, ?)"
    );

    $stmt->bind_param("sss", $name, $department, $email);
    $stmt->execute();

    echo json_encode(["status" => "success"]);
}

/* DELETE FACULTY */
if ($action === "delete")
{
    $id = intval($_GET["id"]);

    $stmt = $conn->prepare("DELETE FROM faculty WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    echo json_encode(["status" => "deleted"]);
}

?>
