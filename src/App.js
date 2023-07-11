import logo from './logo.svg';
import './App.css';
import {draftList} from './AllPlayers.js'
import * as React from "react";

const {useEffect, useState} = React;

function App() {


  const [tempDraftList, setTempDraftList] = useState(draftList);
  const [playerSelect, setPlayerSelect] = useState("No Player Selected");
  const [player, setPlayer] = useState('');
  const [team, setTeam] = useState('');
  const [position, setPosition] = useState('');
  const [tempDraftListCopy, setTempDraftListCopy] = useState(draftList);
  const [tempDraftListReset, setTempDraftListReset] = useState(draftList);
  const [searchPlayer, setSearchPlayer] = useState('');
  const [searchTeam, setSearchTeam] = useState('');
  const [searchPos, setSearchPos] = useState('');
  const [auctionTime, setAuctionTime] = useState(5);
  const [totalBid, setTotalBid] = useState(0);
  const [bidDisabled, setBidDisabled] = useState(1);
  const [selectDisabled, setSelectDisabled] = useState(0);
  const [yourTeam, setYourTeam] = useState([]);
  const [intervalFinished, setIntervalFinished] = useState(false);
  const [posMax, setPosMax] = useState([]);
  const [totalBudgetRemaining, setTotalBudgetRemaining] = useState(100);
  const [posID, setPosID] = useState(0);

  const handleFilterPlayer = (event) => {

    setTempDraftList(tempDraftListCopy.filter(item => item.Player.toLowerCase().includes(event.target.value.toLowerCase()) | item.Player.toLowerCase() == (event.target.value.toLowerCase())))
    setSearchPlayer(event.target.value)
    if(event.target.value === ''){
      setTempDraftList(tempDraftListReset)
    }

  }

  const resetDraftListPlayer = () => {

    setTempDraftList(tempDraftListReset)
    setSearchPlayer('')

  }


  const handleFilterTeam = (event) => {

    setTempDraftList(tempDraftListCopy.filter(item => item.Team.toLowerCase().includes(event.target.value.toLowerCase()) | item.Team.toLowerCase() == (event.target.value.toLowerCase())))
    setSearchTeam(event.target.value)
    if(event.target.value === ''){
      setTempDraftList(tempDraftListReset)
    }
    console.log(event.target.value)

  }

  const resetDraftListTeam = () => {

    setTempDraftList(tempDraftListReset)
    setSearchTeam('')

  }


  const handleFilterPos = (event) => {

    setTempDraftList(tempDraftListCopy.filter(item => item.Pos.toLowerCase().includes(event.target.value.toLowerCase()) | item.Pos.toLowerCase() == (event.target.value.toLowerCase())))
    setSearchPos(event.target.value)
    if(event.target.value === ''){
      setTempDraftList(tempDraftListReset)
    }
    console.log(event.target.value)

  }

  const resetDraftListPos = () => {

    setTempDraftList(tempDraftListReset)
    setSearchPos('')

  }

  const auctionTimer = () => {

      const interval2 = setInterval(() => {
        setAuctionTime((prevtime) => {
          const updatedTime = prevtime - 1;
          if(updatedTime <= 0){
            clearInterval(interval2)
            setBidDisabled(1)
            setSelectDisabled(0)
            setIntervalFinished(true)
          }
          return updatedTime
        })
      }, 1000)

  }

  const addPlayer = () => {

    setIntervalFinished(false)
    //check your team total number of positions button
    if(position === "GK" & yourTeam.filter(item => item.Pos === "GK").length === 1){
      setPosMax([...posMax, position])
    }
    if(position === "FWD" & yourTeam.filter(item => item.Pos === "FWD").length === 2){
      setPosMax([...posMax, position])
    }
    if(position === "MID" & yourTeam.filter(item => item.Pos === "MID").length === 4){
      setPosMax([...posMax, position])
    }
    if(position === "DEF" & yourTeam.filter(item => item.Pos === "DEF").length === 4){
      setPosMax([...posMax, position])
    }
    setYourTeam([...yourTeam, {Player: player, Team: team, Pos: position, Cost: totalBid, PositionID: posID}])
    setTotalBudgetRemaining(totalBudgetRemaining-totalBid)

  }

  useEffect(() => {
    if(intervalFinished){
      setTimeout(() => {
        addPlayer();
      }, 1000);
    }
  }, [intervalFinished])




  const DisplayData=tempDraftList.map(
    (info)=>{
        return(
            <tr>
                <td>{info.Rank}</td>
                <td>{info.Player}</td>
                <td>{info.Team}</td>
                <td>{info.Pos}</td>
                <td><button class = "sel-button" onClick = {() => {
                  setTempDraftList(tempDraftListReset.filter(item => item.Player !== info.Player))
                  setTempDraftListCopy(tempDraftListReset.filter(item => item.Player !== info.Player))
                  setTempDraftListReset(tempDraftListReset.filter(item => item.Player !== info.Player))
                  setPlayerSelect(`${info.Player}, ${info.Pos}, ${info.Team}`)
                  setPlayer(info.Player)
                  setTeam(info.Team)
                  setPosition(info.Pos)
                  setAuctionTime(5)
                  auctionTimer()
                  setBidDisabled(0)
                  setSelectDisabled(1)
                  setTotalBid(1)
                  if(info.Pos === "GK"){
                    setPosID(4)
                  }
                  if(info.Pos === "DEF"){
                    setPosID(3)
                  }
                  if(info.Pos === "MID"){
                    setPosID(2)
                  }
                  if(info.Pos === "FWD"){
                    setPosID(1)
                  }
                  // if info.Pos === no pos, return true to disabled
                }} disabled = {selectDisabled||posMax.includes(info.Pos)}>
                  SELECT
                </button></td>
            </tr>
        )
      }
    )

    const SortTable = (a, b) => {
      return (a < b) ? -1 : (a > b) ? 1 : 0
    }

    // const SortTable = (a, b) => {
      
    //   if(a.attributes.Pos == b.attributes.OBJECTID)
    //       return 0;
    //   if(a.attributes.OBJECTID < b.attributes.OBJECTID)
    //       return -1;
    //   if(a.attributes.OBJECTID > b.attributes.OBJECTID)
    //       return 1;
    // }

    const DisplayTeam=yourTeam.sort((a,b) => {
      return(SortTable(a.PositionID, b.PositionID))
    }).map(
      (x)=>{
          return(
              <tr>
                  <td>{x.Player}</td>
                  <td>{x.Pos}</td>
                  <td>{x.Cost}</td>                 
              </tr>
          )
      }
    )

  return (
    <div className="App">
      <div>
        <p>AUCTION BOARD</p>
      </div>

      <div class = "container">
        <div class = "select-player-table">
          <table class = "table table-bordered">
              <thead>
                  <tr>
                  <th>Rank</th>
                  <th>Player <form><input type = "text" placeholder='filter...' value = {searchPlayer} onChange = {handleFilterPlayer}></input></form><button onClick = {resetDraftListPlayer}>reset</button></th>
                  <th>Team <form><input type = "text" placeholder='filter...' value = {searchTeam} onChange = {handleFilterTeam}></input></form><button onClick = {resetDraftListTeam}>reset</button></th>
                  <th>Pos <form><input type = "text" placeholder='filter...' value = {searchPos} onChange = {handleFilterPos}></input></form><button onClick = {resetDraftListPos}>reset</button></th>
                  <th>Nominate</th>
                  </tr>
              </thead>
              <tbody>
                {DisplayData}
              </tbody>
          </table>
        </div>


        <div class = "auction-center">
          <div>
            <p> PLAYER UP FOR AUCTION </p>
            <p> {playerSelect} </p> 
            <button onClick = {() => {
              setAuctionTime(5)
              setTotalBid(totalBid+1)
              // if position is in the no player list you also have to put it in disabled
              // max bid is budget - players remaining-1, so if you had 200, your max bid is 35-14 = 21
              // so 20 bid on the first player, so 35-14-20 is 1, and you can bid 1 more
              // spent 4, so totalbudget remaining is 31-13 = 18
            }} disabled = {bidDisabled||posMax.includes(position)||totalBudgetRemaining-(15-yourTeam.length-1)-totalBid <= 0}> place bid </button>
            <p>Total Bid: ${totalBid}</p>
            <p>Maximum Bid: ${totalBudgetRemaining-(15-yourTeam.length-1)}</p>
            <p>Remaining Budget: ${totalBudgetRemaining}</p>
            <p>FWD: {yourTeam.filter(item => item.Pos === "FWD").length}/3&emsp;MID: {yourTeam.filter(item => item.Pos === "MID").length}/5&emsp;DEF: {yourTeam.filter(item => item.Pos === "DEF").length}/5&emsp;GK: {yourTeam.filter(item => item.Pos === "GK").length}/2</p>


            <div class = "team-card">
              <p> Your Team </p>
              <table class = "yourTeamtable">
              <thead>
                  <tr>
                  <th>Player</th>
                  <th>Pos</th>
                  <th>Cost</th>
                  </tr>
              </thead>
              <tbody>
                {DisplayTeam}
              </tbody>
          </table>
            </div>

          </div>

          <div class = "auction-timer">
            {auctionTime}
          </div>


        </div>


      </div>

    </div>

  );
}

export default App;
