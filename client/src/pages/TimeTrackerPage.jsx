import { useEffect, useRef, useState, useContext } from "react";
import { getJwt, verifyData } from "../Auth/jwt";
import { useNavigate } from "react-router-dom";
import { userContext } from "./Layout";
import DatePicker from "react-datepicker";
import ManualEntryModal from "../modals/ManualEntryModal";
import "react-datepicker/dist/react-datepicker.css";


const TimeTrackerPage = () => {
  const [projects, setProjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [time, setTime] = useState({ hr: 0, min: 0, sec: 0 });
  const [showButton, setShowButton] = useState(true);
  const [entryDesc, setEntryDesc] = useState("");
  const [selectedProject, setSelectedProject] = useState();
  const [isModalOpen, setModalOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  console.log(entries);

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

  const togglePlayButton = () => {
    setShowButton((prev) => !prev);
  };

  const handleStop = () => {
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

      const response = await fetch(`${apiUrl}/projects/all`, {
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
        if (data.length > 0) {
          setSelectedProject(data[0].project_id);
        }
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

      const response = await fetch(`${apiUrl}/entries/all`, {
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
    let storageArray = [[]];
    let groupIndex = 0;
    let day = entries[0].end_time.slice(0, 10);

    for (let i = 0; i < entries.length; i++) {
      if (entries[i].end_time.startsWith(day)) {
        storageArray[groupIndex].push(entries[i]);
      } else {
        //update the 'day'
        day = entries[i].end_time.slice(0, 10);
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

      const response = await fetch(`${apiUrl}/entries/new`, {
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

      console.log(response);
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

          {/* Title of Entry Table */}
          <p className="p-4 text-xl">Recent</p>

          {/* Entry Table */}
          <div className="shadow-lg border bg-white border-gray-300 min-w-[320px] rounded-lg md:mb-4 grid grid-cols-2 md:grid-cols-1 place-items-center">
            <div className="flex flex-wrap md:mb-4 grid-cols-4 col-span-2 ">
              <div className="w-full bg-lightpurple-login p-2 pl-6 rounded-t-lg mb-0.5">
                Today
              </div>
              <input
                type="text"
                placeholder="Description"
                className="border bg-lightpurple w-1/2 placeholder-gray-950 border-gray300 ml-2 p-4 py-2 rounded-md mr-2 my-2 lg:w-1/4 "
              />
              <select className="border border-gray-300 px-4 py-2 rounded-md w-2/5 mr-2 my-2 lg:w-1/4">
                <option value="">Project</option>
                <option value="">Project 1</option>
                <option value="">Project 2</option>
                <option value="">Project 3</option>
              </select>

              {/* Start time */}
              <input
                type="text"
                placeholder="3:00pm"
                className="border border-gray p-4 ml-2 py-2 w-2/5  rounded-md mr-2 my-2 md:w-1/5 lg:w-[8%] "
              />

              {/* End time */}
              <input
                type="text"
                placeholder="3:00pm"
                className="border border-gray p-4 ml-2 py-2 w-2/5 rounded-md mr-2 my-2 md:w-1/5 lg:w-[8%] "
              />

              {/* Date */}
              <div className="customDatePickerWidth w-[100px]">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="border border-gray p-2 my-2 rounded w-5/6 lg:w-full static"
                />
              </div>
              {/* Hours Tracked */}
              <div className="border border-gray p-4 ml-2 py-2 w-2/6 rounded-md mr-2 my-2 md:w-1/6 lg:w-[8%] lg:mr-auto">
                1.5hrs
              </div>

              {/* Delete button */}
              <button className="bg-gray text-black p-2 py-2 rounded-md mr-1 md:order-3  ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7zm12-1V5h-4l-1-1h-3L9 5H5v1zM8 9h1v10H8zm6 0h1v10h-1z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeTrackerPage;
