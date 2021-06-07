import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AuthContext } from "context/Auth"
import { useContext, useState } from "react"

const style = {}

const Login = () => {


    const { balance, refreshBalance, email: loggedInEmail, isAuthenticated, authenticate, deauthenticate } = useContext(AuthContext)

    const [loading, setLoading] = useState<boolean>()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const login = () => {
        authenticate(email, password)
    }


    return (
        isAuthenticated
            ? <div className="is-flex is-align-items-center is-justify-content-space-between">
                <div className="tags has-addons mr-2">
                    <span className="tag is-dark">Balance</span>
                    <span className="tag is-success">{balance} BSV</span>
                    <span onClick={() => {
                        setLoading(true)
                        refreshBalance()
                        setTimeout(() => {
                            setLoading(false)
                        }, 5000)
                    }} className="tag is-light" style={{cursor: 'pointer'}}>
                        {!loading ? 'Refresh' : 'Refreshing...'}
                    </span>
                </div>

                <div className="is-flex is-align-items-center">

                    <p className="is-size-7 mr-2 has-text-grey-light">Logged in as <span className="has-text-white">{loggedInEmail}</span> </p>
                    <button onClick={() => deauthenticate()} className="button is-dark is-small">Logout</button>

                </div>


            </div>
            : <form noValidate style={{ width: '300px' }}>

                <div className="field">
                    <p className="control has-icons-left has-icons-right">
                        <input
                            defaultValue={email}
                            required
                            type='email'
                            onChange={(e: any) => setEmail(e.target.value)}
                            className="input is-small has-text-white has-background-dark"
                            placeholder="Email" />

                        <span className="icon is-left has-text-grey">
                            <FontAwesomeIcon width="15" height="15" icon={["fas", "envelope"]} />
                        </span>
                        <span className="icon is-small is-right">
                            <i className="fas fa-check"></i>
                        </span>
                    </p>
                </div>
                <div className="field">
                    <p className="control has-icons-left">
                        <input
                            defaultValue={password}
                            required
                            type='password'
                            onChange={(e: any) => setPassword(e.target.value)}
                            className="input is-small has-text-white has-background-dark"
                            placeholder="Password" />
                        <span className="icon is-small is-left has-text-grey">
                            <FontAwesomeIcon width="15" height="15" icon={["fas", "lock"]} />
                        </span>
                    </p>
                </div>
                <div className="is-flex mb-2">
                    <p className="text-white is-size-7 has-text-left">BSV-Minesweeper provide non-custodial a web wallet that enables users to have a simple sign in. Please backup your email and password before proceeding.</p>
                </div>
                <div className="field is-grouped">
                    <div className="control">
                        <button type="button" onClick={() => login()} className="button is-link is-small">Login</button>
                    </div>
                </div>

            </form>

    )
}

export default Login