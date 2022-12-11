import { useState } from "react";

const Downloader = ({ handleDownload, file, url }) => {
    const [progress, setProgress] = useState(false);
    const [isQueued, setIsQueued] = useState(false);

    const processText = () => {
        if (isQueued && !progress) {
            return { text: "Download Queued", bgColor: 'bg-yellow-500' }
        } else {
            if (progress) {
                return { text: "Downloading..", bgColor: 'bg-green-500' }
            } else {
                return { text: `Download ${file}`, bgColor: 'bg-blue-400' }
            }
        }
    }

    const isDisabled = () => {
        if (progress) return true;
        if (isQueued) return true;
    }

    return <div>
        <button
            className={`${processText().bgColor} py-2 px-5 rounded `}
            disabled={isDisabled()}
            onClick={() => handleDownload(url, file, setProgress, setIsQueued)}>{
                processText().text
            } </button>

    </div>
}
export default Downloader;