import React from 'react';

function TimeTrackerPage() {
    return (
        <div className="bg-DCB6FA flex flex-col min-h-screen">
            {/* topbar */}
            <div className="bg-white text-black py-4 px-8 flex justify-between items-center shadow border border-gray-300 rounded mb-2">
                <div className="text-xl font-bold">Quanta</div>
                <button className="bg-white text black p-4 py-2 rounded-md flex items-center">  <svg fill="#000000" width="24px" height="24px" viewBox="0 0 24 24" id="user" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" className="icon flat-color mr-2">
            <path id="primary" d="M21,20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2,6,6,0,0,1,6-6h6A6,6,0,0,1,21,20Zm-9-8A5,5,0,1,0,7,7,5,5,0,0,0,12,12Z" style={{ fill: 'rgb(0, 0, 0)' }}></path>
            </svg> 
            User Name</button>
            </div>
            {/* content*/}
            <div className="flex flex-1">
                {/*sidebar*/}
                <div className="bg-white w-full md:w-1/4 p-4 flex flex-col justify-between shadow border border-gray-300 rounded md:mr-2">
                    <div className="flex flex-col mt-8">
                    {/* home button */}
                        <button className="bg-gray text-black p-4 py-2rounded-md mb-2 hover:bg-lightpurple flex items-center">
                         <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50" className="fill-current mr-2">
                        <path d="M 25 1.0507812 C 24.7825 1.0507812 24.565859 1.1197656 24.380859 1.2597656 L 1.3808594 19.210938 C 0.95085938 19.550938 0.8709375 20.179141 1.2109375 20.619141 C 1.5509375 21.049141 2.1791406 21.129062 2.6191406 20.789062 L 4 19.710938 L 4 46 C 4 46.55 4.45 47 5 47 L 19 47 L 19 29 L 31 29 L 31 47 L 45 47 C 45.55 47 46 46.55 46 46 L 46 19.710938 L 47.380859 20.789062 C 47.570859 20.929063 47.78 21 48 21 C 48.3 21 48.589063 20.869141 48.789062 20.619141 C 49.129063 20.179141 49.049141 19.550938 48.619141 19.210938 L 25.619141 1.2597656 C 25.434141 1.1197656 25.2175 1.0507812 25 1.0507812 z M 35 5 L 35 6.0507812 L 41 10.730469 L 41 5 L 35 5 z"></path>
                        </svg> Home</button>
                       {/*timer button */} 
                       <button className="bg-gray text-black p-4 py-2 rounded-md mb-2 hover:bg-lightpurple flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="24" height="24" className="mr-2">
                        <path fill="#231f20" d="M19 7.5a.5.5 0 0 0 .5.5h3a.51.51 0 0 0 .5-.34l1-3a.5.5 0 0 0-.34-.66.5.5 0 0 0-.63.31l-.73 2.22A11.49 11.49 0 1 0 12.5 24a11.59 11.59 0 0 0 11-8.18.5.5 0 0 0-.34-.63.5.5 0 0 0-.62.34A10.5 10.5 0 1 1 12.5 2a10.46 10.46 0 0 1 8.92 5H19.5a.5.5 0 0 0-.5.5z"/>
                    <path fill="#231f20" d="M12 6.5v7.1l-4.84 4.53a.51.51 0 0 0 0 .71.5.5 0 0 0 .34.16.48.48 0 0 0 .34-.13l5-4.69a.48.48 0 0 0 .16-.36V6.5a.5.5 0 0 0-1 0z"/>
                    </svg>
                    <span>Timer</span>
                    </button>
                       
                       {/* Dashboard button */} 
                        <button className="bg-gray text-black p-4 py-2 rounded-md mb-2 hover:bg-lightpurple flex items-center">
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"/>
                            </svg>
                            Dashboard
                        </button>
                        
                        {/* project button */}
                        <button className="bg-gray text-black border border-gray p-4 py-2 rounded-md mr-2 flex items-center">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2"/>
                        </svg>
                        Projects</button>
                       
                        {/* calendar button */}
                        <button className="bg-gray text-black p-4 py-2rounded-md mb-2 hover:bg-lightpurple flex items-center">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
                        </svg>

                        Calendar</button>
                    </div>
                   {/*logout button*/}
                    <button className="bg-white text-black p-4 py-2 rounded-md flex items-center"> <svg width="24" height="24" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" class="icon mr-2">
                    <path d="M868 732h-70.3c-4.8 0-9.3 2.1-12.3 5.8-7 8.5-14.5 16.7-22.4 24.5a353.84 353.84 0 0 1-112.7 75.9A352.8 352.8 0 0 1 512.4 866c-47.9 0-94.3-9.4-137.9-27.8a353.84 353.84 0 0 1-112.7-75.9 353.28 353.28 0 0 1-76-112.5C167.3 606.2 158 559.9 158 512s9.4-94.2 27.8-137.8c17.8-42.1 43.4-80 76-112.5s70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 7.9 7.9 15.3 16.1 22.4 24.5 3 3.7 7.6 5.8 12.3 5.8H868c6.3 0 10.2-7 6.7-12.3C798 160.5 663.8 81.6 511.3 82 271.7 82.6 79.6 277.1 82 516.4 84.4 751.9 276.2 942 512.4 942c152.1 0 285.7-78.8 362.3-197.7 3.4-5.3-.4-12.3-6.7-12.3zm88.9-226.3L815 393.7c-5.3-4.2-13-.4-13 6.3v76H488c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 0 0 0-12.6z"/>
                    </svg>Logout</button>
                </div>
                
                
                
                <div className="shadow-lg border border-gray-300 rounded p-4 flex-1">
                {/* tracking */}
                <div className="shadow-lg border border-gray-300 rounded p-4 flex-1 md:mb-4">
                    <div className="flex flex-wrap md:mb-4">
                        <input type="text" placeholder="Description" className="border border-gray300 p-4 py-2 rounded-md mr-2 flex-1" />
                        <select className="border border-gray-300 px-4 py-2 rounded-md  mr-2">
                            <option value="">Project</option>
                            <option value="">Project 1</option>
                            <option value="">Project 2</option>
                            <option value="">Project 3</option>
                        </select>
                        
                        
                        {/* Timer */}
                        <div className="border border-gray p-4 py-2 rounded-md mr-2">00:00:00</div>
                        
                        {/* Play Button */}
                        <button className="bg-gray text-black p-4 py-2 rounded-md mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-current">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            
                        </button>
                        
                        {/* add button */}
                        <button className="bg-white text-black p-4 py-2 rounded-md flex items-center">
                        <svg width="24px" height="24px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                         <path d="M7.5 1V14M1 7.5H14" stroke="#000000"/>
                        </svg>
                        </button>
                        
                        {/* Delete Button */}
                        <button className="bg-gray text-black p-4 py-2 rounded-md ">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="w-6 h-6 mr-2">
                                <path d="M21 2C19.354545 2 18 3.3545455 18 5L18 7L8 7A1.0001 1.0001 0 1 0 8 9L9 9L9 45C9 46.654 10.346 48 12 48L38 48C39.654 48 41 46.654 41 45L41 9L42 9A1.0001 1.0001 0 1 0 42 7L32 7L32 5C32 3.3545455 30.645455 2 29 2L21 2zM21 4L29 4C29.554545 4 30 4.4454545 30 5L30 7L20 7L20 5C20 4.4454545 20.445455 4 21 4zM19 14C19.552 14 20 14.448 20 15L20 40C20 40.553 19.552 41 19 41C18.448 41 18 40.553 18 40L18 15C18 14.448 18.448 14 19 14zM25 14C25.552 14 26 14.448 26 15L26 40C26 40.553 25.552 41 25 41C24.448 41 24 40.553 24 40L24 15C24 14.448 24.448 14 25 14zM31 14C31.553 14 32 14.448 32 15L32 40C32 40.553 31.553 41 31 41C30.447 41 30 40.553 30 40L30 15C30 14.448 30.447 14 31 14z"></path>
                            </svg>
                            
                        </button>
                    </div>
                    </div>
                    <div className="shadow-lg border border-gray-300 rounded p-4 flex-1">
                    {/* tracking 2 */}
            <div className="p-4">
        <div className="flex flex-wrap mb-4">
            <input type="text" placeholder="Description" className="border border-gray300 p-4 py-2 rounded-md mr-2 flex-1" />
            <select className="border border-gray-300 p-4 py-2 rounded-md mr-2">
                <option value="">Project</option>
                <option value="">Project 1</option>
                <option value="">Project 2</option>
                <option value="">Project 3</option>
            </select>
            
            {/* Timer */}
            <div className="border border-gray p-4 py-2 rounded-md mr-2">00:00:00</div>
            
            {/* Play Button */}
            <button className="bg-gray text-black p-4 py-2 rounded-md mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-current">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </button>
            
            {/* add button */}
            <button className="bg-white text-black p-4 py-2 rounded-md flex items-center">
                <svg width="24px" height="24px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                    <path d="M7.5 1V14M1 7.5H14" stroke="#000000"/>
                </svg>
            </button>
            
            {/* Delete Button */}
            <button className="bg-gray text-black p-4 py-2 rounded-md ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="w-6 h-6 mr-2">
                    <path d="M21 2C19.354545 2 18 3.3545455 18 5L18 7L8 7A1.0001 1.0001 0 1 0 8 9L9 9L9 45C9 46.654 10.346 48 12 48L38 48C39.654 48 41 46.654 41 45L41 9L42 9A1.0001 1.0001 0 1 0 42 7L32 7L32 5C32 3.3545455 30.645455 2 29 2L21 2zM21 4L29 4C29.554545 4 30 4.4454545 30 5L30 7L20 7L20 5C20 4.4454545 20.445455 4 21 4zM19 14C19.552 14 20 14.448 20 15L20 40C20 40.553 19.552 41 19 41C18.448 41 18 40.553 18 40L18 15C18 14.448 18.448 14 19 14zM25 14C25.552 14 26 14.448 26 15L26 40C26 40.553 25.552 41 25 41C24.448 41 24 40.553 24 40L24 15C24 14.448 24.448 14 25 14zM31 14C31.553 14 32 14.448 32 15L32 40C32 40.553 31.553 41 31 41C30.447 41 30 40.553 30 40L30 15C30 14.448 30.447 14 31 14z"></path>
                </svg>
            </button>
            </div>
            </div>
                
        
                 </div>
                    </div>
                    </div>
                </div>
        
    );
}

export default TimeTrackerPage;
