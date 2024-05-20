import { useEffect, useRef, useState, useContext, createContext } from "react";
import { getJwt, verifyData } from "../Auth/jwt";
import { useNavigate } from "react-router-dom";
import { userContext } from "./Layout";
import TimeTrackerDay from "../components/TimeTrackerDay";
import ManualEntryModal from "../modals/ManualEntryModal";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlay, FaPlus, FaStop } from "react-icons/fa";

export const projectsContext = createContext(null);

const TimeTrackerPage = () => {
  const [projects, setProjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const [time, setTime] = useState({ hr: 0, min: 0, sec: 0 });
  const [showButton, setShowButton] = useState(true);
  const [entryDesc, setEntryDesc] = useState("");
  const [selectedProject, setSelectedProject] = useState();
  const [isModalOpen, setModalOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const { workspace } = useContext(userContext);
  let id = useRef();

  //clears our handleTime function
  useEffect(() => {
    getProjects();
    getEntries();
    return () => clearInterval(id.current);
  }, [workspace]);

  const handleTime = () => {
    id.startDate = new Date();
    if (id.current) clearInterval(id.current);
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
      return;
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
       
      const { success, data } = await response.json();

      if (success) {
        setProjects(data);
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

      const {success, entries: newEntries} = await response.json()
      if (success) {
        if (newEntries.length) {
          formatEntries(newEntries);
        } else {
          setEntries([]);
        }
      } else {
        window.alert("Error getting entries");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //is a helper function when sorting entries, formats based on local time
  const formatDay = (dateObj) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let formattedDate = new Date(dateObj);
    formattedDate.toLocaleString("en-US", { timeZone: userTimeZone });
    return formattedDate.toString().slice(0, 10);
  };

  //sorts entries into a two dimensional array based on the entries end time
  const formatEntries = (entries) => {
    let storageArray = [[]];
    let groupIndex = 0;
    let day = formatDay(entries[0].end_time);

    for (let i = 0; i < entries.length; i++) {
      const endTime = formatDay(entries[i].end_time);

      if (endTime.startsWith(day)) {
        storageArray[groupIndex].push(entries[i]);
      } else {
        //update the 'day'
        day = formatDay(entries[i].end_time);
        // increment the group index
        groupIndex += 1;
        //push a new empty array onto the storageArray, then push the entry into that array
        storageArray.push([]);
        storageArray[groupIndex].push(entries[i]);
      }
    }

    setEntries(storageArray);
  };

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
        setEntryDesc("");
        setSelectedProject(-1);
      } else {
        window.alert("Error creating entry, please try again");
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
  const entryElems = entries.map((entryGroup) => <TimeTrackerDay entryGroup={entryGroup} key={entryGroup[0].entry_id} />);

  return (
    <>
      {/* content*/}
      <div className="flex min-h-[100%]">
        <div className="shadow-lg border border-gray-300 min-w-320 rounded p-4 w-full ">
          {/* tracking */}
          <div className="shadow-lg bg-white min-w-[320px] rounded p-4 md:mb-4 grid grid-cols-2 md:grid-cols-1">
            <div className="flex flex-wrap grid-cols-4 col-span-2">
              {/* entry desc */}
              <input
                type="text"
                placeholder="Description"
                className="bg-lightpurple w-full placeholder-gray-950 p-4 py-2 rounded-md mr-2 my-2 md:w-4/4 lg:w-1/3"
                value={entryDesc}
                onChange={handleEntryDesc}
                autoFocus
              />
              <select
                className="px-4 py-2 rounded-md w-3/4 mr-2 my-2 md:w-2/5 lg:w-1/4 cursor-pointer"
                value={selectedProject}
                onChange={handleSelectedProject}
              >
                <option value={-1}>Select Project</option>
                {projectElems}
              </select>
              {/* add button */}
              <button
                className="flex items-center md:order-last"
                onClick={() => setModalOpen(true)}
              >
                <FaPlus size={"20"} />
              </button>
              <ManualEntryModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                projects={projects}
                createEntry={createEntry}
                getEntries={getEntries}
                workspace_id={workspace.workspace_id}
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
                  <FaPlay size={"20"} />
                </button>
              ) : (
                <button
                  className="bg-gray text-black p-2 py-2 rounded-md mr-2 md:order-3"
                  onClick={handleStop}
                >
                  <FaStop size={"20"} />
                </button>
              )}
            </div>
          </div>
          {/* Entries go here */}
          <div>
            <projectsContext.Provider
              value={
                projects ? { projects: projects, getEntries: getEntries } : null
              }
            >
              {entryElems}
            </projectsContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
};
export default TimeTrackerPage;
