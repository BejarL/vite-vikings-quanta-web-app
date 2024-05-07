import { useEffect, useRef, useState, useContext, createContext } from "react";
import { getJwt, verifyData } from "../Auth/jwt";
import { useNavigate } from "react-router-dom";
import { userContext } from "./Layout";
import TimeTrackerDay from "../components/TimeTrackerDay";
import ManualEntryModal from "../modals/ManualEntryModal";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlay, FaPlus, FaStop } from "react-icons/fa";
import { format } from "date-fns";

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

  //clears our handleTime function
  useEffect(() => {
    getProjects();
    getEntries();
    return () => clearInterval(id.current);
  }, []);

  const handleTime = () => {
    id.startDate = new Date();
    if (id.current) clearInterval(id.current);
    id.current = setInterval(() => {
      setTime((prev) => {
        const seconds = prev.sec + 1;
        const minutes = seconds === 60 ? prev.min + 1 : prev.min;
        const hours = minutes === 60 ? prev.hr + 1 : prev.hr;
        return {
          hr: hours % 24,
          min: minutes % 60,
          sec: seconds % 60,
        };
      });
    }, 1000);
  };

  const togglePlayButton = () => {
    setShowButton((prev) => !prev);
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

  const getProjects = async () => {
    try {
      const jwt = getJwt();

      const response = await fetch("http://localhost:3000/projects/all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        },
        body: JSON.stringify({ workspace_id: workspace.workspace_id }),
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

      const response = await fetch("http://localhost:3000/entries/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        },
      });

      const data = await response.json();

      if (data.success) {
        formatEntries(data.entries);
      } else {
        window.alert("Error getting entries");
        console.log(data.err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const formatEntries = (entries) => {
    if (entries.length === 0) {
      setEntries([]);
      return;
    }

    let groupedEntries = [[]];
    let currentGroupIndex = 0;
    let currentDate = entries[0].end_time.slice(0, 10);

    entries.forEach((entry) => {
      let entryDate = entry.end_time.slice(0, 10);
      if (entryDate === currentDate) {
        groupedEntries[currentGroupIndex].push(entry);
      } else {
        currentDate = entryDate;
        currentGroupIndex++;
        groupedEntries[currentGroupIndex] = [entry];
      }
    });

    setEntries(groupedEntries);
  };

  const createEntry = async () => {
    try {
      const jwt = getJwt();

      const response = await fetch("http://localhost:3000/entries/new", {
        method: "PUT",
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
        window.alert("Error creating entry, please try again");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const projectElems = projects.map((item) => {
    return (
      <option value={item.project_id} key={item.project_id}>
        {item.project_name}
      </option>
    );
  });

  const entryElems = entries.map((entryGroup) => {
    return (
      <TimeTrackerDay entryGroup={entryGroup} key={entryGroup[0].entry_id} />
    );
  });

  return (
    <>
      {/* content*/}
      <div className="flex min-h-[100%]">
        <div className="shadow-lg border border-gray-300 min-w-320 rounded p-4 w-full ">
          {/* tracking */}
          <div className="shadow-lg bg-white min-w-[320px] rounded p-4 md:mb-4 grid grid-cols-2 md:grid-cols-1">
            <div className="flex flex-wrap md:mb-4 grid-cols-4 col-span-2">
              {/* entry desc */}
              <input
                type="text"
                placeholder="Description"
                className="bg-lightpurple w-full placeholder-gray-950 p-4 py-2 rounded-md mr-2 my-2 md:w-4/4 lg:w-1/3"
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
              <button
                className="bg-white text-black p-1 py-2 rounded-md flex items-center md:order-last "
                onClick={() => setModalOpen(true)}
              >
                <FaPlus size={"20"} />
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
