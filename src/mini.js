/**
 * Import Model/Utils classes
 */
import {MiniStore} from "./mini-store";

/**
 * Import Controllers
 */
import {MiniTaskController} from "./mini-task-controller";

/**
 * Import Components
 */
import {MiniWindow} from "./mini-window";
import {MiniTasktray} from "./mini-tasktray";
import {MiniTaskbar} from "./mini-taskbar";

class Mini {

    constructor() {
        console.info('Mini library version : 0.0.0a');
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
