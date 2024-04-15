import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJwt, verifyData } from "../Auth/jwt";

const ProjectDetails = ({ Project }) => {
  const [project, setProject] = useState([])
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Fetch project details using projectId
  // Using mock data for now
  useEffect(() => {
    getProjectData();
  }, [])

  const getProjectData = async () => {
    try {
      const jwt = getJwt();

      const res = await fetch(`http://localhost:3000/project/${projectId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": jwt
                }
            })
      
      const { success, data } = await verifyData(res, navigate);
      
      console.log(data);

      setProject(data);
      
    } catch (err) {
      console.log(err)
    }
  }

  // const project = {
  //   name: "Project Name",
  //   tasks: [
  //     {
  //       id: 1,
  //       description: "Worked on wireframes",
  //       user: "Lisset",
  //       time: "30h",
  //     },
  //     { id: 2, description: "Worked on wireframes", user: "Ben", time: "30h" },
  //     { id: 3, description: "Worked on wireframes", user: "RJ", time: "30h" },
  //   ],
  //   totalTrackedTime: "90h",
  // };

  let totalTime = 0;

  const taskElems = project.map((task) => {
    totalTime += task.total_time;
    return (
    <tr className="bg-white border-b" key={task.entry_id}>
      <td className="px-6 py-4">{task.entry_desc}</td>
      <td className="px-6 py-4">{task.username}</td>
      <td className="px-6 py-4 text-end">{task.total_time}</td>
    </tr>
  )})

  return (
    <div className="container mx-auto p-4 ">
      <div>
        <button
        onClick={() => navigate(-1)}>
          <svg
            className="w-10 h-10"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h14M5 12l4-4m-4 4 4 4"
            /> 
          </svg>
        </button>
      </div>
      <div className="overflow-hidden overflow-x-auto rounded-lg shadow-md">
        <table className="w-full text-sm text-left">
          <thead className=" text-black uppercase bg-lightpurple-login rounded-lg">
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
          <tbody>
            {taskElems}
          </tbody>
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
