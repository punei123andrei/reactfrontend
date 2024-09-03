import Page from "./Page"
import { Link } from "react-router-dom"

function NotFound() {
    return (
        <Page title="Not Found">
            <div className="text-center">
                <h2>You cannot find that page</h2>
                <p className="lead text-muted">You can manage <Link to="/">here</Link></p>
            </div>
        </Page>
    )
}

export default NotFound