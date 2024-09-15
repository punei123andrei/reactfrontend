import React, { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import { Tooltip } from "react-tooltip"

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  function handleLogout() {
    appDispatch({ type: "logout" })
  }

  function handleSearchIcon(e) {
    e.preventDefault()
    appDispatch({ type: "openSearch" })
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <a data-tooltip-id="search" data-tooltip-content="Search" onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <Tooltip place="bottom" id="search" class="custom-tooltip" />
      {" "}<span onClick={() => appDispatch({type: "toggleChat"})} data-for="chat" data-tooltip-id="chat" data-tooltip-content="Chat" className={"mr-2 header-chat-icon " + (appState.unreadChatCount ? "text-danger" : "text-white" )}>
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? <span className="chat-count-badge text-white">{appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+" } </span> : ""}
      </span>
      <Tooltip place="bottom" id="chat" class="custom-tooltip" />
      {" "} <Link data-tooltip-id="profile" data-tooltip-content="Profile" to={`/profile/${appState.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <Tooltip place="bottom" id="profile" class="custom-tooltip" />
      {" "}<Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      {" "}<button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  )
}

export default HeaderLoggedIn
