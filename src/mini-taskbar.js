// noinspection JSSuspiciousNameCombination

import {LitElement, html, css} from 'lit';
import {MiniTaskController} from "./mini-task-controller";
import {classMap} from 'lit/directives/class-map.js';
import {MiniUtils} from "./mini-utils";

/**
 * Mini Taskbar inside web page
 * @slot Start menu with list of 'app/tasks'
 */
export class MiniTaskbar extends LitElement {

    static get styles() {
        return css`
      :host {
        display: flex;
        cursor: pointer;
        user-select: none;
      }
      
      .mini-taskbar-start {
        display: flex;
        flex-direction: row;
        background-color: #EEE;
        align-items: center;
        text-align: center;
        color: #555;
        border: 1px solid black;
        padding: 0 .5rem;
      }
      
      .mini-taskbar-start-clicked {
        background-color: #CCC;
        border: 1px inset black;
      }
          
      .mini-taskbar {
        display: flex;
        flex: 1;
        flex-direction: row;
        border: 1px solid black;
        padding: 2px;
      }
      
      .mini-taskbar-tasks {
        display: flex;
        flex: 1;
        margin: 0 2px;
      }
          
      .mini-taskbar-task {
        display: none;
        flex-direction: row;
        border: 1px solid black;
        padding: 2px;
        align-items: center;
        justify-items: center;
      }
          
      .mini-taskbar-task-visible {
        display: flex;
      }
          
      .mini-taskbar-start-menu {
        display: flex;
        position: absolute;
        z-index: 999; 
      }
      
      .mini-taskbar-clock {
        display: flex;
        align-items: center;
        padding: 2px;
      }
    `;
    }

    static get properties() {
        return {
            start: {type: String},
            alignment: {type: String},
            width: {type: String},
            height: {type: String}
        };
    }

    constructor() {
        super();
        /**
         * Get MiniTaskController instance from store.
         * @type {MiniTaskController}
         */
        this.taskController = MINI.store.getService('MiniTaskController').instance;

        document.addEventListener('mouseup', (event) => this.closeStartMenu(event));

        MINI.store.subscribeToMessage('MiniWindowUpdated').subscribe(value => {
            this.requestUpdate();
        });
    }

    render() {
        this.width = this.width ? this.width : '100%';
        this.height = this.height ? this.height : '40px';

        const tmpWidth = this.width;
        const tmpHeight = this.height;

        switch (this.alignment) {
            default:
            case 'top':
                this.alignment = 'top';
                this.style.top = '0px';
                this.style.width = tmpWidth;
                this.style.height = tmpHeight;
            break;
            case 'bottom':
                this.style.bottom = '-' + tmpHeight;
                this.style.width = tmpWidth;
                this.style.height = tmpHeight;
            break;
            case 'left':
                this.style.left = '0px';
                this.style.width = tmpHeight;
                this.style.height = tmpWidth;
            break;
            case 'right':
                this.style.right = '-' + tmpHeight;
                this.style.width = tmpHeight;
                this.style.height = tmpWidth;
            break;
        }

        return html`
      <div class="mini-taskbar">
         <slot name="start" class="mini-taskbar-start" @click="${this.toggleStartMenu}"></slot>
         <slot name="start-menu" class="mini-taskbar-start-menu" style="display: none; margin-top: ${tmpHeight}"></slot>
         <div class="mini-taskbar-tasks">
              ${this.taskController.listAll().map(value => html`
                    <div class="mini-taskbar-task ${classMap({'mini-taskbar-task-visible': value.state !== 'closed'})}" @click="${this.openWindow}" taskid="${value.id}">${value.name}</div>
              `)}
         </div>
         <slot name="clock" class="mini-taskbar-clock"></slot>
      </div>
    `;
    }

    /**
     * Set visibility of StartMenu
     * @param {Event} event
     */
    toggleStartMenu(event) {
        const startButton = MiniUtils.queryOneSlot('start', this);
        const startMenu = MiniUtils.queryOneSlot('start-menu', this);

        if(startButton.classList.contains('mini-taskbar-start-clicked')) {
            startButton.classList.remove('mini-taskbar-start-clicked');
            startMenu.style.display = 'none';
        } else {
            startButton.classList.add('mini-taskbar-start-clicked');
            startMenu.style.display = 'flex';
        }
    }

    /**
     * Close StartMenu
     * @param {Event} event
     */
    closeStartMenu(event) {
        const startButton = MiniUtils.queryOneSlot('start', this);
        const startMenu = MiniUtils.queryOneSlot('start-menu', this);

        if(event.target.slot === 'start' || event.target.tagName === 'MINI-TASKBAR') { return false; }
        if(startMenu.style.display !== 'none') {
            this.toggleStartMenu(event);
        }
    }

    /**
     * Open window with task ID
     * @param {Event} event
     */
    openWindow(event) {
        const task = this.taskController.getTask(event.target.attributes['taskid'].value);
        if(task !== undefined) {
            task.window.toggle();
        }
    }
}

window.customElements.define('mini-taskbar', MiniTaskbar);
