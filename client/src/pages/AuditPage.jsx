import { useState, useEffect, useContext, useRef } from "react";
import { userContext } from "./Layout.jsx";
import { getJwt } from '../Auth/jwt.js'

const AuditPage = () => {
  const [limit, setLimit] = useState(50);
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState([]);

  const pageCount = useRef(1);

  //is used to prevent debouncing from running on first render and when limit changes
  const block = useRef(true);
  

  const { workspace } = useContext(userContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  //useEffect for debouncing for page input field
  useEffect(() => {
    if (block == true) {
      block.current = false;
    } else {
      const id = setTimeout(() => {
        getLogEntries();
      }, 800);
      return () => clearTimeout(id);
    }
  }, [page])

  useEffect(() => {
    verifyAccess();
    getLogEntries();
  }, [limit]);

  const verifyAccess = () => {
    if (workspace.workspace_role === "Member") {
      navigate("/Quanta");
    }
  }

 

  const getLogEntries = async () => {
    try {
      const jwt = getJwt();

      const response = await fetch(`${apiUrl}/audit-entries/${workspace.workspace_id}?limit=${limit}&page=${page}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        }
      });

      const {success, entries, maxPages, err} = await response.json();
      if (success) {
        setEntries(entries);
        pageCount.current = parseInt(maxPages);
      } else {
        window.alert(err);
      }

    } catch (err) {
      window.alert("Error getting Audit log");
    }
  }

  return (
      <div className="min-h-[100%] pl-3 pr-3 pt-1">
        {/* buttons for changing limit */}
        <div className="flex justify-end mt-3">
          <div className="mr-4">
            <button
              className={`${limit == 50 ? "bg-resetpurple text-white" : "bg-white"} p-2 px-3 border`}
              onClick={() => { setPage(1); setLimit(50)}}
            >
              50
            </button>
            <button
              className={`${limit == 100 ? "bg-resetpurple text-white" : "bg-white"} p-2 px-3 border`}
              onClick={() => { setPage(1); setLimit(100)}}
            >
              100
            </button>
            <button
              className={`${limit == 200 ? "bg-resetpurple text-white" : "bg-white"} p-2 px-3 border `}
              onClick={() => { setPage(1); setLimit(200)}}
            >
              200
            </button>
          </div>
          {/* buttons for changing page */}
          <div className="flex">
            <button
              className=""
              onClick={() => {
                if (page === 1) return;
                setPage(prev => prev-1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 6l-6 6l6 6"></path></svg>
            </button>
            <input
              className="w-[50px] text-center bg-lightpurple-body text-xl"
              type="number"
              value={page}
              onChange={(e) => {
                if (e.target.value > pageCount.current) return;
                setPage(e.target.value)
              }}
              min={1}
              max={pageCount.current}
            >
            
            </input>
            <button
              className="rotate-180"
              onClick={() => {
                if(entries.length < limit) return;
                setPage(prev => prev+1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 6l-6 6l6 6"></path></svg>
            </button>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg mt-3 my-6 overflow-x-auto">
        <table className="text-left w-full border-collapse border-b">
          <thead>
            <tr className="bg-lightpurple-login">
              <th className="py-4 px-3 md:px-9">Name </th>
              <th className="py-4 px-3 md:px-9 ">Event </th>
              <th className="py-4 px-3 md:px-9">Project Name</th>
              <th className="py-4 px-3 md:px-9">TimeStamp </th>
            </tr>
          </thead>
          <tbody className="overflow-auto max-h-[200px]">
            {entries.map(entry => (
              <tr className="border-b-2 border-lightpurple-login" key={entry.edit_id}>
                <td className="py-4 px-4 md:px-9">{entry.username}</td>
                <td className="py-4 md:px-4 md:px-9">{entry.edit_desc}</td>
                <td className="py-4 px-4 md:px-9">{entry.project_name}</td>
                <td className="py-4 px-4 md:px-9">{entry.edit_timestamp}</td>
              </tr>
            ))}
          </tbody>
          </table>
          </div>
          {/* buttons for changing limit */}
        <div className="flex justify-end mb-3">
          <div className="mr-4">
            <button
              className={`${limit == 50 ? "bg-resetpurple text-white" : "bg-white"} p-2 px-3 border`}
              onClick={() => { setPage(1); setLimit(50)}}
            >
              50
            </button>
            <button
              className={`${limit == 100 ? "bg-resetpurple text-white" : "bg-white"} p-2 px-3 border`}
              onClick={() => { setPage(1); setLimit(100)}}
            >
              100
            </button>
            <button
              className={`${limit == 200 ? "bg-resetpurple text-white" : "bg-white"} p-2 px-3 border `}
              onClick={() => { setPage(1); setLimit(200)}}
            >
              200
            </button>
          </div>
          {/* buttons for changing page */}
          <div className="flex">
            <button
              className=""
              onClick={() => {
                if (page === 1) return;
                setPage(prev => prev-1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 6l-6 6l6 6"></path></svg>
            </button>
            <input
              className="w-[50px] text-center bg-lightpurple-body text-xl"
              type="number"
              value={page}
              onChange={(e) => {
                if (e.target.value > pageCount.current) return;
                setPage(e.target.value)
              }}
              min={1}
              max={pageCount.current}
            >
            
            </input>
            <button
              className="rotate-180"
              onClick={() => {
                if(entries.length < limit) return;
                setPage(prev => prev+1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 6l-6 6l6 6"></path></svg>
            </button>
          </div>
        </div>
        </div>
  );
};


export default AuditPage;
