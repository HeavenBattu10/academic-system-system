<?php

include "db.php";

$action = $_GET["action"] ?? "";

/* FETCH STUDENTS */
if ($action === "fetch")
{
    $result = $conn->query("SELECT * FROM students ORDER BY id DESC");
    $data = [];

    while ($row = $result->fetch_assoc())
    {
        $data[] = $row;
    }

    echo json_encode($data);
}

/* ADD STUDENT */
if ($action === "add")
{
    $input = json_decode(file_get_contents("php://input"), true);

    $name = $input["name"];
    $roll = $input["roll"];
    $course = $input["course"];
    $marks = $input["marks"];
    $attendance = $input["attendance"];

    $stmt = $conn->prepare(
        "INSERT INTO students (name, roll, course, marks, attendance)
         VALUES (?, ?, ?, ?, ?)"
    );

    $stmt->bind_param("sssds", $name, $roll, $course, $marks, $attendance);
    $stmt->execute();

    echo json_encode(["status" => "success"]);
}

/* DELETE STUDENT */
if ($action === "delete")
{
    $id = intval($_GET["id"]);

    $stmt = $conn->prepare("DELETE FROM students WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    echo json_encode(["status" => "deleted"]);
}

/* UPDATE STUDENT / ATTENDANCE */
if ($action === "update")
{
    $input = json_decode(file_get_contents("php://input"), true);

    $id = $input["id"];

    if (isset($input["attendance"]))
    {
        $attendance = $input["attendance"];

        $stmt = $conn->prepare(
            "UPDATE students SET attendance = ? WHERE id = ?"
        );
        $stmt->bind_param("si", $attendance, $id);
        $stmt->execute();
    }
    else
    {
        $name = $input["name"];
        $roll = $input["roll"];
        $course = $input["course"];
        $marks = $input["marks"];
        $attendance = $input["attendance"];

        $stmt = $conn->prepare(
            "UPDATE students
             SET name = ?, roll = ?, course = ?, marks = ?, attendance = ?
             WHERE id = ?"
        );

        $stmt->bind_param(
            "sssdsi",
            $name,
            $roll,
            $course,
            $marks,
            $attendance,
            $id
        );

        $stmt->execute();
    }

    echo json_encode(["status" => "updated"]);
}

?>
