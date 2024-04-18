import React from 'react';

function TimeTrackerPage() {
    return (
        <>
           
            {/* content*/}
            <div className="flex min-h-screen">
                
                <div className="shadow-lg border border-gray-300 min-w-320 rounded p-4 w-full ">
                {/* tracking */}
                <div className="shadow-lg border bg-white border-gray-300 min-w-[320px] rounded p-4 md:mb-4 grid grid-cols-2 md:grid-cols-1">
                    <div className="flex flex-wrap md:mb-4 grid-cols-4 col-span-2">
                        <input type="text" placeholder="Description" className="border bg-lightpurple w-full placeholder-gray-950 border-gray300 p-4 py-2 rounded-md mr-2 my-2 md:w-4/4 lg:w-1/3" />
                        <select className="border border-gray-300 px-4 py-2 rounded-md w-3/4 mr-2 my-2 md:w-2/5 lg:w-1/4">
                            <option value="">Project</option>
                            <option value="">Project 1</option>
                            <option value="">Project 2</option>
                            <option value="">Project 3</option>
                        </select>
                        
                        
                       {/* add button */}
                        <button className="bg-white text-black p-1 py-2 rounded-md flex items-center md:order-last ">
                        <svg width="24px" height="24px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                         <path d="M7.5 1V14M1 7.5H14" stroke="#000000"/>
                        </svg>
                        </button>
                        
                        {/* Timer */}
                        <div className="border border-gray p-4 py-2 w-3/4 min-w-[201px] rounded-md mr-2 my-2 md:w-1/4 lg:w-1/5 lg:mr-auto">00:00:00</div>
                       {/* Play Button */}
                       <button className="bg-gray text-black p-2 py-2 rounded-md mr-2 md:order-3 ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-current">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            </button>
                        
                    </div>
                    </div> 








                    {/* Title of Entry Table */}
                    <p className="p-4 text-xl">Recent</p>
                    
                    {/* Entry Table */}
                    <div className="shadow-lg border bg-white border-gray-300 min-w-[320px] rounded-lg md:mb-4 grid grid-cols-2 md:grid-cols-1">
                    <div className="flex flex-wrap md:mb-4 grid-cols-4 col-span-2">
                        <div className="w-full bg-lightpurple-login p-2 pl-6 rounded-t-lg mb-0.5">Today</div>
                        <input type="text" placeholder="Description" className="border bg-lightpurple w-1/2 placeholder-gray-950 border-gray300 ml-2 p-4 py-2 rounded-md mr-2 my-2 lg:w-1/4" />
                        <select className="border border-gray-300 px-4 py-2 rounded-md w-2/5 mr-2 my-2 lg:w-1/4 ">
                            <option value="">Project</option>
                            <option value="">Project 1</option>
                            <option value="">Project 2</option>
                            <option value="">Project 3</option>
                        </select>
                        
                        
                        
                        {/* Start time */}
                        <input type="text" placeholder="3:00pm" className="border border-gray p-4 ml-2 py-2 w-2/5  rounded-md mr-2 my-2 md:w-1/5 lg:w-[8%] "/>
                        
                        {/* End time */}
                        <input type="text" placeholder="3:00pm" className="border border-gray p-4 ml-2 py-2 w-2/5 rounded-md mr-2 my-2 md:w-1/5 lg:w-[8%] "/>
                       
                       {/* Date */}
                       <input type="text" placeholder="3/26/24" className="border border-gray p-4 ml-2 py-2 w-2/6 rounded-md mr-2 my-2 md:w-1/5 lg:w-[8%]"/>
                       
                       {/* Hours Tracked */}
                       <div className="border border-gray p-4 ml-2 py-2 w-2/6 rounded-md mr-2 my-2 md:w-1/6 lg:w-[8%] lg:mr-auto">1.5hrs</div>
                       
                        {/* Delete button */}
                       <button className="bg-gray text-black p-2 py-2 rounded-md mr-1 md:order-3  ">
                       <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1zM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7zm12-1V5h-4l-1-1h-3L9 5H5v1zM8 9h1v10H8zm6 0h1v10h-1z"/></svg>
                            </button>
                        
                    </div>
                    </div> 
                    
                    </div>
                    </div>
                </>
        
    );
}

export default TimeTrackerPage;
