import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJwt, verifyData } from "../Auth/jwt";


const ProjectDetails = () => {
  const [project, setProject] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const { projectId } = useParams();
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // Fetch project data on component mount and when projectId changes
  useEffect(() => {
    const fetchProjectData = async () => {
      const jwt = getJwt();
      try {
        const response = await fetch(
          `${apiUrl}/project/${projectId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json", authorization: jwt },
          }
        );
        const { success, data } = await verifyData(response, navigate);
        if (success) setProject(data);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      }
    };

    fetchProjectData();
  }, [projectId, navigate]);

  useEffect(() => {
    // Helper function to convert time string "HH:MM:SS" to seconds
    const timeStringToSeconds = (timeString) => {
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    };

    // Helper function to format seconds into "HH:MM:SS"
    const secondsToTimeString = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return [hours, minutes, remainingSeconds]
        .map((val) => val.toString().padStart(2, "0")) // Ensure two digits
        .join(":");
    };

    // Calculate the total time in seconds, then convert back to "HH:MM:SS"
    const totalSeconds = project.reduce(
      (sum, task) => sum + timeStringToSeconds(task.total_time),
      0
    );
    const totalTimeString = secondsToTimeString(totalSeconds);

    setTotalTime(totalTimeString);
  }, [project]);

  // Generate table rows
  const taskElements = project.map((task) => (
    <tr className="bg-white border-b" key={task.entry_id}>
      <td className="px-6 py-4">{task.entry_desc}</td>
      <td className="px-6 py-4">{task.username}</td>
      <td className="px-6 py-4 text-end">{task.total_time}</td>
    </tr>
  ));

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => navigate(-1)} className="mb-4">
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h14M5 12l4-4m-4 4 4 4"
          />
        </svg>
      </button>
      <div className="overflow-hidden rounded-lg shadow-md">
        <table className="w-full text-sm text-left">
          <thead className="text-black uppercase bg-lightpurple-login rounded-lg">
            <tr>
              <th scope="col" className="px-6 py-4">
                Task
              </th>
              <th scope="col" className="px-6 py-4">
                User
              </th>
              <th scope="col" className="px-6 py-4 text-end">
                Tracked Time
              </th>
            </tr>
          </thead>
          <tbody>{taskElements}</tbody>
        </table>
        <div className="text-lg flex justify-end px-6 py-3 bg-lightpurple-login">
          <span>Total Time: </span>
          <strong>{totalTime}</strong>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
