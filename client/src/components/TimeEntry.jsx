import { useState, useEffect, useContext, useRef } from 'react';
import { projectsContext } from '../pages/TimeTrackerPage';
import { userContext } from '../pages/Layout';
import { getJwt } from '../Auth/jwt';
import DatePicker from "react-datepicker";

const TimeEntry = ({ entry }) => {
    const [entryDesc, setEntryDesc] = useState(entry.entry_desc);
    const [startTime, setStartTime] = useState(entry.start_time.slice(11,16));
    const [endTime, setEndTime] = useState(entry.end_time.slice(11,16));
    const [timeDay, setTimeDay] = useState(entry.end_time);
    const [projectId, setProjectId] = useState(entry.project_id); 
    
    const { projects: projectsInfo, getEntries } = useContext(projectsContext);
    const { workspace } = useContext(userContext);

    const initial = useRef(true);

   
    //debouncing to reduce api calls when updating entries
    useEffect(() => {
      if (initial.current) {
        initial.current = false;
      } else {
        const interval = setTimeout(() => {
          updateEntry();
        }, 2000);
        return () => clearTimeout(interval);
      }
    }, [entryDesc, projectId]);

    const handleProjectId = (e) => {
        setProjectId(e.target.value);
      };

    const handleEntryDesc = (e) => {
        setEntryDesc(e.target.value);
    }

    const handleStartTime = (e) => {
      console.log(typeof e.target.value);
      setStartTime(e.target.value);
    }

    const handleEndTime = (e) => {
      setEndTime(e.target.value);
    }

    //is used to delete an entry
    const deleteEntry = async () => {
        try {
            const jwt = getJwt();
      
            const response = await fetch("http://localhost:3000/entries/delete", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: jwt,
              },
              body: JSON.stringify({
                project_id: projectId,
                workspace_id: workspace.workspace_id,
                entry_id: entry.entry_id
              }),
            });
      
            const { success } = await response.json();

            //if request is succesful and the entry was deleted, call getEntries from TimeTrackerPage to 'reload' the page.
            if (success) {
                getEntries();
            } else {
                window.alert("Error deleting entry, please try again");
            }
            
          } catch (err) {
            console.log(err);
          }
    }

    const updateEntry = async () => {
        try {
            const jwt = getJwt();

            const response = await fetch("http://localhost:3000/entries/update", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: jwt,
              },
              body: JSON.stringify({
                entry_id: entry.entry_id, 
                start_time: time.start,
                end_time: time.end,
                entry_desc: entryDesc,
                project_id: projectId,
                workspace_id: workspace.workspace_id
              }),
            });

            const { success, err } = await response.json();

            if (success) {
              getEntries();
            } else {
              window.alert("Error updating entry: " + err);
            }
            

            // if the update was successfull, call getEntries again and set the update ref back to empty
            // have to call get Entries again in case they change the date of an entry and it needs to be 
            // put in a different day
            
        } catch (err) {
            console.log(err);
        }
    }

    const projectElems = projectsInfo.map((item) => {
        return (
          <option value={item.project_id} key={item.project_id}>
            {item.project_name}
          </option>
        );
      });

    return (
        <div className="shadow-lg border bg-white border-gray-300 min-w-[320px] rounded-lg md:mb-4 grid grid-cols-2 md:grid-cols-1">
            <div className="flex flex-wrap md:mb-4 grid-cols-4 col-span-2">
                <input className="border bg-lightpurple w-1/2 placeholder-gray-950 border-gray300 ml-2 p-4 py-2 rounded-md mr-2 my-2 lg:w-1/4" 
                    placeholder="Description"
                    type="text"
                    value={entryDesc}
                    onChange={handleEntryDesc}
                />
                <select className="border border-gray-300 px-4 py-2 rounded-md w-2/5 mr-2 my-2 lg:w-1/4 " value={projectId} onChange={handleProjectId}>
                    {projectElems}
                </select>
                {/* Start time */}
                <div>
                  
                </div>
                <input
                  type="time"
                  value={startTime}
                  onChange={handleStartTime}
                  className="relative appearance-none rounded-none pl-[40px] m-5 w-[120px] py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="0:00"
                />
                {/* End time */}
                <input
                  type="time"
                  value={endTime}
                  onChange={handleEndTime}
                  className="relative appearance-none rounded-none pl-[40px] m-5 w-[120px] py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="0:00"
                />
                {/* Date */}
                <div className="customDatePickerWidth w-[100px]">
                        <DatePicker
                            selected={timeDay}
                            onChange={(date) => setTimeDay(date)}
                            className="border border-gray p-2 my-2 rounded w-5/6 lg:w-full"
                        />
                </div>
                {/* Hours Tracked */}
                <div className="border border-gray p-4 ml-2 py-2 w-2/6 rounded-md mr-2 my-2 md:w-1/6 lg:w-[8%] lg:mr-auto">{entry.total_time}</div>
                
                    {/* Delete button */}
                <button className="bg-gray text-black p-2 py-2 rounded-md mr-1 md:order-3"
                        onClick={deleteEntry}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7zm12-1V5h-4l-1-1h-3L9 5H5v1zM8 9h1v10H8zm6 0h1v10h-1z"/></svg>
                </button>
            </div>
        </div> 
    )

}


export default TimeEntry;