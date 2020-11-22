import { useState, useEffect, Suspense } from "react";
import {
  useFirestore,
  useFirestoreCollectionData,
  useStorageDownloadURL,
  useStorage,
} from "reactfire";
import firebase from "firebase";

const ViewStories = () => {
  const ref = useFirestore().collection("stories").orderBy("createdAt", "desc");

  const data = useFirestoreCollectionData(ref);

  const flexStyle = { display: "flex", flexDirection: "row" };
  const marginStyle = {
    marginLeft: "20px",
    marginRight: "20px",
    marginTop: "30px",
  };

  return (
    <>
      {" "}
      <div>Published Stories</div>
      <div style={{ ...flexStyle, ...marginStyle }}>
        <Stories stories={data} />
      </div>
    </>
  );
};

const Stories = ({ stories }) => {
  return stories.map((story) => {
    return <StoryComponent story={story} key={story.name} />;
  });
};

const StoryComponent = ({ story }) => {
  const styles = {
    cursor: "pointer",
    width: "200px",
    marginLeft: "10px",
    marginRight: "10px",
  };
  let [isShowing, setIsShowing] = useState(false);
  const handeClick = () => {
    setIsShowing(!isShowing);
  };

  if (isShowing) {
    return (
      <>
        <button className="button is-primary" onClick={handeClick}>
          Close
        </button>
        <Suspense fallback={<p>Loading story from {story.user.name}</p>}>
          <StoryViewer story={story} />
        </Suspense>
      </>
    );
  }

  return (
    <div style={styles} key={story.name} onClick={handeClick}>
      <p>{story.createdAt.toDate().toLocaleString()}</p>
      <div>
        <img
          src={story.user.photo}
          width="50"
          height="50"
          style={{ borderRadius: "50%" }}
        />
        <p>Published By: {story.user.name}</p>
      </div>
    </div>
  );
};

const StoryViewer = ({ story }) => {
  const ref = useStorage().ref(`stories/${story.name}`);

  let url = useStorageDownloadURL(ref);
  let firestoreStory = useFirestore().collection("stories").doc(story.name);

  useEffect(() => {
    firestoreStory.update({
      views: firebase.firestore.FieldValue.increment(1),
    });
  }, []);

  return <video src={url} controls autoPlay />;
};

export default ViewStories;
