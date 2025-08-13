import { useEffect, useRef, useState } from 'react'
import './App.css'
import { URL } from './urls';
import Replay from './components/reply';

function App() {

  const [query, setQuery] = useState('');
  const [res, setRes] = useState([]);
  const [recentHistory, setrecentHistory] = useState(JSON.parse(localStorage.getItem('history')));
  const [selecthistory, setSelecthistory] = useState('');
  const scrollToAll = useRef();


  const askQuery = async () => {
    if (!query && !selecthistory) {
      return false
    }

    if (query) {
      if (localStorage.getItem('history')) {
        let history = JSON.parse(localStorage.getItem('history'))
        history = [query, ...history]
        localStorage.setItem('history', JSON.stringify(history))
        setrecentHistory(history)
      } else {
        localStorage.setItem('history', JSON.stringify([query]))
        setrecentHistory([query]);
      }
    }

    const payloadData = query ? query : selecthistory

    const payload = {
      "contents": [{
        "parts": [{ "text": payloadData }]
      }]
    }


    let response = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(payload)
    })

    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split("* ");
    dataString = dataString.map((item) => item.trim())


    // console.log(dataString)
    setRes([...res, { type: "q", text: query ? query : selecthistory }, { type: 'a', text: dataString }]);
    setQuery('') 

    setTimeout(() => {
      scrollToAll.current.scrollTop = scrollToAll.current.scrollHeight;
    }, 500);

  }
  // console.log(recentHistory);

  const clearHistory = () => {
    localStorage.clear();
    setrecentHistory([]);

  }

  const isEnter = (event) => {
    if (event.key == 'Enter') {
      askQuery();

    }
  }
  useEffect(() => {
    console.log(selecthistory)
    askQuery()
  }
    , [selecthistory])

  return (
    <div className=' grid grid-cols-5 h-screen text-center'>
      <div className='col-span-1 bg-zinc-700 pt-3'>
        <h1 className='text-xl text-white flex text-center justify-center'><span>Recent Search</span>
          <button onClick={clearHistory} className='cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg></button></h1>
        <ul className='text-left overflow-auto mt-4 '>

          {

            recentHistory && recentHistory.map((item) => (
              <li onClick={() => setSelecthistory(item)} className='pl-5 px-5 text-zinc-400 truncate cursor-pointer hover:bg-zinc-500 hover:text-zinc-200'>
                {item}
              </li>


            ))

          }

 
        </ul>
      </div>
      
      <div className='col-span-4 p-10 bg-zinc-800  '>
        <div ref={scrollToAll} className='container h-110 overflow-y-hidden'>
          <div className='text-zinc-100'>

            <ul>
              {
                res.map((item, index) => (
                  <div key={index + Math.random()} className={item.type == 'q' ? 'flex justify-end' : ''}>
                    {
                      item.type == "q" ?
                        <li key={index + Math.random()}
                          className='text-right p-2 border-4 bg-zinc-700 border-zinc-700 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit '>

                          <Replay rep={item.text} totalResult={1} index={index} type={item.type} /></li>
                        : item.text.map((repItem, repIndex) => (
                          <li key={repIndex + Math.random()} className='text-left p-2'  ><Replay rep={repItem} totalResult={item.lenth} type={item.type} index={repIndex} /></li>

                        ))
                    }
                  </div>

                ))
              }

            </ul>
          </div>
        </div>
        <div className='bg-zinc-600 w-1/2 p-1 pr-5 text-white m-auto rounded-4xl border border-zinc-700 flex h-16' >
          <input type="text" value={query}
            onKeyDown={isEnter}
            onChange={(event) => setQuery(event.target.value)} placeholder='Ask Me Question' className='w-full h-full p-3 outline-none' />
          <button className="font-bold" onClick={askQuery} >Say</button>
        </div>
      </div>

    </div>
  )
}

export default App
