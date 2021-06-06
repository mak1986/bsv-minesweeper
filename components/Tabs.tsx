import { AuthContext } from "context/Auth"
import { useContext, useState } from "react"
import MinePanel from "./MinePanel"
import WalletPanel from "./WalletPanel"

enum Tab {
    myMines = 'My Mines',
    myWallet = 'My Wallet'
}

const Tabs = () => {


    const { balance, purse } = useContext(AuthContext)

    const [currentTab, setCurrentTab] = useState<Tab>(Tab.myMines)
    return (
        <div className="is-left mt-5">
            <div className="buttons has-addons">
                {/* <button className="button is-small is-dark">Yes</button> */}
                <button className={'button is-small is-dark'} style={{ 'textDecoration': currentTab === Tab.myMines ? 'underline' : 'none' }} onClick={() => setCurrentTab(Tab.myMines)}>{Tab.myMines}</button>
                <button className={'button is-small is-dark'} style={{ 'textDecoration': currentTab === Tab.myWallet ? 'underline' : 'none' }} onClick={() => setCurrentTab(Tab.myWallet)}>{Tab.myWallet}</button>
            </div>

            {currentTab === Tab.myMines && <MinePanel />}
            {currentTab === Tab.myWallet && <WalletPanel />}

        </div>
    )
}

export default Tabs