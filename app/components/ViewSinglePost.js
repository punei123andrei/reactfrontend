import React, { useEffect, useState, useContext } from "react"
import Page from "./Page"
import LoadingDotsIcon from "./LoadingDotsIcon"
import Axios from "axios"
import { useParams, Link, useNavigate } from "react-router-dom"
import ReactMarkdown from 'react-markdown'
import { Tooltip } from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSinglePost() {
    const [isLoading, setIsLoading] = useState(true)
    const { id } = useParams()
    const [post, setPost] = useState()
    const appState = useContext(StateContext)
    const appDispatch = useContext(DispatchContext)
    const navigate = useNavigate()

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()
    
        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
                setPost(response.data)
                setIsLoading(false)
            } catch (e) {
                console.log("There was a problem.")
            }
        }
        fetchPost()
        return () => {
            ourRequest.cancel()
        }
    }, [])

    if (!isLoading && !post) {
        return (
            <NotFound />
        )
    }

    if (isLoading)
        return (
            <Page title="...">
                <LoadingDotsIcon />
            </Page>
        )

    const date = new Date(post.createdDate)
    const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

    function isOwner(){
        if(appState.loggedIn){
            return appState.user.username == post.author.username
        } else {
            return false
        }
    }

    async function deleteHandler(){
        const areYouSure = window.confirm('Nah')
        if(areYouSure){
            try {
                const response = await Axios.delete(`/post/${id}`, { data: appState.user.token })
                if(response.data == 'Success'){
                    appDispatch({type: "flashMessage", value: "Post was deleted"})
                    navigate(`/profile/${appState.user.username}`)
                }
            } catch (e) {
                console.log("There was a problem.")
            }
            
        }
    }

    return (
        <Page title={post.title}>
            <div className="d-flex justify-content-between">
                <h2>{post.title}</h2>
                <span className="pt-2">
                    <Link to={`/post/${post._id}/edit`} className="text-primary mr-2" data-tooltip-content="Edit" data-tooltip-id="edit">
                        <i className="fas fa-edit"></i>
                    </Link>
                    <Tooltip id="edit" className="custom-tooltip" />{" "}
                    <a onClick={deleteHandler} className="delete-post-button text-danger" data-tooltip-content="Delete" data-tooltip-id="delete" >
                        <i className="fas fa-trash"></i>
                    </a>
                    <Tooltip id="delete" className="custom-tooltip" />
                </span>
            </div>
            {isOwner() && (
                <p className="text-muted small mb-4">
                    <Link to={`/profile/${post.author.username}`}>
                        <img className="avatar-tiny" src={post.author.avatar} />
                    </Link>
                    Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
                </p>
            ) }


            <div className="body-content">
                <ReactMarkdown children={post.body} />
            </div>
        </Page>
    )
}

export default ViewSinglePost