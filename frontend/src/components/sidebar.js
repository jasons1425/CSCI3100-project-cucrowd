import React from 'react'
import * as Cg from "react-icons/cg";
import * as Ai from "react-icons/ai";
import * as Ri from "react-icons/ri";
import icon from './whitelogo1.png'
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
]

function Sidebar() {
    return (
        <>
            <div className='Sidebar'>
                <div className='photo'><img src={icon} width="200" height="50"></img></div>
                    <hr/>
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
                        <li className="profile" onClick={()=>{window.location.pathname='/profile';}}>
                            <div id="proicon"><Cg.CgProfile /></div>
                            <div id="protitle">Profile</div>
                        </li>
                    </ul>
            </div>
        </>
    )
}

export default Sidebar