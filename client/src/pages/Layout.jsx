import { useState, useEffect, createContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { clearJwt, getJwt, verifyData } from "../Auth/jwt";
import LetteredAvatar from "../components/LetteredAvatar";
import CreateModal from "../modals/CreateModal";

export const userContext = createContext(null);

const Layout = () => {
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState({});
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const role = currentWorkspace?.workspace_role;

  // get which page is on to decide which nav link to select
  const location = window.location.href;
  const page = location.split("/")[4];

  //is used to get a usersData from the server
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    //get the users jwt token
    const jwt = getJwt();

    //if there is no jwt token saved, navigate back to the sign in page
    if (!jwt) {
      navigate("/");
      return;
    }

    //try to hit the endpoint to get the users data
    try {
      const res = await fetch(`${apiUrl}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        },
      });

      //get the data from the response
      const { success, data } = await verifyData(res, navigate);

      //check if the request was successful, if not do an early return
      if (!success) {
        window.alert("error getting user info");
        return;
      }

      setWorkspaces(data.workspaces);
      setUser(data.user);

      //set state for last workspace the user was in if there is one.
      //use a for loop to find the index of their last workspace id
      //otherwise, set the currentworkspace to the first one in state
      if (data.user.last_workspace_id) {
        let index = 0;
        for (let i = 0; i < data.workspaces.length; i++) {
          if (data.workspaces[i].workspace_id == data.user.last_workspace_id) {
            index = i;
            break;
          }
        }
        setCurrentWorkspace(data.workspaces[index]);
      } else {
        setCurrentWorkspace(data.workspaces[0]);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  //changes workspace state then redirects to the home page.
  //also closes dropdown/offcanvas
  const switchWorkspace = (index) => {
    setCurrentWorkspace(workspaces[index]);
    updateWorkspace(workspaces[index].workspace_id);
    setShowDropdown(false);
    setShowOffCanvas(false);
    navigate("/quanta/");
  };

  //updates a users last_workspace_id whenever they switch workspaces, to keep track of what workspace they should be put in when logging in next time.
  const updateWorkspace = async (workspace_id) => {
    try {
      const jwt = getJwt();

      await fetch(`${apiUrl}/workspace/update-last`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: jwt,
        },
        body: JSON.stringify({ workspace_id }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  //toggles the offcanvas on mobile
  const toggleOffCanvas = () => {
    setShowOffCanvas((prev) => !prev);
  };

  //toggles the drop down for changing workspace on mobile and desktop
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  //is used to sign out and clear a users jwt token thats saved to local storage
  const handleSignout = () => {
    clearJwt();
    navigate("/");
  };

  const workspaceElems = workspaces.map((item, index) => {
    return (
      <button key={item.workspace_id} onClick={() => switchWorkspace(index)}>
        <p className="text-xl py-[5px]">{item.workspace_name}</p>
      </button>
    );
  });

  return (
    <>
      {/* header */}
      <div className="relative z-10 h-[60px] shadow-md px-[10px] flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={toggleOffCanvas} className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40px"
              height="40px"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="#63276a"
                strokeLinecap="round"
                strokeWidth={1.5}
                d="M20 7H4m16 5H4m16 5H4"
              ></path>
            </svg>
          </button>
          <Link to="/quanta/timetracker">
            <p className="ml-2 text-3xl text-darkpurple">Quanta</p>
          </Link>
          {/* dropdown button desktop view */}
          <button
            className="hidden ml-[70px] items-center md:flex"
            onClick={toggleDropdown}
          >
            <p className="text-3xl">
              {currentWorkspace ? currentWorkspace.workspace_name : null}
            </p>
            <svg
              className={`${!showDropdown && "transform rotate-90"} ml-[10px]`}
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="black"
                d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569z"
              ></path>
            </svg>
          </button>
          {/* button drop down */}
          <div
            className={`${
              !showDropdown ? "" : "md:flex"
            } hidden w-auto max-h-[200px] px-[20px]  border absolute left-[185px] top-[45px] bg-white flex-col`}
          >
            {workspaceElems}
          </div>
        </div>
        {/* profile picture */}
        <Link to="/quanta/profile">
          {user.username && <LetteredAvatar name={user.username} />}
        </Link>
      </div>
      {/* body wrapper */}
      <div className="h-[calc(100vh-60px)] relative overflow-x-auto">
        {/* offcanvas - mobile view*/}
        <div
          className={`${
            showOffCanvas ? "left-0" : "left-[-250px]"
          } transition-all absolute w-[250px]  bg-lightpurple-login h-[100%] flex flex-col justify-between md:hidden pl-[10px] py-[10px] z-50`}
        >
          <div>
            {/* drop down for workspace selection mobile view*/}
            <div className="flex justify-between items-center mx-[14px] mb-[5px]">
              <p className="text-3xl">
                {currentWorkspace ? currentWorkspace.workspace_name : null}
              </p>
              <button
                onClick={toggleDropdown}
                className={`${
                  !showDropdown && "transform rotate-90"
                } transition-all`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#f1f5f9"
                    d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569z"
                  ></path>
                </svg>
              </button>
            </div>
            {/* list workspaces here mobile view*/}
            <div
              className={`${
                showDropdown ? "h-auto" : "h-0"
              } mr-[10px] border-b-2 border-slate-100 transition-all flex flex-col items-start overflow-hidden px-[14px]`}
            >
              {workspaceElems}
            </div>
            {/* links to navigate to other pages */}
            <Link
              className="flex items-center text-3xl mt-[20px] pl-[10px]"
              to="/quanta/"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 8 8"
              >
                <path
                  fill="currentColor"
                  d="M2 0v1h1v.03A3.503 3.503 0 0 0 3.5 8C5.43 8 7 6.43 7 4.5c0-.45-.1-.87-.25-1.25l-.91.38c.11.29.16.57.16.88c0 1.39-1.11 2.5-2.5 2.5S1 5.9 1 4.51s1.11-2.5 2.5-2.5c.3 0 .59.05.88.16l.34-.94c-.23-.08-.47-.12-.72-.16v-.06h1v-1H2zm5 1.16s-3.65 2.81-3.84 3c-.19.2-.19.49 0 .69c.19.2.49.2.69 0c.2-.2 3.16-3.69 3.16-3.69z"
                />
              </svg>
              <p className="pl-[10px]">Timer</p>
            </Link>
            <Link
              className="flex items-center text-3xl mt-[20px] pl-[10px]"
              to="/quanta/projects"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="black"
                  d="M8 18q-.825 0-1.412-.587T6 16v-1q0-.425.288-.712T7 14t.713.288T8 15v1h12V6H8v1q0 .425-.288.713T7 8t-.712-.288T6 7V4q0-.825.588-1.412T8 2h12q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-4 4q-.825 0-1.412-.587T2 20V7q0-.425.288-.712T3 6t.713.288T4 7v13h13q.425 0 .713.288T18 21t-.288.713T17 22zm9.175-10H7q-.425 0-.712-.288T6 11t.288-.712T7 10h6.175l-.9-.9Q12 8.825 12 8.413t.3-.713q.275-.275.7-.275t.7.275l2.6 2.6q.3.3.3.7t-.3.7l-2.6 2.6q-.275.275-.687.288T12.3 14.3q-.275-.275-.275-.7t.275-.7z"
                ></path>
              </svg>
              <p className="pl-[10px]">Projects</p>
            </Link>
            { role === "Admin" || role === "Creator" ?
            <>
              <Link
                className="flex items-center text-3xl mt-[20px] pl-[10px]"
                to="/quanta/users"
                >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                  >
                  <path
                    fill="currentColor"
                    d="M117.25 157.92a60 60 0 1 0-66.5 0a95.83 95.83 0 0 0-47.22 37.71a8 8 0 1 0 13.4 8.74a80 80 0 0 1 134.14 0a8 8 0 0 0 13.4-8.74a95.83 95.83 0 0 0-47.22-37.71M40 108a44 44 0 1 1 44 44a44.05 44.05 0 0 1-44-44m210.14 98.7a8 8 0 0 1-11.07-2.33A79.83 79.83 0 0 0 172 168a8 8 0 0 1 0-16a44 44 0 1 0-16.34-84.87a8 8 0 1 1-5.94-14.85a60 60 0 0 1 55.53 105.64a95.83 95.83 0 0 1 47.22 37.71a8 8 0 0 1-2.33 11.07"
                    />
                </svg>
                <p className="pl-[10px]">Users</p>
              </Link>
              <Link
                className="flex items-center text-3xl mt-[20px] pl-[10px]"
                to="/quanta/audit-log"
                >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="m213.66 82.34l-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V88a8 8 0 0 0-2.34-5.66M160 51.31L188.69 80H160ZM200 216H56V40h88v48a8 8 0 0 0 8 8h48zm-45.54-48.85a36.05 36.05 0 1 0-11.31 11.31l11.19 11.2a8 8 0 0 0 11.32-11.32ZM104 148a20 20 0 1 1 20 20a20 20 0 0 1-20-20"
                  ></path>
                </svg>
                <p className="pl-[10px]">Audit</p>
              </Link>
            </>
            : null}
          
          {/* WorkSpaces on the Mobile View  */}
          <p className="text-3xl border-b-2 border-slate-100 py-2 mt-5 mr-[10px] pl-[10px]">Workspaces</p>
        
            <button
              onClick={() => setModalOpen(true)}
              className=" flex  items-center text-3xl mt-[20px]  px-[10px] "
            >
              <svg
                className="svg2"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 1200 1200"
              >
                <path
                  fill="black"
                  d="M600 0C268.629 0 0 268.629 0 600s268.629 600 600 600s600-268.629 600-600S931.371 0 600 0m-95.801 261.841h191.602v242.358h242.358v191.602H695.801v242.358H504.199V695.801H261.841V504.199h242.358z"
                />
              </svg>
              <p className="pl-[10px]">Create</p>
            </button>
            <CreateModal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
            />
            <button className=" flex flex-wrap items-center text-3xl mt-[10px] py-2 px-[10px]">
              <svg
                className="svg2"
                xmlns="http://www.w3.org/2000/svg"
                width="1.1em"
                height="1.2em"
                viewBox="0 0 64 64"
              >
                <path
                  fill="currentColor"
                  d="M32 2C15.432 2 2 15.432 2 32c0 16.568 13.432 30 30 30s30-13.432 30-30C62 15.432 48.568 2 32 2m1.693 46V37.428H15V27.143h18.693V16L49 32z"
                />
              </svg>
              <p className=" pl-[10px] ">Join</p>
            </button>
          </div>
          <button
            onClick={handleSignout}
            className="flex items-center text-3xl mt-[20px] pl-[10px] p-2 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="black"
                d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
              ></path>
            </svg>
            <p className="pl-[10px]">Logout</p>
          </button>
        </div>
        <div className="flex min-h-[100%]">
          {/* sidebar - desktop view*/}
          <div className="hidden min-w-[180px] min-h-[100%] py-[20px] flex-col justify-between md:flex">
            <div id="link-menu">
              <Link
                className={` ${
                  page === "" ? "bg-lightpurple-selected" : null
                }
                                        flex items-center text-2xl p-[10px] hover:bg-lightpurple-selected`}
                to="/quanta/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 8 8"
                >
                  <path
                    fill="currentColor"
                    d="M2 0v1h1v.03A3.503 3.503 0 0 0 3.5 8C5.43 8 7 6.43 7 4.5c0-.45-.1-.87-.25-1.25l-.91.38c.11.29.16.57.16.88c0 1.39-1.11 2.5-2.5 2.5S1 5.9 1 4.51s1.11-2.5 2.5-2.5c.3 0 .59.05.88.16l.34-.94c-.23-.08-.47-.12-.72-.16v-.06h1v-1H2zm5 1.16s-3.65 2.81-3.84 3c-.19.2-.19.49 0 .69c.19.2.49.2.69 0c.2-.2 3.16-3.69 3.16-3.69z"
                  />
                </svg>
                <p className="pl-[10px]">Timer</p>
              </Link>
              <Link
                className={` ${
                  page === "projects" ? "bg-lightpurple-selected" : null
                }
                                        flex items-center text-2xl p-[10px] hover:bg-lightpurple-selected`}
                to="/quanta/projects"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="black"
                    d="M8 18q-.825 0-1.412-.587T6 16v-1q0-.425.288-.712T7 14t.713.288T8 15v1h12V6H8v1q0 .425-.288.713T7 8t-.712-.288T6 7V4q0-.825.588-1.412T8 2h12q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-4 4q-.825 0-1.412-.587T2 20V7q0-.425.288-.712T3 6t.713.288T4 7v13h13q.425 0 .713.288T18 21t-.288.713T17 22zm9.175-10H7q-.425 0-.712-.288T6 11t.288-.712T7 10h6.175l-.9-.9Q12 8.825 12 8.413t.3-.713q.275-.275.7-.275t.7.275l2.6 2.6q.3.3.3.7t-.3.7l-2.6 2.6q-.275.275-.687.288T12.3 14.3q-.275-.275-.275-.7t.275-.7z"
                  ></path>
                </svg>
                <p className="pl-[10px]">Projects</p>
              </Link>
              {role === "Admin" || role === "Creator" ? (
                <>
                <Link
                  className={` ${
                    page === "users" ? "bg-lightpurple-selected" : null
                  }
                  flex items-center text-2xl  p-[10px] hover:bg-lightpurple-selected`}
                  to="/quanta/users"
                  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 256 256"
                    >
                    <path
                      fill="currentColor"
                      d="M117.25 157.92a60 60 0 1 0-66.5 0a95.83 95.83 0 0 0-47.22 37.71a8 8 0 1 0 13.4 8.74a80 80 0 0 1 134.14 0a8 8 0 0 0 13.4-8.74a95.83 95.83 0 0 0-47.22-37.71M40 108a44 44 0 1 1 44 44a44.05 44.05 0 0 1-44-44m210.14 98.7a8 8 0 0 1-11.07-2.33A79.83 79.83 0 0 0 172 168a8 8 0 0 1 0-16a44 44 0 1 0-16.34-84.87a8 8 0 1 1-5.94-14.85a60 60 0 0 1 55.53 105.64a95.83 95.83 0 0 1 47.22 37.71a8 8 0 0 1-2.33 11.07"
                      />
                  </svg>
                  <p className="pl-[10px]">Users</p>
                </Link>
                <Link
                  className={` ${
                    page === "audit-log" ? "bg-lightpurple-selected" : null
                  } flex items-center text-2xl p-[10px] hover:bg-lightpurple-selected`}
                  to="/quanta/audit-log"
                  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 256 256"
                    >
                    <path
                      fill="currentColor"
                      d="m213.66 82.34l-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V88a8 8 0 0 0-2.34-5.66M160 51.31L188.69 80H160ZM200 216H56V40h88v48a8 8 0 0 0 8 8h48zm-45.54-48.85a36.05 36.05 0 1 0-11.31 11.31l11.19 11.2a8 8 0 0 0 11.32-11.32ZM104 148a20 20 0 1 1 20 20a20 20 0 0 1-20-20"
                      ></path>
                  </svg>
                  <p className="pl-[10px] text-2xl">Audit</p>
                </Link>
              </>
               ) : null} 
              <p className="text-2xl border-b-2 border-lightpurple-login py-2 mt-5 mx-[10px] pl-[5px]">Workspaces</p>
          <button  
          onClick={() => setModalOpen(true)}
          className =" flex  items-center text-2xl py-2 px-[10px] hover:bg-lightpurple-selected w-[100%]">
            <svg
                className="svg2"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 1200 1200"
              >
                <path
                  fill="black"
                  d="M600 0C268.629 0 0 268.629 0 600s268.629 600 600 600s600-268.629 600-600S931.371 0 600 0m-95.801 261.841h191.602v242.358h242.358v191.602H695.801v242.358H504.199V695.801H261.841V504.199h242.358z"
                />
              </svg>
              <p className="pl-[10px]">Create</p> 
              </button>
              <CreateModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
              />
              <button className=" flex flex-wrap items-center text-2xl py-2 px-[10px] hover:bg-lightpurple-selected w-[100%]">
                <svg
                  className="svg2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.1em"
                  height="1.2em"
                  viewBox="0 0 64 64"
                >
                  <path
                    fill="currentColor"
                    d="M32 2C15.432 2 2 15.432 2 32c0 16.568 13.432 30 30 30s30-13.432 30-30C62 15.432 48.568 2 32 2m1.693 46V37.428H15V27.143h18.693V16L49 32z"
                  />
                </svg>
                <p className=" pl-[10px] ">Join</p>
              </button>
            </div>

            <button
              onClick={handleSignout}
              className="flex items-center text-3xl pl-[10px] hover:text-red-600 hover:fill-red-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"></path>
              </svg>
              <p className="pl-[10px]">Logout</p>
            </button>
          </div>
          <div className="bg-lightpurple-body w-[100%]">
            {/* Changed the value so the key is undefined instead of the whole context */}
            {!loading ? (
              <userContext.Provider
                value={{
                  workspace: currentWorkspace ? currentWorkspace : undefined,
                  user: user,
                }}
              >
                <Outlet />
              </userContext.Provider>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
