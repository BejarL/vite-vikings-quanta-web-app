import { useState, createContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { clearJwt } from "../Auth/jwt";

const workspaceContext = createContext(null);

const Layout = () => {
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [workspace, setWorkspace] = useState({ id: 1, name: "Quanta" });

  const navigate = useNavigate();

  // get which page is on to decide which nav link to select
  const location = window.location.href;
  const page = location.split("/")[4];

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
          <p className="ml-2 text-3xl text-darkpurple">Quanta</p>
          <button
            className="hidden ml-[70px] items-center md:flex"
            onClick={toggleDropdown}
          >
            <p className="text-2xl">{workspace.name}</p>
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
              !showDropdown ? "" : "md:block"
            } hidden w-[500px] h-[100px] border absolute left-[185px] top-[45px] bg-white`}
          ></div>
        </div>
        {/* profile picture */}
        <img
          alt="profile-picture"
          className="border w-[50px] h-[50px] rounded-full"
        ></img>
      </div>
      {/* body wrapper */}
      <div className="h-[calc(100vh-60px)] relative">
        {/* offcanvas - mobile view*/}
        <div
          className={`${
            showOffCanvas ? "left-0" : "left-[-250px]"
          } transition-all absolute w-[250px] bg-lightpurple-login h-[100%] flex flex-col justify-between md:hidden pl-[10px] py-[10px]`}
        >
          <div>
            {/* drop down for workspace selection */}
            <div className="flex justify-between items-center mx-[14px] mb-[5px]">
              <p className="text-3xl">{workspace.name}</p>
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
            {/* list workspaces here */}
            <div
              className={`${
                showDropdown ? "h-[200px]" : "h-0"
              } mr-[10px] border-b-2 border-slate-100 transition-all`}
            ></div>
            {/* links to navigate to other pages */}
            <Link
              className="flex items-center text-3xl mt-[20px] pl-[10px]"
              to="/quanta/"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="black"
                  d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1"
                ></path>
              </svg>
              <p className="pl-[10px]">Home</p>
            </Link>
            <Link
              className="flex items-center text-3xl mt-[20px] pl-[10px]"
              to="/quanta/timetracker"
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
          </div>
          <button
            onClick={handleSignout}
            className="flex items-center text-3xl mt-[20px] pl-[10px]"
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
        <div className="flex h-[100%]">
          {/* sidebar - desktop view*/}
          <div className="hidden min-w-[180px] h-[100%] py-[20px] flex flex-col justify-between md:flex">
            <div id="link-menu">
              <Link
                className={` ${page === "" ? "bg-lightpurple-selected" : null}
                                        flex items-center text-3xl mt-[20px] p-[10px] hover:bg-lightpurple-selected`}
                to="/quanta/"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="black"
                    d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1"
                  ></path>
                </svg>
                <p className="pl-[10px]">Home</p>
              </Link>
              <Link
                className={` ${
                  page === "timetracker" ? "bg-lightpurple-selected" : null
                }
                                        flex items-center text-3xl mt-[20px] p-[10px] hover:bg-lightpurple-selected`}
                to="/quanta/timetracker"
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
                                        flex items-center text-3xl mt-[20px] p-[10px] hover:bg-lightpurple-selected`}
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
              <Link
                className={` ${
                  page === "users" ? "bg-lightpurple-selected" : null
                }
                                        flex items-center text-3xl mt-[20px] p-[10px] hover:bg-lightpurple-selected`}
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
            </div>
            <button
              onClick={handleSignout}
              className="flex items-center text-3xl mt-[20px] pl-[10px]"
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
          <div className="bg-lightpurple-body w-[100%]">
            <workspaceContext.Provider value={workspace}>
              <Outlet />
            </workspaceContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
