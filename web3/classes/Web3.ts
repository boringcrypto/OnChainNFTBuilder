import { ProviderMessage, ProviderRpcError, ProviderConnectInfo } from "hardhat/types"
import { BigNumber, ethers, providers } from "ethers"
import { computed, ComputedRef, defineComponent, defineCustomElement, markRaw, reactive, ref, Ref, shallowRef } from "vue"

export interface EthereumEvent {
    connect: ProviderConnectInfo
    disconnect: ProviderRpcError
    accountsChanged: Array<string>
    chainChanged: string
    message: ProviderMessage
}

type EventKeys = keyof EthereumEvent
type EventHandler<K extends EventKeys> = (event: EthereumEvent[K]) => void

export interface Ethereumish {
    autoRefreshOnNetworkChange: boolean
    chainId: string
    isMetaMask?: boolean
    isStatus?: boolean
    networkVersion: string
    selectedAddress: any

    on<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): void
    enable(): Promise<any>
    request?: (request: { method: string; params?: Array<any> }) => Promise<any>
}

declare global {
    interface Window {
        ethereum: Ethereumish
    }
}

interface ConnectInfo {
    chainId: string
}

export enum Network {
    NONE = 0,
    ETHEREUM = 1,
    ROPSTEN = 3,
    KOVAN = 42,
    RINKEBY = 4,
    GOERLI = 5,
    BINANCE = 56,
    OKEX_TEST = 65,
    OKEX = 66,
    BINANCE_TEST = 98,
    FUSE = 122,
    POLYGON = 137,
    POLYGON_TEST = 80001,
    XDAI = 100,
    HUOBI = 128,
    HUOBI_TEST = 256,
    ARBITRUM = 42161,
    ARBITRUM_TEST = 421611,
    AVALANCHE = 43114,
    AVALANCHE_TEST = 43113,
    TOMO = 88,
    TOMO_TEST = 89,
    FANTOM = 250,
    FANTOM_TEST = 4002,
    MOONBEAM_KUSAMA = 1285,
    MOONBEAM_TEST = 1287,
    HARDHAT = 31337,
    CELO = 42220,
    HARMONY = 1666600000,
    HARMONY_TEST = 1666700000,
    PALM = 11297108109,
    TELOS = 40,
}

export class NetworkConnector {
    provider: providers.Provider
    static get chainId(): Network {
        return Network.NONE
    }
    static get chainName(): string {
        return "None"
    }
    static get nativeCurrency(): { name: string; symbol: string; decimals: number } {
        return { name: "None", symbol: "NONE", decimals: 18 }
    }
    static get rpcUrls(): string[] {
        return []
    }
    static get blockExplorerUrls(): string[] {
        return []
    }

    // Add the static values to each instance
    get type() {
        return this.constructor as typeof NetworkConnector
    }
    get chainId() {
        return this.type.chainId
    }
    get chainName() {
        return this.type.chainName
    }
    get nativeCurrency() {
        return this.type.nativeCurrency
    }
    get rpcUrls() {
        return this.type.rpcUrls
    }
    get blockExplorerUrls() {
        return this.type.blockExplorerUrls
    }

    constructor(provider?: providers.Provider | null) {
        if (provider) {
            // Use provided provider (for instance injected MetaMask web3)
            this.provider = provider
        } else {
            // or create one using the RPC Url
            this.provider = new providers.JsonRpcProvider(this.rpcUrls[0])
        }
    }
}

