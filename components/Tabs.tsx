import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AuthContext } from "context/Auth"
import { useContext, useState } from "react"
import Wallet from "./Wallet"

enum Tab {
    mines='Mines',
    myWallet='My Wallet'
}

const Tabs = () => {


    const { balance, purse } = useContext(AuthContext)

    const [currentTab, setCurrentTab] = useState<Tab>(Tab.myWallet)
    return (
        <div className="is-left mt-5">
            <div className="buttons has-addons">
                {/* <button className="button is-small is-dark">Yes</button> */}
                <button className={'button is-small is-dark'} style={{'textDecoration': currentTab === Tab.mines?'underline':'none'}} onClick={()=>setCurrentTab(Tab.mines)}>{Tab.mines}</button>
                <button className={'button is-small is-dark'} style={{'textDecoration': currentTab === Tab.myWallet?'underline':'none'}} onClick={()=>setCurrentTab(Tab.myWallet)}>{Tab.myWallet}</button>
            </div>

            {currentTab === Tab.myWallet && <Wallet />}

        </div>


    )
}

export default Tabs