/**
 * Import Model/Utils classes
 */
import {MiniUtils} from "./mini-utils";
import {MiniStore} from "./mini-store";

/**
 * Import Controllers
 */
import {MiniTaskController} from "./mini-task-controller";

class Mini {

    constructor() {
        console.info('Mini library version : 0.0.0a');
        /**
         * Store of services and messages...
         * @type {MiniStore}
         */
        this.store = null;
    }

    init() {
        console.info('> Mini library - MiniStore initialization.');
        this.store = MiniStore.getInstance();
        this.store.addService(new MiniTaskController());
    }
}

const MINI = new Mini();
MINI.init();
export default MINI;