class EthereumConnector extends NetworkConnector {
    static get chainId() {
        return Network.ETHEREUM
    }
    static get chainName() {
        return "Ethereum"
    }
    static get nativeCurrency() {
        return { name: "Ethereum", symbol: "ETH", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://mainnet.infura.io/v3/845b3e08e20a41f185f36a2b73cfa5e4"]
    }
    static get blockExplorerUrls() {
        return ["https://etherscan.io/"]
    }
}

class RopstenConnector extends EthereumConnector {
    static get chainId() {
        return Network.ROPSTEN
    }
    static get chainName() {
        return "Ropsten"
    }
    static get rpcUrls() {
        return ["https://ropsten.infura.io/v3/845b3e08e20a41f185f36a2b73cfa5e4"]
    }
    static get blockExplorerUrls() {
        return ["https://ropsten.etherscan.io/"]
    }
}

class KovanConnector extends EthereumConnector {
    static get chainId() {
        return Network.KOVAN
    }
    static get chainName() {
        return "Kovan"
    }
    static get rpcUrls() {
        return ["https://kovan.infura.io/v3/845b3e08e20a41f185f36a2b73cfa5e4"]
    }
    static get blockExplorerUrls() {
        return ["https://kovan.etherscan.io/"]
    }
}

class RinkebyConnector extends EthereumConnector {
    static get chainId() {
        return Network.RINKEBY
    }
    static get chainName() {
        return "Rinkeby"
    }
    static get rpcUrls() {
        return ["https://rinkeby.infura.io/v3/845b3e08e20a41f185f36a2b73cfa5e4"]
    }
    static get blockExplorerUrls() {
        return ["https://rinkeby.etherscan.io/"]
    }
}

class GoerliConnector extends EthereumConnector {
    static get chainId() {
        return Network.GOERLI
    }
    static get chainName() {
        return "Görli"
    }
    static get rpcUrls() {
        return ["https://goerli.infura.io/v3/845b3e08e20a41f185f36a2b73cfa5e4"]
    }
    static get blockExplorerUrls() {
        return ["https://goerli.etherscan.io/"]
    }
}

class BinanceConnector extends NetworkConnector {
    static get chainId() {
        return Network.BINANCE
    }
    static get chainName() {
        return "Binance Smart Chain"
    }
    static get nativeCurrency() {
        return { name: "BNB", symbol: "BNB", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://bsc-dataseed.binance.org/"]
    }
    static get blockExplorerUrls() {
        return ["https://bscscan.com/"]
    }
}

class BinanceTestConnector extends BinanceConnector {
    static get chainId() {
        return Network.BINANCE_TEST
    }
    static get chainName() {
        return "Binance Smart Chain Testnet"
    }
    static get rpcUrls() {
        return ["https://data-seed-prebsc-1-s1.binance.org:8545/"]
    }
    static get blockExplorerUrls() {
        return ["https://testnet.bscscan.com/"]
    }
}

class FuseConnector extends NetworkConnector {
    static get chainId() {
        return Network.FUSE
    }
    static get chainName() {
        return "Fuse"
    }
    static get nativeCurrency() {
        return { name: "Fuse", symbol: "FUSE", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://rpc.fuse.io/"]
    }
    static get blockExplorerUrls() {
        return ["https://explorer.fuse.io/"]
    }
}

class PolygonConnector extends NetworkConnector {
    static get chainId() {
        return Network.POLYGON
    }
    static get chainName() {
        return "Polygon"
    }
    static get nativeCurrency() {
        return { name: "MATIC", symbol: "MATIC", decimals: 18 }
    }
    static get rpcUrls() {
        return [
            "https://matic-mainnet.chainstacklabs.com/",
            "https://rpc-mainnet.matic.network/",
            "https://rpc-mainnet.maticvigil.com/",
            "https://rpc-mainnet.matic.quiknode.pro/",
            "https://matic-mainnet-full-rpc.bwarelabs.com/",
            "https://matic-mainnet-archive-rpc.bwarelabs.com/",
        ]
    }
    static get blockExplorerUrls() {
        return [
            "https://polygonscan.com/",
            "https://polygon-explorer-mainnet.chainstacklabs.com/",
            "https://explorer-mainnet.maticvigil.com/",
            "https://explorer.matic.network/",
            "https://backup-explorer.matic.network/",
        ]
    }
}

class PolygonTestConnector extends PolygonConnector {
    static get chainId() {
        return Network.POLYGON_TEST
    }
    static get chainName() {
        return "Mumbai (Polygon Testnet)"
    }
    static get rpcUrls() {
        return [
            "https://matic-mumbai.chainstacklabs.com/",
            "https://rpc-mumbai.matic.today/",
            "https://rpc-mumbai.maticvigil.com/",
            "https://matic-testnet-archive-rpc.bwarelabs.com/",
        ]
    }
    static get blockExplorerUrls() {
        return [
            "https://mumbai.polygonscan.com/",
            "https://polygon-explorer-mumbai.chainstacklabs.com/",
            "https://explorer-mumbai.maticvigil.com/",
            "https://mumbai-explorer.matic.today/",
            "https://backup-mumbai-explorer.matic.today/",
        ]
    }
}

class GnosisConnector extends NetworkConnector {
    static get chainId() {
        return Network.XDAI
    }
    static get chainName() {
        return "Gnosis (xDai)"
    }
    static get nativeCurrency() {
        return { name: "xDai", symbol: "xDAI", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://rpc.gnosischain.com/"]
    }
    static get blockExplorerUrls() {
        return ["https://blockscout.com/xdai/mainnet/"]
    }
}

class HuobiConnector extends NetworkConnector {
    static get chainId() {
        return Network.HUOBI
    }
    static get chainName() {
        return "Heco"
    }
    static get nativeCurrency() {
        return { name: "HT", symbol: "HT", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://http-mainnet-node.huobichain.com/"]
    }
    static get blockExplorerUrls() {
        return ["https://www.hecochain.io/", "https://hecoinfo.com/"]
    }
}

class HuobiTestConnector extends HuobiConnector {
    static get chainId() {
        return Network.HUOBI_TEST
    }
    static get chainName() {
        return "Heco Testnet"
    }
    static get rpcUrls() {
        return ["https://http-testnet.hecochain.com/"]
    }
    static get blockExplorerUrls() {
        return ["https://scan-testnet.hecochain.com/"]
    }
}

class ArbitrumConnector extends EthereumConnector {
    static get chainId() {
        return Network.ARBITRUM
    }
    static get chainName() {
        return "Arbitrum"
    }
    static get rpcUrls() {
        return ["https://arb1.arbitrum.io/rpc/"]
    }
    static get blockExplorerUrls() {
        return ["https://arbiscan.io/"]
    }
}

class ArbitrumTestConnector extends ArbitrumConnector {
    static get chainId() {
        return Network.ARBITRUM_TEST
    }
    static get chainName() {
        return "Arbitrum Testnet"
    }
    static get rpcUrls() {
        return ["https://rinkeby.arbitrum.io/rpc/"]
    }
    static get blockExplorerUrls() {
        return ["https://rinkeby-explorer.arbitrum.io/"]
    }
}

class AvalancheConnector extends NetworkConnector {
    static get chainId() {
        return Network.AVALANCHE
    }
    static get chainName() {
        return "Avalanche Mainnet C-Chain"
    }
    static get nativeCurrency() {
        return { name: "Avalanche", symbol: "AVAX", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://api.avax.network/ext/bc/C/rpc"]
    }
    static get blockExplorerUrls() {
        return ["https://cchain.explorer.avax.network/"]
    }
}

class AvalancheTestConnector extends AvalancheConnector {
    static get chainId() {
        return Network.AVALANCHE_TEST
    }
    static get chainName() {
        return "Avalanche Testnet C-Chain"
    }
    static get rpcUrls() {
        return ["https://api.avax-test.network/ext/bc/C/rpc/"]
    }
    static get blockExplorerUrls() {
        return ["https://cchain.explorer.avax-test.network/"]
    }
}

class TomoConnector extends NetworkConnector {
    static get chainId() {
        return Network.TOMO
    }
    static get chainName() {
        return "TomoChain"
    }
    static get nativeCurrency() {
        return { name: "TOMO", symbol: "TOMO", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://rpc.tomochain.com/"]
    }
    static get blockExplorerUrls() {
        return ["https://scan.tomochain.com/"]
    }
}

class TomoTestConnector extends TomoConnector {
    static get chainId() {
        return Network.TOMO_TEST
    }
    static get chainName() {
        return "TomoChain Testnet"
    }
    static get rpcUrls() {
        return ["https://rpc.testnet.tomochain.com/"]
    }
    static get blockExplorerUrls() {
        return ["https://scan.testnet.tomochain.com/"]
    }
}

class FantomConnector extends NetworkConnector {
    static get chainId() {
        return Network.FANTOM
    }
    static get chainName() {
        return "Fantom Opera"
    }
    static get nativeCurrency() {
        return { name: "FTM", symbol: "FTM", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://rpc.ftm.tools/"]
    }
    static get blockExplorerUrls() {
        return ["https://ftmscan.com/"]
    }
}

class FantomTestConnector extends FantomConnector {
    static get chainId() {
        return Network.FANTOM
    }
    static get chainName() {
        return "Fantom Testnet"
    }
    static get rpcUrls() {
        return ["https://rpc.testnet.fantom.network/"]
    }
    static get blockExplorerUrls() {
        return []
    }
}

class MoonbeamTestConnector extends NetworkConnector {
    static get chainId() {
        return Network.MOONBEAM_TEST
    }
    static get chainName() {
        return "Moonbase Alpha"
    }
    static get nativeCurrency() {
        return { name: "DEV", symbol: "DEV", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://rpc.api.moonbase.moonbeam.network"]
    }
    static get blockExplorerUrls() {
        return ["https://moonbase-blockscout.testnet.moonbeam.network/"]
    }
}

class MoonbeamKusamaConnector extends NetworkConnector {
    static get chainId() {
        return Network.MOONBEAM_KUSAMA
    }
    static get chainName() {
        return "Moonriver"
    }
    static get nativeCurrency() {
        return { name: "MOVR", symbol: "MOVR", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://rpc.api.moonriver.moonbeam.network"]
    }
    static get blockExplorerUrls() {
        return ["https://blockscout.moonriver.moonbeam.network/"]
    }
}

class HardhatConnector extends EthereumConnector {
    static get chainId() {
        return Network.HARDHAT
    }
    static get chainName() {
        return "Hardhat"
    }
    static get rpcUrls() {
        return ["http://127.0.0.1:8545/"]
    }
    static get blockExplorerUrls() {
        return []
    }
}

class CeloConnector extends NetworkConnector {
    static get chainId() {
        return Network.CELO
    }
    static get chainName() {
        return "Celo"
    }
    static get nativeCurrency() {
        return { name: "Celo", symbol: "CELO", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://forno.celo.org"]
    }
    static get blockExplorerUrls() {
        return ["https://explorer.celo.org/"]
    }
}

class HarmonyConnector extends NetworkConnector {
    static get chainId() {
        return Network.HARMONY
    }
    static get chainName() {
        return "Harmony"
    }
    static get nativeCurrency() {
        return { name: "Harmony", symbol: "ONE", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://api.harmony.one"]
    }
    static get blockExplorerUrls() {
        return ["https://explorer.harmony.one/"]
    }
}

class HarmonyTestConnector extends HarmonyConnector {
    static get chainId() {
        return Network.HARMONY_TEST
    }
    static get chainName() {
        return "Harmony Testnet"
    }
    static get rpcUrls() {
        return ["https://api.s0.b.hmny.io/"]
    }
    static get blockExplorerUrls() {
        return ["https://explorer.pops.one/"]
    }
}

class OKExConnector extends NetworkConnector {
    static get chainId() {
        return Network.OKEX
    }
    static get chainName() {
        return "OKExChain"
    }
    static get nativeCurrency() {
        return { name: "OEC Token", symbol: "OKT", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://exchainrpc.okex.org/"]
    }
    static get blockExplorerUrls() {
        return ["https://www.oklink.com/oec/"]
    }
}

class OKExTestConnector extends OKExConnector {
    static get chainId() {
        return Network.OKEX_TEST
    }
    static get chainName() {
        return "OKExChain Testnet"
    }
    static get rpcUrls() {
        return ["https://exchaintestrpc.okex.org/"]
    }
    static get blockExplorerUrls() {
        return ["https://www.oklink.com/oec-test/"]
    }
}

class PalmConnector extends NetworkConnector {
    static get chainId() {
        return Network.PALM
    }
    static get chainName() {
        return "Palm"
    }
    static get nativeCurrency() {
        return { name: "Palm", symbol: "PALM", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b"]
    }
    static get blockExplorerUrls() {
        return ["https://explorer.palm.io/"]
    }
}

class TelosConnector extends NetworkConnector {
    static get chainId() {
        return Network.TELOS
    }
    static get chainName() {
        return "Telos"
    }
    static get nativeCurrency() {
        return { name: "Telos", symbol: "TLOS", decimals: 18 }
    }
    static get rpcUrls() {
        return ["https://mainnet.telos.net/evm"]
    }
    static get blockExplorerUrls() {
        return ["https://rpc1.us.telos.net/v2/explore/"]
    }
}

export const networks: { [network: string]: typeof NetworkConnector } = {
    [Network.NONE]: NetworkConnector,
    [Network.ETHEREUM]: EthereumConnector,
    [Network.ROPSTEN]: RopstenConnector,
    [Network.KOVAN]: KovanConnector,
    [Network.RINKEBY]: RinkebyConnector,
    [Network.GOERLI]: GoerliConnector,
    [Network.BINANCE]: BinanceConnector,
    [Network.BINANCE_TEST]: BinanceTestConnector,
    [Network.FUSE]: FuseConnector,
    [Network.POLYGON]: PolygonConnector,
    [Network.POLYGON_TEST]: PolygonTestConnector,
    [Network.XDAI]: GnosisConnector,
    [Network.HUOBI]: HuobiConnector,
    [Network.HUOBI_TEST]: HuobiTestConnector,
    [Network.ARBITRUM]: ArbitrumConnector,
    [Network.ARBITRUM_TEST]: ArbitrumTestConnector,
    [Network.AVALANCHE]: AvalancheConnector,
    [Network.AVALANCHE_TEST]: AvalancheTestConnector,
    [Network.TOMO]: TomoConnector,
    [Network.TOMO_TEST]: TomoTestConnector,
    [Network.FANTOM]: FantomConnector,
    [Network.FANTOM_TEST]: FantomTestConnector,
    [Network.MOONBEAM_TEST]: MoonbeamTestConnector,
    [Network.MOONBEAM_KUSAMA]: MoonbeamKusamaConnector,
    [Network.HARDHAT]: HardhatConnector,
    [Network.CELO]: CeloConnector,
    [Network.HARMONY]: HarmonyConnector,
    [Network.HARMONY_TEST]: HarmonyTestConnector,
    [Network.OKEX]: OKExConnector,
    [Network.OKEX_TEST]: OKExTestConnector,
    [Network.PALM]: PalmConnector,
    [Network.TELOS]: TelosConnector,
}

export default class Web3 {
    name = "Loading..."
    connected = false
    chainId = Network.NONE
    address = ""
    addresses = [] as string[]
    block = 0
    provider?: ethers.providers.JsonRpcProvider
    update?: ComputedRef<string>
    connector?: ComputedRef<NetworkConnector | null>

