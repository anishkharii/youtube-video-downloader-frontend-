import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Volume2, VolumeX } from "lucide-react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const effectHasRunRef = useRef(false);

  useEffect(()=>{
    if(!effectHasRunRef.current){
      axios.get("https://youtube-video-downloader-backend-hw3w.onrender.com").then((res)=>{
      console.log(res.data);
    })

    effectHasRunRef.current = true
    }
    
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const videoData = await axios.post("https://youtube-video-downloader-backend-hw3w.onrender.com/download", {
        url: url,
      });
      setData(videoData.data);
    }
    catch(err){
      setShowWarning(true)
    }
    finally{
      setLoading(false);
    } 
  };

  return (
    <div className="App">
      {loading && <div className="loader"></div>}
      <div className="header">
        <h2>YouTube Video Downloader</h2>
        <p>created by Anish Khari</p>
      </div>
      <form className="app-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          placeholder="Enter URL"
          onChange={(e) => {setUrl(e.target.value);setShowWarning(false)}}
        />
        {showWarning===true && <p className="warning">Link is not valid.</p>}
        <button type="submit">Download</button>
      </form>

      {data.url &&
      <div className="video">
        <iframe
          src={data.url}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoading(false)}
        ></iframe>

        {data.info && (
          <table>
            <thead>
              <tr>
                <th>Quality</th>
                <th>Size</th>
                <th>Type</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {data.info
                .filter((item) => item.contentLength)
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.qualityLabel}</td>
                    <td>{`${Math.floor(
                      parseFloat(item.contentLength) / (1024 * 1024)
                    )} MB`}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <span>{item.mimeType.split(";")[0].trim()}</span>
                        {item.hasAudio? <Volume2 style={{ margin: "10px" }} /> : <VolumeX style={{ margin: "10px" }}/>}
                      </div>
                    </td>
                    <td>
                      <a target="_blank" href={item.url}>
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
      }
    </div>
  );
}

export default App;
