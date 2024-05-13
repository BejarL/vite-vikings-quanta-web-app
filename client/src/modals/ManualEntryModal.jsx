import { useState } from "react";
import { getJwt } from "../Auth/jwt";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatTime } from "../components/TimeEntry";

const ManualEntryModal = ({ isOpen, onClose, projects, getEntries, workspace_id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(formatTime(new Date()));
  const [endTime, setEndTime] = useState(formatTime(new Date()));
  const [entryDesc, setEntryDesc] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!entryDesc) {
      setError("Please enter a description");
      return;
    } else if (!selectedProject) {
      setError("Please select a project");
      return
    }
    createEntry()
  }; 

  const getNewTime = (initialDate, time) => {
    const startDate = new Date(initialDate);
    const timeValues = time.split(":");
    startDate.setHours(timeValues[0]);
    startDate.setMinutes(timeValues[1]);
    return startDate;
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
          start_time: getNewTime(startDate, startTime),
          end_time: getNewTime(startDate, endTime),
          entry_desc: entryDesc,
          tag: null,
          project_id: selectedProject,
          workspace_id
        }),
      });

      const { success, err } = await response.json();

      if (success) {
        getEntries();
        handleClose();
      } else {
        setError(err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setError("");
    setEntryDesc("");
    setSelectedProject("");
    onClose();
  }

  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-[5]">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4">
        <div className="text-center p-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Manual Time Entry 
          </h3>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
             type="text"
             name="description"
             className="appearance-none rounded-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
             placeholder="Description.."
             value={entryDesc}
             onChange={(e) => setEntryDesc(e.target.value)}
            />
            <select
              type="text"
              name="description"
              className="appearance-none rounded-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Projects"
              required
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Select a project</option>
              { projects ? 
                projects.map((item) => {
                  return (
                    <option value={item.project_id} key={item.project_id}>
                      {item.project_name}
                    </option>
                  );
                })  
                : null
              }
            </select>
            <div className="">
            <input
              type="time"
              name="start"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="relative appearance-none rounded-none pl-[40px] m-5 w-[120px] py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="0:00"
            />
            -
            <input
              type="time"
              name="end"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="relative appearance-none rounded-none pl-[40px] m-5 w-[120px] py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="0:00"
            />
            {error && <p className="text-red-500">{error}</p>}
              <DatePicker
                  popperPlacement="right-start"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="border border-gray p-2 my-2 rounded w-5/6 lg:w-full"
                  />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                onClick={createEntry}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManualEntryModal;