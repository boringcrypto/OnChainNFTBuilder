import { Network, NetworkConnector } from "./Web3"
import { IGnosisSafe__factory, IGnosisSafe } from "../../typechain-types"

export type GnosisTokenBalances = {
    total: number
    tokens: {
        balance: string
        fiatBalance: string
        fiatConversion: string
        tokenInfo: {
            address: string
            decimals: number
            logoUri: string
            name: string
            symbol: string
            type: string
        }
    }[]
}

export class GnosisSafe {
    connector: NetworkConnector
    address: string
    safe: IGnosisSafe

    constructor(connector: NetworkConnector, address: string) {
        this.connector = connector
        this.address = address
        this.safe = IGnosisSafe__factory.connect(address, connector.provider)
    }

    async getOwners() {
        return await this.safe.getOwners()
    }

    async getThreshold() {
        return (await this.safe.getThreshold()).toNumber()
    }

    async getTokenBalances(): Promise<GnosisTokenBalances> {
        if (
            [
                Network.ETHEREUM,
                Network.BINANCE,
                Network.ARBITRUM,
                Network.POLYGON,
                Network.XDAI,
                Network.FUSE,
                Network.CELO,
                Network.FANTOM,
            ].indexOf(this.connector.chainId) !== -1
        ) {
            let gnosis_balances_url =
                "https://safe-client.gnosis.io/v1/chains/" +
                this.connector.chainId +
                "/safes/" +
                this.address +
                "/balances/USD?exclude_spam=true&trusted=false"
            if (this.connector.chainId === Network.FUSE) {
                gnosis_balances_url =
                    "https://safe-service.fuse.io/cgw/v1/chains/122/safes/" + this.address + "/balances/USD/?exclude_spam=true&trusted=false"
            }
            if (this.connector.chainId === Network.CELO) {
                gnosis_balances_url =
                    "https://client-gateway.celo-safe.io/v1/chains/" +
                    this.connector.chainId +
                    "/safes/" +
                    this.address +
                    "/balances/USD?exclude_spam=true&trusted=false"
            }
            if (this.connector.chainId === Network.FANTOM) {
                gnosis_balances_url =
                    "https://safe.fantom.network/v1/chains/" +
                    this.connector.chainId +
                    "/safes/" +
                    this.address +
                    "/balances/USD?exclude_spam=true&trusted=false"
            }
            const result = await (await fetch(gnosis_balances_url)).json()
            console.log("OK", this.connector.chainName, this.address, result)
            return {
                total: parseFloat(result.fiatTotal),
                tokens: result.items,
            }
        }

        if (this.connector.chainId === Network.HARMONY) {
            // API not working, get token list and scan
            return {
                total: 0,
                tokens: [],
            }
        }

        console.log("TODO:", this.connector.chainName)
        return {
            total: 0,
            tokens: [],
        }
    }
}
