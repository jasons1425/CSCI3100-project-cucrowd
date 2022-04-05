import React from 'react'
import * as Cg from "react-icons/cg";
import * as Ai from "react-icons/ai";
import * as Ri from "react-icons/ri";
import icon from './whitelogo1.png'
import * as Fi from "react-icons/fi";
import './sidebar.css';

const Sidebardata=[
    {
        title:"Home",
        icon:<Ai.AiFillHome />,
        path:'/',
    },
    {
        title:"Experiments",
        icon:<Ai.AiTwotoneExperiment />,
        path:'/experiments',
    },
    {
        title:"Questionnaires",
        icon: <Ri.RiNewspaperLine />,
        path:"/question",
    },
    {
        title:"Team Formation",
        icon:<Ri.RiTeamFill />,
        path:"/team",
    }, 
    {
        title:"Profile",
        icon:<Cg.CgProfile />,
        path:"/profile",
    },
]
function Sidebar() {
    return (
        <>
            <div className='Sidebar'>
                <div className='photo' onClick={()=>{window.location.pathname='/';}}><img src={icon} width="80%" height="10%"></img></div>
                    <hr className='upperline'/>
                    <ul className="SidebarContainer"> 
                        {Sidebardata.map((item, index) => {
                            return (
                                <li index={index} className="list" id={window.location.pathname==item.path ? "active" : ""} onClick={()=>{window.location.pathname=item.path;}}>
                                    <div id="icon">{item.icon}</div>
                                    <div id="title">{item.title}</div>
                                </li>    
                            );
                        })}
                        <hr className='bottomline'/>
                        <li className="profile" onClick={()=>{window.location.pathname='/logout';}}>
                            <div id="proicon"><Fi.FiLogOut /></div>
                            <div id="protitle">Logout</div>
                        </li>
                    </ul>
            </div>
        </>
    )
}

export default Sidebar