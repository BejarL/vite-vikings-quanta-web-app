import {useState , useEffect, useContext} from  'react';
import { workspaceContext } from './Layout';
import { useNavigate } from 'react-router-dom'
import { getJwt, verifyData } from '../Auth/jwt';

const HomePage = () => {
    const [recentProjects, setRecentProjects] = useState([]);
    const workspace = useContext(workspaceContext);

    console.log(recentProjects)

    const navigate = useNavigate();

    useEffect(() =>{
        handleGetRecent();
    }, []);

    //fetches the recent projects
    const handleGetRecent = async () => {
        const jwt = getJwt();

        try {
            const res = await fetch("http://localhost:3000/projects/recent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": jwt
                }, 
                body: JSON.stringify({
                    "workspace_id": workspace.workspace_id
                })
            })

            // checks only for jwt errors. if there are errors, navigate to sign in
            // if no error, gets data
            const { success, data } = await verifyData(res, navigate);
    
            if (success) {
                setRecentProjects(data);
            }

        } catch (err) {
            console.log(err);
        }
    }

    const recentElems = recentProjects.map(project => {
        return (
            <button key={project.project_id} 
                className="flex flex-col items-center justify-center m-[10px] max-w-sm min-w-[200px] min-h-[150px] bg-white border border-white-200 rounded-lg shadow hover:bg-white-100 dark:bg-white-800 dark:border-white-700 dark:hover:bg-violet-100">
                    <h5 className="mb-2  font-bold text-black-900 dark:text-black">
                        
                    </h5>
                    <p className="font-bold text-white-700 dark:text-white-400">{project.project_name}</p>
                </button> 
        )
    })

    return (
    <div>
        <div className=" flex flex-wrap justify-evenly m-[50px] md:justify-start">
            <div className="m-[10px]">
                <button className="flex flex-col items-center justify-center max-w-sm min-w-[200px] min-h-[150px] bg-white border border-white-200 rounded-lg shadow hover:bg-white-100 dark:bg-white-800 dark:border-white-700 dark:hover:bg-violet-100">
                    <h5 className="mb-2  font-bold text-black-900 dark:text-black">
                        <svg className="svg2" xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 1200 1200"><path fill="black" d="M600 0C268.629 0 0 268.629 0 600s268.629 600 600 600s600-268.629 600-600S931.371 0 600 0m-95.801 261.841h191.602v242.358h242.358v191.602H695.801v242.358H504.199V695.801H261.841V504.199h242.358z"/>
                        </svg>
                    </h5>
                <p className="font-bold text-white-700 dark:text-white-400">create workspace</p>
                </button> 
            </div>
            <div className="m-[10px]">    
                <button className="flex flex-col items-center justify-center min-w-[200px] min-h-[150px] max-w-sm bg-white border border-white-200 rounded-lg shadow hover:bg-white-100 dark:bg-white-800 dark:border-white-700 dark:hover:bg-violet-100">
                    <h5 className=" mb-2  font-bold  text-black-900 dark:text-black">
                        <svg className="svg2"xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 64 64"><path fill="currentColor" d="M32 2C15.432 2 2 15.432 2 32c0 16.568 13.432 30 30 30s30-13.432 30-30C62 15.432 48.568 2 32 2m1.693 46V37.428H15V27.143h18.693V16L49 32z"/>
                        </svg>
                    </h5>
                <p className="font-bold text-white-700 dark:text-white-400">Join a workspace</p>
                </button> 
            </div>
        </div>
    <h1 className="font-bold text-3xl md:text-4xl m-[20px]"> Recent Projects</h1>
    <div className="flex flex-wrap justify-center m-[50px] md:justify-start">
        {recentElems}
    </div>
    

</div>
    )
}

export default HomePage;