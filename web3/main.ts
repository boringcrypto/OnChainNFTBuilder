import { createApp, reactive } from "vue"
import { createRouter, createWebHashHistory } from "vue-router"
import BootstrapVue from "bootstrap-vue-3"

import "bootswatch/dist/sandstone/bootstrap.min.css"
import "bootstrap-vue-3/dist/bootstrap-vue-3.css"

import App from "./App.vue"
import Home from "./pages/Home.vue"
import Data from "./data"

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        app: typeof Data
    }
}

async function main() {
    const app = createApp(App)
    await Data.web3.setup()
    app.config.globalProperties.app = reactive(Data)
    app.provide("app", app.config.globalProperties.app)

    app.use(
        createRouter({
            history: createWebHashHistory(),
            routes: [
                { path: "/", component: Home },
                //{ path: '/block/:number', component: Block },
                //{ path: '/address/:address', component: Address },
            ],
        })
    )

    app.mount("#app")
}

main()
