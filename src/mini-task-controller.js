import {MiniWindow} from "./mini-window";

export class MiniTaskController {

    constructor(maxTasks = 9999) {
        /**
         * tasks, array of tasks already opened.
         * @type {Array<{id: Number, name: String, creationDate: Date, window: MiniWindow}>}
         */
        this.tasks = [];

        /**
         * MmaxTasks authorized inside controller. -- TODO use maxTasks variable during creation of new task
         * @type {number}
         */
        this.maxTasks = maxTasks;
    }

    /**
     * createTask
     * @param {string} name
     * @param {MiniWindow} _window
     * @returns {number}
     * @public
     */
    createTask(name, _window) {
        const id = this.tasks.push({
            name: name,
            window: _window,
            creationDate:  Date.now(),
            id: null
        }) - 1;
        this.tasks[id].id = id;

        MINI.store.sendMessage('MiniTaskControllerUpdated', 1);
        return id;
    }

    /**
     * CloseTask
     * @param {number} id
     * @param {string} name
     */
    closeTask(id, name = undefined) {
        const taskI = this.tasks.findIndex(value =>
                (name !== undefined && value.name === name) ||
                (id !== undefined && value.id === id)
            );

        if(taskI !== undefined) {
            this.tasks[taskI].window.close();
            this.tasks.splice(taskI, 1);
            MINI.store.sendMessage('MiniTaskControllerUpdated', -1);
        }
    }

    /**
     * Return tasks saved in store
     * @param {number} id
     * @param {string} name
     * @returns {{id: Number, name: String, creationDate: Date, window: MiniWindow}}
     */
    getTask(id, name = undefined) {
        return this.tasks.find(value =>
            (name !== undefined && value.name === name) ||
            (id !== undefined && value.id === parseInt(id))
        );
    }

    /**
     * ListAll tasks with name, id and createDate.
     * @returns {{name: String, id: Number, creationDate: Date, state: String}[]}
     */
    listAll() {
        return this.tasks.map(value => ({ name: value.name, id: value.id, creationDate: value.creationDate, state: value.window.state}) );

    }
}
