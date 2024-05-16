import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "./Layout";
import { getJwt, verifyData } from "../Auth/jwt.js";
import ProjectModal from "../modals/ProjectModal.jsx";
import DeleteProjectModal from "../modals/DeleteProjectModal.jsx";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchProject, setSearchProject] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const { workspace } = useContext(userContext);

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    const jwt = getJwt();

    try {
      const response = await fetch(
        `${apiUrl}/projects/all/${workspace.workspace_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: jwt,
          },
        }
      );

      const { success, data } = await verifyData(response, navigate);
      if (success) {
        setProjects(data);
      } else {
        window.alert("Error getting data");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleSearchChange = (event) => {
    setSearchProject(event.target.value);
  };

  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(searchProject.toLowerCase())
  );

  const handleModalClose = () => {
    setIsModalOpen(false);
    getProjects();
  };

  const handleProjectDelete = (projectId) => {
    const updatedProjects = projects.filter(
      (Projects) => Projects.project_id !== projectId
    );
    setProjects(updatedProjects);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "00:00";
    const [hours, minutes] = timeString.split(":");
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="container mx-auto px-4 mt-4">
      {/* Search and Add Section */}
      <h1 className="text-2xl font-bold mb-5">WorkSpace Projects</h1>
      <div>
        <button
          className="bg-purple-600 mb-5  hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
          aria-label="Open modal to add new project"
        >
          New Project +
        </button>
        <ProjectModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          workspace_id={workspace.workspace_id}
          getProjects={getProjects}
        />
      </div>
      <div className="w-[50%] flex justify-between items-center">
        <input
          className="shadow appearance-none border rounded w-full py-2 pl-4 pr-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="search"
          type="text"
          placeholder="Find by name"
          value={searchProject}
          onChange={handleSearchChange}
          aria-label="Search projects"
        />
        <svg className="w-9 h-7" viewBox="0 0 50 50">
          <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"></path>
        </svg>
      </div>

      {/* Project List Section */}
      <div className="bg-white shadow rounded-md my-6 overflow-x-auto">
        <table className="text-left w-full border-collapse border-b">
          <thead>
            <tr className="bg-lightpurple-login">
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Tracked Time</th>
              <th className="py-4 px-6 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((Projects) => (
              <tr key={Projects.project_id} className="hover:bg-gray-100">
                <td className="py-4 px-6 border-b border-gray-200">
                  <Link to={`/quanta/projects/${Projects.project_id}`}>
                    {Projects.project_name}
                  </Link>
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  {formatTime(Projects.total_project_time)}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 text-end">
                  <button
                    onClick={() => {
                      setCurrentProjectId(Projects.project_id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-white p-1 rounded-full inline-flex items-center justify-center"
                    aria-label="Delete project"
                  >
                    <svg className="w-10 h-10" viewBox="0 0 100 100">
                      <path
                        fill="#f37e98"
                        d="M25,30l3.645,47.383C28.845,79.988,31.017,82,33.63,82h32.74c2.613,0,4.785-2.012,4.985-4.617L75,30"
                      ></path>
                      <path
                        fill="#f15b6c"
                        d="M65 38v35c0 1.65-1.35 3-3 3s-3-1.35-3-3V38c0-1.65 1.35-3 3-3S65 36.35 65 38zM53 38v35c0 1.65-1.35 3-3 3s-3-1.35-3-3V38c0-1.65 1.35-3 3-3S53 36.35 53 38zM41 38v35c0 1.65-1.35 3-3 3s-3-1.35-3-3V38c0-1.65 1.35-3 3-3S41 36.35 41 38zM77 24h-4l-1.835-3.058C70.442 19.737 69.14 19 67.735 19h-35.47c-1.405 0-2.707.737-3.43 1.942L27 24h-4c-1.657 0-3 1.343-3 3s1.343 3 3 3h54c1.657 0 3-1.343 3-3S78.657 24 77 24z"
                      ></path>
                      <path
                        fill="#1f212b"
                        d="M66.37 83H33.63c-3.116 0-5.744-2.434-5.982-5.54l-3.645-47.383 1.994-.154 3.645 47.384C29.801 79.378 31.553 81 33.63 81H66.37c2.077 0 3.829-1.622 3.988-3.692l3.645-47.385 1.994.154-3.645 47.384C72.113 80.566 69.485 83 66.37 83zM56 20c-.552 0-1-.447-1-1v-3c0-.552-.449-1-1-1h-8c-.551 0-1 .448-1 1v3c0 .553-.448 1-1 1s-1-.447-1-1v-3c0-1.654 1.346-3 3-3h8c1.654 0 3 1.346 3 3v3C57 19.553 56.552 20 56 20z"
                      ></path>
                      <path
                        fill="#1f212b"
                        d="M77,31H23c-2.206,0-4-1.794-4-4s1.794-4,4-4h3.434l1.543-2.572C28.875,18.931,30.518,18,32.265,18h35.471c1.747,0,3.389,0.931,4.287,2.428L73.566,23H77c2.206,0,4,1.794,4,4S79.206,31,77,31z M23,25c-1.103,0-2,0.897-2,2s0.897,2,2,2h54c1.103,0,2-0.897,2-2s-0.897-2-2-2h-4c-0.351,0-0.677-0.185-0.857-0.485l-1.835-3.058C69.769,20.559,68.783,20,67.735,20H32.265c-1.048,0-2.033,0.559-2.572,1.457l-1.835,3.058C27.677,24.815,27.351,25,27,25H23z"
                      ></path>
                      <path
                        fill="#1f212b"
                        d="M61.5 25h-36c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h36c.276 0 .5.224.5.5S61.776 25 61.5 25zM73.5 25h-5c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h5c.276 0 .5.224.5.5S73.776 25 73.5 25zM66.5 25h-2c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h2c.276 0 .5.224.5.5S66.776 25 66.5 25zM50 76c-1.654 0-3-1.346-3-3V38c0-1.654 1.346-3 3-3s3 1.346 3 3v25.5c0 .276-.224.5-.5.5S52 63.776 52 63.5V38c0-1.103-.897-2-2-2s-2 .897-2 2v35c0 1.103.897 2 2 2s2-.897 2-2v-3.5c0-.276.224-.5.5-.5s.5.224.5.5V73C53 74.654 51.654 76 50 76zM62 76c-1.654 0-3-1.346-3-3V47.5c0-.276.224-.5.5-.5s.5.224.5.5V73c0 1.103.897 2 2 2s2-.897 2-2V38c0-1.103-.897-2-2-2s-2 .897-2 2v1.5c0 .276-.224.5-.5.5S59 39.776 59 39.5V38c0-1.654 1.346-3 3-3s3 1.346 3 3v35C65 74.654 63.654 76 62 76z"
                      ></path>
                      <path
                        fill="#1f212b"
                        d="M59.5 45c-.276 0-.5-.224-.5-.5v-2c0-.276.224-.5.5-.5s.5.224.5.5v2C60 44.776 59.776 45 59.5 45zM38 76c-1.654 0-3-1.346-3-3V38c0-1.654 1.346-3 3-3s3 1.346 3 3v35C41 74.654 39.654 76 38 76zM38 36c-1.103 0-2 .897-2 2v35c0 1.103.897 2 2 2s2-.897 2-2V38C40 36.897 39.103 36 38 36z"
                      ></path>
                    </svg>
                  </button>
                  <DeleteProjectModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    projectId={currentProjectId}
                    onProjectDelete={handleProjectDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsPage;
