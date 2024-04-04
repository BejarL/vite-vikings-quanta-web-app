import { useState } from "react"
import { Outlet } from "react-router-dom"

const Layout = () => {
    const [selected, setSelected] = useState(0)
    
    return (
        <>
        {/* header */}
        <div className="">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#63276a" strokeLinecap="round" strokeWidth={1.5} d="M20 7H4m16 5H4m16 5H4"></path></svg>
        </div>
        {/* sidebar */}
        <Outlet />
        </>

    )
}

export default Layout;