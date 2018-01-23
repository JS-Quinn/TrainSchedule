const config = {
    apiKey: "AIzaSyCD4V19HHIhOUhUE3SUbnTvydApbqp3VN8",
    authDomain: "trainschedule-32451.firebaseapp.com",
    databaseURL: "https://trainschedule-32451.firebaseio.com",
    projectId: "trainschedule-32451",
    storageBucket: "trainschedule-32451.appspot.com",
    messagingSenderId: "189077707866"
  };
  
firebase.initializeApp(config);

const database = firebase.database().ref('trainPush');

$("#submit").on("click", function() {
    event.preventDefault();

    var newTrain = {
        name: $("#name-input").val().trim(),
        destination: $("#destination-input").val().trim(),
        time: moment($("#start-input").val().trim(), "HH:mm").format("X"),
        frequency: $("#frequency-input").val().trim(),
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    database.push(newTrain);
    console.log(newTrain);

    resetInputs();
});

database.on("child_added", function(snapshot) {
    const tFrequency = snapshot.val().frequency;
    const firstTime = snapshot.val().time;

    const firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    const currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    const diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    const tRemainder = diffTime % tFrequency;
    console.log("REMAINDER: " + tRemainder);
    const tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    const nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var tableRow = $("<tr>");
    tableRow.html(
        `<td>${snapshot.val().name}</td>
        <td>${snapshot.val().destination}</td>
        <td>${snapshot.val().frequency}</td>
        <td>${nextTrain}</td>
        <td>${tMinutesTillTrain}</td>`);
    $("#table-body").append(tableRow);
    var tableData = $("<td>");
    tableRow.append(tableData);
});

function resetInputs() {
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
    $("#name-input").focus();
}