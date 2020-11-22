import { useState } from "react";
import { useStorage, useFirestore, useUser } from "reactfire";
import firebase from "firebase";
import { v4 as uuid } from "uuid";

const UploadFile = ({ url }) => {
  const [progress, changeProgress] = useState(0);
  const [done, setDone] = useState(false);
  const storage = useStorage();
  const firestore = useFirestore();
  const user = useUser();

  const uploadToFirebase = async () => {
    let id = uuid();

    let res = await fetch(url);
    let blob = await res.blob();

    let uploading = storage.ref(`/stories/${id}`).put(blob);

    uploading.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        changeProgress(progress);
        console.log("Upload is " + progress + "% done");
      },
      () => {},
      () => {
        firestore
          .collection("stories")
          .doc(id)
          .set({
            name: id,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            user: {
              name: user.displayName,
              photo: user.photoURL,
              id: user.uid,
            },

            views: 0,
          })
          .then(() => {
            setDone(true);
          });
      }
    );
  };

  if (progress === 0) {
    return <button onClick={uploadToFirebase}>Upload</button>;
  } else {
    if (done) {
      return <div>Done uploading</div>;
    }

    return <div>{progress}</div>;
  }
};

export default UploadFile;
