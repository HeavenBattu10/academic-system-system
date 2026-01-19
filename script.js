/* ================================
   SECTION NAVIGATION
================================ */
function showSection(sectionId)
{
    document.getElementById("students").className = "hidden-section";
    document.getElementById("faculty").className = "hidden-section";

    document.getElementById(sectionId).className = "active-section";
}

/* ================================
   API ENDPOINTS
================================ */
const studentAPI = "api/students.php";
const facultyAPI = "api/faculty.php";

/* ================================
   STUDENT MODULE
================================ */
let editIndex = null;

const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const search = document.getElementById("search");

const totalCount = document.getElementById("totalCount");
const passCount = document.getElementById("passCount");
const failCount = document.getElementById("failCount");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");

/* Load Students on Start */
fetchStudents();

/* Add / Edit Student */
studentForm.addEventListener("submit", async function (e)
{
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();
    const course = document.getElementById("course").value.trim();
    const marks = parseInt(document.getElementById("marks").value.trim());

    if (!name || !roll || !course || isNaN(marks))
    {
        alert("Please fill all student fields correctly.");
        return;
    }

    const student =
    {
        name: name,
        roll: roll,
        course: course,
        marks: marks,
        attendance: "Present"
    };

    if (editIndex === null)
    {
        await fetch(`${studentAPI}?action=add`,
        {
            method: "POST",
            body: JSON.stringify(student)
        });
    }
    else
    {
        student.id = editIndex;

        await fetch(`${studentAPI}?action=update`,
        {
            method: "POST",
            body: JSON.stringify(student)
        });

        editIndex = null;
        formTitle.innerText = "Add Student";
        submitBtn.innerText = "Add Student";
    }

    studentForm.reset();
    fetchStudents();
});

/* Fetch Students */
async function fetchStudents()
{
    const res = await fetch(`${studentAPI}?action=fetch`);
    const data = await res.json();

    renderStudents(data);
    updateDashboard(data);
}

/* Render Student Table */
function renderStudents(students)
{
    studentTable.innerHTML = "";

    students.forEach(student =>
    {
        const status = student.marks >= 40 ? "Pass" : "Fail";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.roll}</td>
            <td>${student.course}</td>
            <td>${student.marks}</td>
            <td class="${status === "Pass" ? "pass" : "fail"}">${status}</td>
            <td>
                <button class="attendance-btn ${student.attendance === "Present" ? "present" : "absent"}"
                        onclick="toggleAttendance(${student.id}, '${student.attendance}')">
                    ${student.attendance}
                </button>
            </td>
            <td>
                <button onclick="editStudent(${student.id}, '${student.name}', '${student.roll}', '${student.course}', ${student.marks})">
                    Edit
                </button>
                <button onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        `;

        studentTable.appendChild(row);
    });
}

/* Edit Student */
function editStudent(id, name, roll, course, marks)
{
    document.getElementById("name").value = name;
    document.getElementById("roll").value = roll;
    document.getElementById("course").value = course;
    document.getElementById("marks").value = marks;

    editIndex = id;
    formTitle.innerText = "Edit Student";
    submitBtn.innerText = "Update Student";
}

/* Delete Student */
async function deleteStudent(id)
{
    if (confirm("Delete this student record?"))
    {
        await fetch(`${studentAPI}?action=delete&id=${id}`);
        fetchStudents();
    }
}

/* Toggle Attendance */
async function toggleAttendance(id, currentStatus)
{
    const newStatus = currentStatus === "Present" ? "Absent" : "Present";

    await fetch(`${studentAPI}?action=update`,
    {
        method: "POST",
        body: JSON.stringify(
        {
            id: id,
            attendance: newStatus
        })
    });

    fetchStudents();
}

/* Dashboard Summary */
function updateDashboard(students)
{
    totalCount.innerText = students.length;

    let pass = 0;
    let fail = 0;

    students.forEach(student =>
    {
        student.marks >= 40 ? pass++ : fail++;
    });

    passCount.innerText = pass;
    failCount.innerText = fail;
}

/* Search */
search.addEventListener("input", function ()
{
    const value = this.value.toLowerCase();
    const rows = document.querySelectorAll("#studentTable tr");

    rows.forEach(row =>
    {
        row.style.display = row.textContent.toLowerCase().includes(value)
            ? ""
            : "none";
    });
});

/* ================================
   FACULTY MODULE
================================ */
const facultyForm = document.getElementById("facultyForm");
const facultyTable = document.getElementById("facultyTable");

/* Load Faculty on Start */
fetchFaculty();

/* Add Faculty */
facultyForm.addEventListener("submit", async function (e)
{
    e.preventDefault();

    const name = document.getElementById("fname").value.trim();
    const department = document.getElementById("department").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !department || !email)
    {
        alert("Please fill all faculty fields.");
        return;
    }

    const faculty =
    {
        name: name,
        department: department,
        email: email
    };

    await fetch(`${facultyAPI}?action=add`,
    {
        method: "POST",
        body: JSON.stringify(faculty)
    });

    facultyForm.reset();
    fetchFaculty();
});

/* Fetch Faculty */
async function fetchFaculty()
{
    const res = await fetch(`${facultyAPI}?action=fetch`);
    const data = await res.json();

    renderFaculty(data);
}

/* Render Faculty Table */
function renderFaculty(facultyList)
{
    facultyTable.innerHTML = "";

    facultyList.forEach(faculty =>
    {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${faculty.name}</td>
            <td>${faculty.department}</td>
            <td>${faculty.email}</td>
            <td>
                <button onclick="deleteFaculty(${faculty.id})">
                    Delete
                </button>
            </td>
        `;

        facultyTable.appendChild(row);
    });
}

/* Delete Faculty */
async function deleteFaculty(id)
{
    if (confirm("Delete this faculty record?"))
    {
        await fetch(`${facultyAPI}?action=delete&id=${id}`);
        fetchFaculty();
    }
}
