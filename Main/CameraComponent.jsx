import Webcam from "react-webcam";
import { useState, useRef, useCallback } from "react";
import UploadFile from "./UploadFile";
import { isChrome } from "react-device-detect";

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  let [url, changeUrl] = useState(null);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    changeUrl(null);

    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    handleDownload();
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      changeUrl(url);

      /*
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      */
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  if (!isChrome) {
    return (
      <>
        <div>Currently this app works only in Chrome</div>
        <div>
          For expert users, this browser does not support{" "}
          <pre>MediaRecorderApi</pre>
        </div>
      </>
    );
  }

  return (
    <>
      {url ? (
        <div>
          <video src={url} />
          <UploadFile url={url} />
          <button
            className="button is-primary"
            onClick={() => {
              changeUrl(null);
            }}
          >
            Record Again
          </button>
        </div>
      ) : (
        <>
          <div>
            <div>
              <Webcam ref={webcamRef} mirrored={true} />
            </div>
            <div style={{ display: "inline" }}>
              <button
                className="button is-primary"
                onMouseDown={handleStartCaptureClick}
                onMouseUp={handleStopCaptureClick}
              >
                {capturing ? "Stop Recording" : "Start Recording"}
              </button>

              {recordedChunks.length > 0 && (
                <button className="button is-primary" onClick={handleDownload}>
                  Show preview
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

/*
<button
        onClick={() => {
          changeAudio(!audio);
        }}
      >
        {audio ? "Audio on" : "Audio off"}
      </button>

*/

export default CameraComponent;
