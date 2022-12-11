import axios from 'axios';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';

// Components;
import Downloader from './components/Downloader';
import StatusTab from './components/StatusTab';

// DummyData
let filesDownload = [{
  id: 1,
  url: 'https://raw.githubusercontent.com/yourkin/fileupload-fastapi/a85a697cab2f887780b3278059a0dd52847d80f3/tests/data/test-10mb.bin',
  fileName: '10mb'
},
{
  id: 2,
  url: 'https://raw.githubusercontent.com/yourkin/fileupload-fastapi/a85a697cab2f887780b3278059a0dd52847d80f3/tests/data/test-5mb.bin',
  fileName: '5mb'
},
{
  id: 3,
  url: 'https://sabnzbd.org/tests/internetspeed/20MB.bin',
  fileName: '20mb'
}]

function App() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [statusCurrent, setStatusCurrent] = useState({});
  const [queue, setQueue] = useState([]);
  const [downloaded, setDownloaded] = useState([]);

  const toggleState = (setStates, bool) => {
    setStates.map(itm => itm(bool))
  }

  const handleDownload = async (url, filename, setProgress, setIsQueued) => {
    toggleState([setProgress, setIsDownloading], true)
    axios.get(url, {
      responseType: 'blob',
    })
      .then((res) => {
        toggleState([setProgress, setIsDownloading, setIsQueued], false)
        setDownloaded(downloaded => { return [...downloaded, { name: filename }] })
        setStatusCurrent({});
        console.log(`Downloading done :`, filename)
        fileDownload(res.data, filename);
      })
  }

  const handleQueueCall = (url, filename, setProgress, setIsQueued) => {
    setIsQueued(true)
    if (!isDownloading) {
      setStatusCurrent({ file: filename })
      return handleDownload(url, filename, setProgress, setIsQueued);
    }
    setQueue(queue => {
      return [...queue, { fun: () => handleDownload(url, filename, setProgress, setIsQueued), name: filename }]
    })
  }

  useEffect(() => {
    if (!isDownloading && queue.length > 0) {
      queue[0].fun();
      setQueue(queue => {
        let arr = queue.splice(0, 1);
        return [...arr];
      })
      setStatusCurrent({ file: queue[0].name })
    }
  }, [isDownloading])

  return (
    <div className="m-5 flex justify-center items-start gap-10">
      {/* Download Buttons */}
      <div>
        <h1 className='text-2xl mb-5 '>Download Files</h1>
        <div className='flex flex-col gap-2 '>
          {
            filesDownload.map(itm => <Downloader key={itm.id} handleDownload={handleQueueCall} file={itm.fileName} url={itm.url} />)
          }
        </div>
      </div>
      {/* File List */}
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl mb-5 '>Current Download list </h1>
        {
          statusCurrent?.file && <StatusTab color={'bg-green-500'} name={statusCurrent?.file} status={'Downloading...'} />
        }
        {
          queue?.map((itm, i) => {
            return <StatusTab key={i} color={'bg-yellow-500'} name={itm?.name} status={'Queued'} />
          })
        }
        {
          downloaded?.map((itm, i) => {
            return <StatusTab key={i} color={'bg-blue-500'} name={itm?.name} status={'Downloaded'} />
          })
        }
      </div>

    </div>
  );
}

export default App;
