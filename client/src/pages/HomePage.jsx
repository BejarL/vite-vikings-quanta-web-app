import './HomePage.css';
import react from 'react';
import {useState , useEffect} from  'react';

const HomePage = () => {
    // const [RecentProjects, setRecentProjects] = useState([]);
    // useEffect(() =>{
    //     const getProjects= async ()=>
    //     try{
    //         const res = await 
    //     }
    //     catch{

    //     }
    // });
    return (
<div>
        <div class=" cards ">
            <div class=" card1">
                <button class=" block max-w-sm  p-10 bg-white border border-white-200 rounded-lg shadow hover:bg-white-100 dark:bg-white-800 dark:border-white-700 dark:hover:bg-violet-100">
                    <h5 class="mb-2  font-bold tracking-tight text-black-900 dark:text-black">
                        <svg class="svg2" xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 1200 1200"><path fill="currentColor" d="M600 0C268.629 0 0 268.629 0 600s268.629 600 600 600s600-268.629 600-600S931.371 0 600 0m-95.801 261.841h191.602v242.358h242.358v191.602H695.801v242.358H504.199V695.801H261.841V504.199h242.358z"/>
                        </svg>
                    </h5>
                <p class="font-bold text-white-700 dark:text-white-400">create workspace</p>
                </button> 
        </div>
            <div class=" card2">    
                <button class="block max-w-sm p-10 bg-white border border-white-200 rounded-lg shadow hover:bg-white-100 dark:bg-white-800 dark:border-white-700 dark:hover:bg-violet-100">
                    <h5 class=" mb-2  font-bold tracking-tight text-black-900 dark:text-black">
                        <svg class="svg2"xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 64 64"><path fill="currentColor" d="M32 2C15.432 2 2 15.432 2 32c0 16.568 13.432 30 30 30s30-13.432 30-30C62 15.432 48.568 2 32 2m1.693 46V37.428H15V27.143h18.693V16L49 32z"/>
                        </svg>
                    </h5>
                <p class="font-bold text-white-700 dark:text-white-400">Join a workspace</p>
                </button> 
            </div>
        </div>
    <h1 class="text1"> Recent Projects</h1>
    

</div>
    )
}

export default HomePage;