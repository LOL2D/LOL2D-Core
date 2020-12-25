function initFireBase() {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
        apiKey: "AIzaSyCn2U12L4iH5s65peWz9vmuy-uvms7uW9M",
        authDomain: "lol2d-mapeditor-2.firebaseapp.com",
        databaseURL: "https://lol2d-mapeditor-2-default-rtdb.firebaseio.com",
        projectId: "lol2d-mapeditor-2",
        storageBucket: "lol2d-mapeditor-2.appspot.com",
        messagingSenderId: "838951362664",
        appId: "1:838951362664:web:3591926df1b4b52925dbdd",
        measurementId: "G-L0P3BF88W8",
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
}

function listenToFireBase(ref, dataCallback) {
    let database = firebase.database();

    database.ref(ref).on("value", (snapshot) => {
        const data = snapshot.val();

        dataCallback && dataCallback(data);
    });
}

function removeDataFirebase(ref, id) {
    firebase
        .database()
        .ref(ref + id)
        .remove();
}

function updateDataFirebase(ref, data, onFailed) {
    firebase
        .database()
        .ref(ref + data.id)
        .set(data, (error) => {
            if (error) onFailed && onFailed(error);
        });
}

function generateNewKeyFirebase(ref) {
    var newDataKey = firebase.database().ref().child(ref).push().key;
    return newDataKey;
}
