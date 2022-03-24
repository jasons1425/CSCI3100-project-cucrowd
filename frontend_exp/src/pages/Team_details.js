import './Team_details.css'
import * as Ri from "react-icons/ri";
import {useState, useEffect} from 'react'; 
import axios from 'axios';



function Team_details() {
  const [data, setData] = useState();
  const [get, setGet] = useState(false);
  const [error, setError] = useState(false);

  /*useEffect(() => {
    axios
        .get("")
        .then((res) => {
          setData(res.data);
          setGet(true);
        })
        .catch((err) => {
          setError(true)
        })
  })

  if(error){
    return <div className="team_details">Error</div>;
  }*/

  return (
    <div className="team_details">
      <header className="team_header">
        <div className="team_icon">
          <Ri.RiTeamFill />
        </div>
        <div className="team_title">
          Team Formation
        </div>
      </header>

      <div className="team_space">
        &nbsp;
      </div>
        <div className="team_details_content">
          <section className="team_details_top">
            <div className="team_details_info">
              <h1><b>Title</b></h1>
              <p>post closing date</p>
              <p>duration</p>
            </div>
            <aside className="team_details_vacancy">
              <p>
                remaining <br/>vacancy:
              </p>
              <p className="team_details_number">3</p>
            </aside>
          </section>
          <aside className="team_details_team_member">
            <h3>Team member</h3>
            <table>
              <tbody>
                <tr>
                  <td>1155142376</td>
                  <td>Year 3</td>
                  <td>Computer Science</td>
                </tr>
                <tr>
                  <td>1122334455</td>
                  <td>Year 3</td>
                  <td>Business</td>
                </tr>
              </tbody>
            </table>
          </aside>
          <section className="team_details_purpose">
            Purpose
          </section>
          <section className="self_intro">
            Contact
          </section>
          <button className="team_join_button">Join</button>     
        </div>
    </div>
  )
}
  
  export default Team_details;