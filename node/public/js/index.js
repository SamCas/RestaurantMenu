function loadStudents() {
    let url = '/api/students';
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
            displayStudents(response);
        }
    });
}

function displayStudents(students) {
    $.each(students, function (indexInArray, student) { 
         $('#listStudents').append(
             '<div class ="student">' +
                '<li>' + student.matricula + '</li>' +
                '<li>' + student.nombre + '</li>' +
                '<li>' + student.apellido + '</li>' +
             '</div>'
         );
    });
}

function init() {
    loadStudents();
}

init();