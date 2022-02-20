<script setup lang="ts">
import { inject } from "vue"
import { networks } from "../classes/Web3"
import Data, { FactoryInfo, MultiSig, RouterInfo, WethMakerInfo } from "../data"
import SmartAddress from "../components/SmartAddress.vue"
import { GnosisSafe } from "../classes/GnosisSafe"
import { IUniswapV2Factory__factory, IUniswapV2Router01__factory, IWethMaker__factory } from "../../typechain-types"

const app = inject("app") as typeof Data

const updateWallet = async (wallet: MultiSig) => {
    const connector = new networks[wallet.network]()

    const safe = new GnosisSafe(connector, wallet.address)
    wallet.owners = await safe.getOwners()
    wallet.threshold = await safe.getThreshold()
    wallet.tokens = await safe.getTokenBalances()

    wallet.nativeBalance = await connector.provider.getBalance(wallet.address)
}

const updateRouter = async (router: RouterInfo) => {
    const connector = new networks[router.network]()

    const contract = IUniswapV2Router01__factory.connect(router.address, connector.provider)
    router.factory = await contract.factory()
}

const updateFactory = async (factory: FactoryInfo) => {
    const connector = new networks[factory.network]()

    const contract = IUniswapV2Factory__factory.connect(factory.address, connector.provider)
    factory.pairCount = (await contract.allPairsLength()).toNumber()
    factory.feeTo = await contract.feeTo()
    factory.feeToSetter = await contract.feeToSetter()
}

const updateWethMaker = async (maker: WethMakerInfo) => {
    const connector = new networks[maker.network]()

    const contract = IWethMaker__factory.connect(maker.address, connector.provider)
    maker.owner = await contract.owner()

    console.log(await connector.provider.getLogs(contract.filters.SetTrusted(null, null)))
}

// Call all these at once
;(async () => {
    for (const i in app.wallets) {
        updateWallet(app.wallets[i])
    }
})()
;(async () => {
    for (const i in app.routers) {
        updateRouter(app.routers[i])
    }
})()
;(async () => {
    for (const i in app.factories) {
        updateFactory(app.factories[i])
    }
})()
;(async () => {
    for (const i in app.wethMakers) {
        updateWethMaker(app.wethMakers[i])
    }
})()
</script>

<template>
    <div class="row">
        <div class="col-10 mx-auto">
            <h2>Multi Sigs</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Wallet</th>
                        <th scope="col">Address</th>
                        <th scope="col">Threshold</th>
                        <th scope="col">Signers</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="wallet in app.wallets">
                        <td>{{ networks[wallet.network].chainName }} {{ wallet.name }}</td>
                        <td>
                            {{ wallet.address }}
                        </td>
                        <td>{{ wallet.threshold }} of {{ wallet.owners?.length || 0 }}</td>
                        <td>
                            <span v-for="owner in wallet.owners"> <SmartAddress :address="owner" />&nbsp; </span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2>Routers</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Network</th>
                        <th scope="col">Address</th>
                        <th scope="col">Factory</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="router in app.routers">
                        <td>
                            {{ new networks[router.network]().chainName }}
                        </td>
                        <td>
                            {{ router.address }}
                        </td>
                        <td>
                            <SmartAddress :address="router.factory" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2>Factories</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Network</th>
                        <th scope="col">Pairs</th>
                        <th scope="col">Fees go to</th>
                        <th scope="col">Admin (can redirect fees)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="factory in app.factories">
                        <td>
                            <a :href="new networks[factory.network]().blockExplorerUrls[0] + 'address/' + factory.address" target="_blank">{{
                                new networks[factory.network]().chainName
                            }}</a>
                        </td>
                        <td>
                            {{ factory.pairCount }}
                        </td>
                        <td>
                            <SmartAddress :address="factory.feeTo" />
                        </td>
                        <td>
                            <SmartAddress :address="factory.feeToSetter" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2>WethMakers</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Network</th>
                        <th scope="col">Address</th>
                        <th scope="col">Admin</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="maker in app.wethMakers">
                        <td>
                            <a :href="new networks[maker.network]().blockExplorerUrls[0] + 'address/' + maker.address" target="_blank">{{
                                new networks[maker.network]().chainName
                            }}</a>
                        </td>
                        <td>
                            {{ maker.address }}
                        </td>
                        <td>
                            <SmartAddress :address="maker.owner" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped></style>
