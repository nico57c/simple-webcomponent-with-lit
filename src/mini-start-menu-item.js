import {LitElement, html, css} from 'lit';

/**
 * Mini StartMenu Item inside web page
 */
export class MiniStartMenuItem extends LitElement {

    static get styles() {
        return css`
          :host {
            display: flex;
            cursor: pointer;
            user-select: none;
          }

          .mini-start-menu-item {
            display: flex;
            flex-direction: row;
            width: 100%;
            padding: 2px 2px 2px 10px;
          }

          .mini-start-menu-item:hover {
            background-color: #EEE;
          }
        `;
    }

    static get properties() {
        return {
            task: {type: String},
            title: {type: String}
        };
    }

    constructor() {
        super();
        /**
         * Get MiniTaskController instance from store.
         * @type {MiniTaskController}
         */
        this.taskController = MINI.store.getService('MiniTaskController').instance;
    }

    render() {
        return html`
      <div class="mini-start-menu-item" @click="${() => this.openWindow(this.task)}">
          ${this.title}
      </div>
    `;
    }

    /**
     * OpenWindow
     * @param {String} task
     * @param {Function} callback
     */
    openWindow(task, callback) {
        /**
         * @type {{id: Number, name: String, creationDate: Date, window: MiniWindow}}
         */
        const taskObj = this.taskController.getTask(task, task);

        if(taskObj !== undefined) {
            taskObj.window.open();
        } else {
            console.info('Task not found with id or name : ' + task);
            if(callback !== undefined) {
                document.append(callback(this.taskController));
            }
        }
    }
}

window.customElements.define('mini-start-menu-item', MiniStartMenuItem);
