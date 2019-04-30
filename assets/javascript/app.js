
var config = {
    apiKey: "AIzaSyCkJlwk04g-7pUvpBl2nPLcqfFr2zj0Qko",
    authDomain: "trainscheduler-dc12d.firebaseapp.com",
    databaseURL: "https://trainscheduler-dc12d.firebaseio.com",
    projectId: "trainscheduler-dc12d",
    storageBucket: "trainscheduler-dc12d.appspot.com",
    messagingSenderId: "1094812016111"
};

firebase.initializeApp(config);

var dataRef = firebase.database();

// Initial Values
var name = "";
var distination = "";
var time = 0;
var frequency = "";

// Capture Button Click
$("#add-entry").on("click", function (event) {
    event.preventDefault();

    name = $("#name-input").val().trim();
    distination = $("#destination-input").val().trim();
    time = $("#timeinput").val();
    frequency = $("#frequency-input").val().trim();
    console.log(name);
    console.log(distination);
    console.log(time);
    console.log(frequency);
    // Code for the push
    dataRef.ref().push({

        name: name,
        distination: distination,
        time: time,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    document.getElementById("input-form").reset();
    document.getElementById("add-entry").disabled = true;
});

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
dataRef.ref().on("child_added", function (childSnapshot) {

    // Store everything into a variable.
    var entryName = childSnapshot.val().name;
    var entryDistination = childSnapshot.val().distination;
    var entryTime = childSnapshot.val().time;
    var entryFrequency = childSnapshot.val().frequency;
    var nextTrain;
    var now = moment.utc().toDate();
    now2 = moment(now).add(entryFrequency, 'minutes').format("HH:mm");
    now1 = moment(now).format("HH:mm");


    nextTrain = moment(entryTime, "HH:mm");
    console.log(nextTrain);
    var now3 = nextTrain.add(entryFrequency, 'minutes');
    // var now3 = moment(entryTime2).add(entryFrequency, 'mm');


    var fEntryTime = moment(entryTime, "HH:mm").format("HH:mm");
    console.log(fEntryTime);
    while (fEntryTime < now1) {
        nextTrain = nextTrain.add(entryFrequency, 'minutes');
        fEntryTime = moment(nextTrain, "HH:mm").format("HH:mm");
    }

    //calcaulte the time in minutes until the next train
    var mins = moment(moment(fEntryTime, "HH:mm").diff(moment(now1, "HH:mm"))).format("mm");

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(entryName),
        $("<td>").text(entryDistination),
        $("<td>").text(entryFrequency),
        $("<td>").text(fEntryTime),
        $("<td>").text(mins)
    );

    // Append the new row to the table
    $("#employee-table > tbody").append(newRow);
});


//validate the time entry is military to enable submit button
var isValidEmail = timeinput.checkValidity();
console.log(isValidEmail);
timeinput.addEventListener('keyup', function (event) {
    isValidEmail = timeinput.checkValidity();
    console.log(isValidEmail);
    if (isValidEmail) {
        $('#add-entry').removeAttr('disabled');
    } else {
        $('#add-entry').attr('disabled', 'disabled');
    }
});