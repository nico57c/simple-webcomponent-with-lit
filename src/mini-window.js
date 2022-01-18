import {LitElement, html, css} from 'lit';
import {MiniUtils} from "./mini-utils";

/**
 * Mini Window inside web page
 * @slot name body for content
 */
export class MiniWindow extends LitElement {

    static get styles() {
        return css`
      :host {
        display: flex;
        position: absolute;
        background: transparent;
      }
      
      .mini-window,
      .mini-window-content {
        display: flex;
        flex-direction: column;
      }

      .mini-window {
        border: solid 1px black;
      }
          
      .mini-window-footer,
      .mini-window-content {
        padding: 4px;
      }
     
      .mini-window,
      .mini-window-content {
        flex: 1;
      }
      
      .mini-window-title {
        flex: 1;
        text-align: center;
      }
          
      .mini-window-header {
        cursor: pointer;
        user-select: none;
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid black;
      }

      .mini-window-footer {
        cursor: pointer;
        user-select: none;
        display: flex;
        flex-direction: row-reverse;
        border-top: 1px solid black;
      }

      .mini-window-miniactions,
      .mini-window-actions {
        display: flex;
        flex-direction: row-reverse;
        padding: 0 8px;
      }

      .mini-window-actions > button,
      .mini-window-miniactions > div {
        margin-left: 8px;
      }
          
      .mini-window-minimize,
      .mini-window-collapse,
      .mini-window-close {
        padding: 0 .5em;
        border-left: 1px solid black;
        border-right: 1px solid black;
      }
    `;
    }

    static get properties() {
        return {
            /**
             * Autostart
             * @type {boolean}
             */
            autostart: {type: Boolean},

            /**
             * Name of Window/Task
             * @type {string}
             */
            name: {type: String},

            /**
             * Title of window
             * @type {string}
             */
            title: {type: String},

            /**
             * Initial position and size
             */
            x: {type: Number}, y: {type: Number},
            width: {type: String}, height: {type: String},

            /**
             * Parameters
             */
            resizable: {type: Boolean}, closable: {type: Boolean},
            minimizable:{type: Boolean}, collapsible: {type: Boolean},

            /**
             * Actions in struct of functions called on click.
             * @type {object}
             */
            actions: {type: { name: String, action: Function, isDisabled: Function }},
        };
    }

    constructor() {
        super();
        this.state = 'closed';
        this.hideHtmlElement();
        this.dragging = MiniUtils.dragging;
    }

    render() {
        if(this.taskId === undefined) {
            /**
             * TaskController
             * @type {MiniTaskController}
             */
            this.taskController = MINI.store.getService('MiniTaskController').instance;
            this.taskId = this.taskController.createTask(this.name, this);
            console.info('Task \'' + this.name + '\' created with task id \'' + this.taskId + '\'');
        }

        if(this.autostart !== true) {
            console.info('Window [' + this.name + ' / ' + this.taskId + '] is not rendered. To render it, call open method.');
            this.hideHtmlElement();
            return ;
        }

        this.title = this.title ? this.title : 'default title';

        this.actions = this.actions ? this.actions : [
            { name: 'Save', action: () => console.log('save clicked'), isDisabled: () => false },
            { name: 'Cancel', action: () => console.log('cancel clicked'), isDisabled: () => false },
        ];

        let miniActions = [
            this.closable ? html`<div class="mini-window-close" @click=${this.close}>&#215;</div>` : null,
            this.minimizable ? html`<div class="mini-window-minimize" @click=${this.minimize}>&#8226;</div>` : null,
            this.collapsible ? html`<div class="mini-window-collapse" @click=${this.collapse}>${this.state !== 'collapsed' ? html`&#94;` : html`&#172;` }</div>` : null
        ];

        this.loadPosition();

        let content = null;
        if(this.state !== 'collapsed') {
            content = html`
                <div class="mini-window-content">
                    <slot name="body"></slot>
                </div>
                <div class="mini-window-footer">
                    <div class="mini-window-actions">
                        ${this.actions.map((value, key) =>
                            html`
                                <button class='mini-window-action'
                                        @click=${this.actions[key].action}
                                        @disabled=${this.actions[key].isDisabled}>${value.name}
                                </button>
                            `
                        )}
                    </div>
                </div>
            `;
        }

        return html`
          <div class="mini-window" draggable="true" ondragstart="return false;">
              <div class="mini-window-header" @mousedown=${this.dragging.bind(this)}>
                  <div class="mini-window-title">${this.title}</div>
                  <div class="mini-window-miniactions">
                        ${miniActions}
                  </div>
              </div>
              ${content}
          </div>
        `;
    }

    savePosition(posOnly) {
        if(posOnly === true) {
            this.savedPosition = {...this.savedPosition, ...{ x: this.style.left, y: this.style.top }};
        } else {
            this.savedPosition = {
                x: this.style.left, y: this.style.top,
                width: this.style.width, height: this.style.height
            };
        }
    }

    loadPosition() {
        if(this.savedPosition !== undefined) {
            this.style.left = this.savedPosition.x;
            this.style.top = this.savedPosition.y;
            this.style.width = this.savedPosition.width;
            this.style.height = this.savedPosition.height;
        } else {
            this.style.width = (this.width ? this.width : '200px');
            this.style.height = (this.height ? this.height : '200px');
            this.style.top = this.y ? this.y + 'px' : this.style.top;
            this.style.left = this.x ? this.x + 'px' : this.style.left;

            this.savePosition();
        }

        if(this.state === 'collapsed') {
            this.style.height = this.renderRoot.querySelector('.mini-window-header').style.height;
        }
    }

    hideHtmlElement() {
        this.style.left = '0px'; this.style.top = '0px';
        this.style.width = '0px'; this.style.height = '0px';
    }

    /**
     * Display window.
     * @param {boolean} force force to visible with true and hidden with false
     * @return {boolean} Visibility of window displayed === true, hidden === false
     */
    toggle(force = undefined) {
        if(force !== undefined && force === true || force === undefined && this.style.display === 'none') {
            this.autostart = true;
            this.state = 'opened';
            this.style.display = 'flex';
            this.loadPosition();
            return true;
        } else if(force !== undefined && force === false || force === undefined && this.style.display !== 'none') {
            this.autostart = false;
            this.state = 'minimized';
            this.style.display = 'none';
            this.hideHtmlElement();
            return false;
        }
    }

    /**
     * Force open window
     */
    open() {
        this.toggle(true);
        this.sendMessage();
    }

    /**
     * Force close window but not task (which is possibly link with a menu item)
     */
    close() {
        this.toggle(false);
        this.state = 'closed';
        this.sendMessage();
    }

    /**
     * Force minimize window
     */
    minimize() {
        this.toggle(false);
        this.sendMessage();
    }

    /**
     * Force collapse window
     */
    collapse() {
        this.state = this.state === 'opened' ? 'collapsed' : 'opened';
        this.requestUpdate();
        this.sendMessage();
    }

    /**
     * Send a message to store with new state of window
     */
    sendMessage() {
        MINI.store.sendMessage('MiniWindowUpdated', {state: this.state, taskId: this.taskId, name: this.name});
    }
}

window.customElements.define('mini-window', MiniWindow);
