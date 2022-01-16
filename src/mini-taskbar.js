// noinspection JSSuspiciousNameCombination

import {LitElement, html, css} from 'lit';
import MINI from "./mini";
import {MiniTaskController} from "./mini-task-controller";
import {classMap} from 'lit/directives/class-map.js';
import {queryAssignedElements} from "lit-element";
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
        position: absolute;
        pading: 0;
        margin: 0;
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
          <slot name="start-menu" class="mini-taskbar-start-menu"></slot>
          <div class="mini-taskbar-tasks">
              ${this.taskController.listAll().map(value => html`
                    <div class="mini-taskbar-task ${classMap({'mini-taskbar-task-visible': value.isVisible})}" @click="${this.openWindow(value.id)}">${value.name}</div>
              `)}
         </div>
      </div>
    `;
    }

    toggleStartMenu() {
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
     * Open window with task ID
     * @param {Number} id
     */
    openWindow(id) {
        this.taskController.getTask(id).window.toggle();
    }
}

window.customElements.define('mini-taskbar', MiniTaskbar);
