import React, { useEffect, useRef, useState, useContext, createContext } from "react";
import { getJwt, verifyData } from "../Auth/jwt";
import { useNavigate } from "react-router-dom";
import { userContext } from "./Layout";
import TimeTrackerDay from "../components/TimeTrackerDay";
import TimeEntry from "../components/TimeEntry"
import DatePicker from "react-datepicker";
import ManualEntryModal from "../modals/ManualEntryModal";
import "react-datepicker/dist/react-datepicker.css";

export const projectsContext = createContext(null);

const TimeTrackerPage = () => {
  const [projects, setProjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const [time, setTime] = useState({ hr: 0, min: 0, sec: 0 });
  const [showButton, setShowButton] = useState(true);
  const [entryDesc, setEntryDesc] = useState("");
  const [selectedProject, setSelectedProject] = useState();
  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const { workspace } = useContext(userContext);
  let id = useRef();

  const apiUrl = import.meta.env.VITE_API_URL;

  //clears our handleTime function
  useEffect(() => {
    getProjects();
    getEntries();
    return () => clearInterval(id.current);
  }, []);

  const handleTime = () => {
    id.startDate = new Date();
    id.current = setInterval(() => {
      setTime((prev) => {
        if (prev.sec == 60) {
          return { ...prev, min: prev.min + 1, sec: 0 };
        }
        if (prev.min == 60) {
          return { ...prev, hr: prev.hr + 1, min: 0, sec: 0 };
        }
        return { ...prev, sec: prev.sec + 1 };
      });
    }, 1000);
  };

  const handleStop = () => {
    //if they dont have a desc or project Id, early return and force them to enter one
    if (!entryDesc) {
      window.alert("Enter a description");
      return
    } else if (selectedProject == -1) {
      window.alert("Please Select a project");
      return;
    }
    id.endDate = new Date();
    clearInterval(id.current);
    setTime({ hr: 0, min: 0, sec: 0 });
    togglePlayButton();
    createEntry();
  };

  const handleEntryDesc = (e) => {
    setEntryDesc(e.target.value);
  };

  const handleSelectedProject = (e) => {
    setSelectedProject(e.target.value);
  };

  const togglePlayButton = () => {
    setShowButton((prev) => !prev);
  };

  const getProjects = async () => {
    try {
      const jwt = getJwt();
      const response = await fetch(`${apiUrl}/projects/all/${workspace.workspace_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        }
      });
      //check if the request was successful, if not do an early return
      if (response.ok) {
        //get the data from the response
        const { data } = await verifyData(response, navigate);
        setProjects(data);
        // Added a check to see if data has elements to avoid errors
      } else {
        console.error("Failed to fetch projects");
      }
      // setProjects(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getEntries = async () => {
    try {
      const jwt = getJwt();
      const response = await fetch(`${apiUrl}/entries/all/${workspace.workspace_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt
        }
      });

      const data = await response.json()
      if (data.success) {
        formatEntries(data.entries);
      } else {
        window.alert("Error getting entries");
        console.log(data.err);
      }
    } catch (err) {
      console.log(err)
    }
  }

  //is a helper function when sorting entries, formats based on local time
  const formatDay = (dateObj) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let formattedDate = new Date(dateObj);
    formattedDate.toLocaleString('en-US', { timeZone: userTimeZone });
    return formattedDate.toString().slice(0, 10);
  }

  //sorts entries into a two dimensional array based on the entries end time
  const formatEntries = (entries) => {
    let storageArray = [[]];
    let groupIndex = 0;
    let day = formatDay(entries[0].end_time);

    for (let i = 0; i < entries.length; i++) {
      const endTime = formatDay(entries[i].end_time)

      if (endTime.startsWith(day)) {
        storageArray[groupIndex].push(entries[i]);
      } else {
        //update the 'day'
        day = formatDay(entries[i].end_time)
        // increment the group index
        groupIndex +=1;
        //push a new empty array onto the storageArray, then push the entry into that array
        storageArray.push([]);
        storageArray[groupIndex].push(entries[i]);
      }
    }

    setEntries(storageArray);
  }

  const createEntry = async () => {
    try {
      const jwt = getJwt();
      const response = await fetch("http://localhost:3000/entries/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        },
        body: JSON.stringify({
          start_time: id.startDate,
          end_time: id.endDate,
          entry_desc: entryDesc,
          tag: null,
          project_id: selectedProject,
          workspace_id: workspace.workspace_id,
        }),
      });
      const { success, err } = await response.json();
      if (success) {
        getEntries();
      } else {
        window.alert("Error creating entry, please try again")
      }
    } catch (err) {
      console.log(err);
    }
  };

  //creates the projects options to select from
  const projectElems = projects.map((item) => {
    return (
      <option value={item.project_id} key={item.project_id}>
        {item.project_name}
      </option>
    );
  });

  //maps through to get an array for each time entry group (day)
  const entryElems = entries.map(entryGroup => {
    return <TimeTrackerDay entryGroup = {entryGroup} key={entryGroup[0].entry_id}/>
  })

  return (
    <>
      {/* content*/}
      <div className="flex min-h-[100%]">
        <div className="shadow-lg border border-gray-300 min-w-320 rounded p-4 w-full ">
          {/* tracking */}
          <div className="shadow-lg border bg-white border-gray-300 min-w-[320px] rounded p-4 md:mb-4 grid grid-cols-2 md:grid-cols-1">
            <div className="flex flex-wrap md:mb-4 grid-cols-4 col-span-2">
              {/* entry desc */}
              <input
                type="text"
                placeholder="Description"
                className="border bg-lightpurple w-full placeholder-gray-950 border-gray300 p-4 py-2 rounded-md mr-2 my-2 md:w-4/4 lg:w-1/3"
                value={entryDesc}
                onChange={handleEntryDesc}
              />
              <select
                className="border border-gray-300 px-4 py-2 rounded-md w-3/4 mr-2 my-2 md:w-2/5 lg:w-1/4"
                value={selectedProject}
                onChange={handleSelectedProject}
              >
                <option value={-1}>Select Project</option>
                {projectElems}
              </select>
              {/* add button */}
              <button className="bg-white text-black p-1 py-2 rounded-md flex items-center md:order-last " onClick={() => setModalOpen(true)}>
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                >
                  <path d="M7.5 1V14M1 7.5H14" stroke="#000000" />
                </svg>
              </button>
              <ManualEntryModal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              />
              {/* Timer */}
              <div className="border border-gray p-4 py-2 w-3/4 min-w-[201px] rounded-md mr-2 my-2 md:w-1/4 lg:w-1/5 lg:mr-auto">
                {time.hr.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
                :
                {time.min.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
                :
                {time.sec.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                  useGrouping: false,
                })}
              </div>
              {/* Play Button and Stop Button */}
              {showButton ? (
                <button
                  className="bg-gray text-black p-2 py-2 rounded-md mr-2 md:order-3"
                  onClick={() => {
                    handleTime();
                    togglePlayButton();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="fill-current"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              ) : (
                <button
                  className="bg-gray text-black p-2 py-2 rounded-md mr-2 md:order-3"
                  onClick={handleStop}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path fill="black" d="M3 21V3h18v18z"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
          {/* Entries go here */}
          <div>
            <projectsContext.Provider value={projects ? {projects: projects, getEntries: getEntries }: null}>
              {entryElems}
            </projectsContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
};
export default TimeTrackerPage;