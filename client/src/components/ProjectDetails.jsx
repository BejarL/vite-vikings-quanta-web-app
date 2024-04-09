import { useParams } from "react-router-dom";

const ProjectDetails = ({ Project }) => {
  const { projectId } = useParams();

  // Fetch project details using projectId
  // Using mock data for now
  const project = {
    name: "Project Name",
    tasks: [
      {
        id: 1,
        description: "Worked on wireframes",
        user: "Lisset",
        time: "30h",
      },
      { id: 2, description: "Worked on wireframes", user: "Ben", time: "30h" },
      { id: 3, description: "Worked on wireframes", user: "RJ", time: "30h" },
    ],
    totalTrackedTime: "90h",
  };

  return (
    <div className="container mx-auto p-4 ">
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
            {project.tasks.map((task) => (
              <tr className="bg-white border-b" key={task.id}>
                <td className="px-6 py-4">{task.description}</td>
                <td className="px-6 py-4">{task.user}</td>
                <td className="px-6 py-4 text-end">{task.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-lg flex justify-end px-6 py-3 bg-lightpurple-login">
          <span>Total Time: </span>
          <strong>{project.totalTrackedTime}</strong>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
