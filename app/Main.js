import React, { useState, useReducer, useEffect } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Axios from "axios"
import { useImmerReducer } from "use-immer"

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

import Header from "./components/Header"
import HomeGuest from "./components/HomeGuest"
import Home from "./components/Home"
import Footer from "./components/Footer"
import About from "./components/About"
import Terms from "./components/Terms"
import CreatePost from "./components/CreatePost"
import ViewSinglePost from "./components/ViewSinglePost"
import FlashMessages from "./components/FlashMessages"
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import NotFound from "./components/NotFound"


Axios.defaults.baseURL = 'http://localhost:8080'

function Main() {

    const initialState = {
        loggedIn: Boolean(localStorage.getItem("complex-app-token")),
        flashMessages: [],
        user: {
            token: localStorage.getItem('complex-app-token'),
            username: localStorage.getItem('complex-app-username'),
            avatar: localStorage.getItem('complex-app-avatar')
        }
    }

    function ourReducer(draft, action) {
        switch (action.type) {
            case "login":
                draft.loggedIn = true
                draft.user = action.data
                return
            case "logout":
                draft.loggedIn = false
                return
            case "flashMessage":
                draft.flashMessages.push(action.value)
                return
        }
    }

    const [state, dispatch] = useImmerReducer(ourReducer, initialState)

    useEffect(() => {
        if (state.loggedIn) {
            localStorage.setItem('complex-app-token', state.user.token)
            localStorage.setItem('complex-app-username', state.user.username)
            localStorage.setItem('complex-app-avatar', state.user.avatar)
        } else { 
            localStorage.remove('complex-app-token', state.user.token)
            localStorage.remove('complex-app-username', state.user.username)
            localStorage.remove('complex-app-avatar', state.user.avatar)
        }
    }, [state.loggedIn])

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessages messages={state.flashMessages} />
                    <Header />
                    <Routes>
                        <Route path="/profile/:username/*" element={<Profile />}/>
                        <Route path="/" element={state.loggedIn ? <Home /> : <HomeGuest />} />
                        <Route path="/post/:id" element={<ViewSinglePost />} />
                        <Route path="/post/:id/edit" element={<EditPost />} />
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/about-us" element={<About />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </ DispatchContext.Provider>
        </StateContext.Provider>
    )
}

const root = ReactDOM.createRoot(document.querySelector("#app"))
root.render(<Main />)

if (module.hot) {
    module
}