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
        });
        this.tasks[id].id = id;
        return id;
    }

    /**
     * CloseTask
     * @param {number} id
     * @param {string} name
     */
    closeTask(id, name = undefined) {
        const taskI = this.tasks.findIndex(value =>
                (id === undefined && value.name === name) ||
                (id !== undefined && value.id === id)
            );

        if(taskI !== undefined) {
            taskI.window.close();
            this.tasks.splice(taskI, 1);
        }
    }

    /**
     * Return tasks saved in store
     * @param id
     * @returns {{id: Number, name: String, creationDate: Date, window: MiniWindow}}
     */
    getTask(id) {
        return this.tasks.find(value =>
            (id === undefined && value.name === name) ||
            (id !== undefined && value.id === id)
        );
    }

    /**
     * ListAll tasks with name, id and createDate.
     * @returns {{name: String, id: Number, creationDate: Date, isVisible: Boolean}[]}
     */
    listAll() {
        return this.tasks.map(value => ({ name: value.name, id: value.id, creationDate: value.creationDate, isVisible: value.window.isVisible()}) );
    }
}
