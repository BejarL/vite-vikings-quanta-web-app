import { useState } from "react"
import { Outlet } from "react-router-dom"

const Layout = () => {
    const [selected, setSelected] = useState(0)
    const [showOffCanvas, setShowOffCanvas] = useState(false);

    const toggleOffCanvas = () => {
        setShowOffCanvas(prev => !prev);
    }
    
    return (
        <>
        {/* header */}
        <div className="h-[60px] shadow-md px-[10px] flex items-center justify-between">
            <div className="flex items-center">
                <button
                    onClick={toggleOffCanvas}
                    className="md:hidden"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24"><path fill="none" stroke="#63276a" strokeLinecap="round" strokeWidth={1.5} d="M20 7H4m16 5H4m16 5H4"></path></svg>
                </button>
                <p className="ml-2 text-3xl text-darkpurple">Quanta</p>
            </div>
            <img
                alt="profile-picture"
                className="border w-[50px] h-[50px] rounded-full"
            >
            </img>
        </div>
        {/* body wrapper */}
        <div className="h-[calc(100vh-60px)] relative">
            {/* offcanvas - mobile view*/}
            <div className={`${showOffCanvas ? "left-0" : "left-[-250px]"} transition-all absolute w-[250px] bg-lightpurple-login h-[100%] flex flex-col md:hidden`}>
                <div className="flex items-center text-3xl my-[20px] pl-[10px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="black" d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1"></path></svg>
                    <p className="pl-[10px]">Home</p>
                </div>
                
            </div>
            {/* sidebar - desktop view*/}
            <div>

            </div>
            <Outlet />
        </div>
        </>

    )
}

export default Layout;