    connect() {
        if (this.connected && window.ethereum.request) {
            window.ethereum.request({ method: "eth_requestAccounts" })
        }
    }

    switch(chain: Network) {
        if (window.ethereum && window.ethereum.request) {
            window.ethereum
                .request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: ethers.utils.hexStripZeros(ethers.utils.hexlify(chain)) }],
                })
                .catch((error: ProviderRpcError) => {
                    console.log(error)
                    if (error.code == 4902 && window.ethereum && window.ethereum.request) {
                        window.ethereum.request({
                            method: "wallet_addEthereumChain",
                            params: [Object.assign(networks[chain], { chainId: ethers.utils.hexStripZeros(ethers.utils.hexlify(chain)) })],
                        })
                    }
                })
        }
    }

    setup() {
        this.update = computed(() => this.chainId + "|" + this.block + "|" + this.address)
        this.connector = computed(() => (this.provider ? new networks[this.chainId](this.provider) : null))
        if (window.ethereum && window.ethereum.request) {
            this.provider = markRaw(new ethers.providers.Web3Provider(window.ethereum))
            this.connector
            if (window.ethereum.isMetaMask) {
                this.name = "MetaMask"
            } else {
                this.name = "Other"
            }

            window.ethereum.autoRefreshOnNetworkChange = false
            const handleBlock = (blockNumber: number) => {
                console.log("Block:", blockNumber)
                this.block = blockNumber
            }
            const handleChainChanged = (newChainId: string) => {
                this.chainId = Number(BigNumber.from(newChainId))
                this.connected = true
                this.provider?.off("block")
                this.provider = markRaw(new ethers.providers.Web3Provider(window.ethereum))
                this.provider.on("block", handleBlock)
            }
            const handleConnect = (info: ConnectInfo) => {
                handleChainChanged(info.chainId)
            }
            const handleAccountsChanged = (newAddresses: string[] | undefined) => {
                this.addresses = newAddresses || []
                if (newAddresses && newAddresses.length) {
                    this.address = newAddresses[0]
                } else {
                    this.address = ""
                }
            }

            window.ethereum.on("accountsChanged", handleAccountsChanged)
            window.ethereum.on("chainChanged", handleChainChanged)
            window.ethereum.on("connect", handleConnect)
            window.ethereum.on("disconnect", (error: ProviderRpcError) => {
                this.connected = false
                this.block = 0
            })
            this.provider.on("block", handleBlock)

            window.ethereum
                .request({ method: "eth_accounts" })
                .then((addresses: string[]) => {
                    handleAccountsChanged(addresses)
                    handleConnect({ chainId: window.ethereum.chainId })
                })
                .catch((error: ProviderRpcError) => {
                    console.log("Error", error)
                })
        } else {
            this.name = "None"
        }
    }
}
