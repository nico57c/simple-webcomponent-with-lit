import {LitElement, html, css} from 'lit';

/**
 * Mini Window inside web page
 * @slot name body for content
 */
export class MiniWindow extends LitElement {

    static get styles() {
        return css`
      :host {
        display: block;
        position: absolute;
        min-width: 200px;
        min-height: 200px;
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
            resizable: {type: Boolean}, closable: {type: Boolean}, minimizable:{type: Boolean},

            /**
             * Actions in struct of functions called on click.
             * @type {object}
             */
            actions: {type: { name: String, action: Function, isDisabled: Function }},

            /**
             * Body of window which is pure html
             * @type HTMLElement
             */
            body: {type: HTMLElement},
        };
    }

    constructor() {
        super();
        this.state = 'closed';
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
            this.close();
            return ;
        }

        this.state = 'opened';
        this.title = this.title ? this.title : 'default title';
        this.actions = this.actions ? this.actions : [
            { name: 'Save', action: () => console.log('save clicked'), isDisabled: () => false },
            { name: 'Cancel', action: () => console.log('cancel clicked'), isDisabled: () => false },
        ];

        this.width = this.width ? this.width : 200;
        this.height = this.height ? this.height : 200;

        let miniActions = [ this.closable ? html`<div class="mini-window-close" @click=${this.close}>X</div>` : null,
                            this.minimizable ? html`<div class="mini-window-minimize" @click=${this.minimize}>-</div>` : null,
        ];

        this.style.top = this.y ? this.y + 'px' : this.style.top;
        this.style.left = this.x ? this.x + 'px' : this.style.left;

        return html`
      <div class="mini-window" style="width: ${this.width}px; height: ${this.height}px;" draggable="true" @mousedown=${this.dragging.bind(this)} ondragstart="return false;">
          <div class="mini-window-header">
              <div class="mini-window-title" alt="${this.name}">${this.title}</div>
              <div class="mini-window-miniactions">
                    ${miniActions}
              </div>
          </div>
          <div class="mini-window-content">
              <slot name="body"></slot>
          </div>
          <div class="mini-window-footer">
              <div class="mini-window-actions">
                  ${this.actions.map((value, key) =>
                      html`<button class='mini-window-action'
                                   @click=${this.actions[key].action}
                                   @disabled=${this.actions[key].isDisabled}>${value.name}</button>`
                  )}
              </div>
          </div>
      </div>
    `;
    }

    dragging(event) {
        let that = this;
        let shiftX = event.clientX - this.getBoundingClientRect().left;
        let shiftY = event.clientY - this.getBoundingClientRect().top;

        moveAt(event.pageX, event.pageY);

        // moves the ball at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
            that.style.left = pageX - shiftX + 'px';
            that.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            if(event.buttons === 0 ||
               event.pageX < 0 || event.pageY < 0 ||
               event.pageX > document.defaultView.innerWidth || event.pageY > document.defaultView.innerHeight) {
                document.removeEventListener('mousemove', onMouseMove);
                that.onmouseup = null;
                return;
            }
            moveAt(event.pageX, event.pageY);
        }

        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);

        // drop the ball, remove unneeded handlers
        this.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            that.onmouseup = null;
        };
    }

    /**
     * Display window.
     * @return {boolean} Visibility of window displayed === true, hidden === false
     */
    toggle() {
        return (this.style.display = this.style.display === 'none' ? 'flex' : 'none') !== 'none';
    }

    /**
     * Force open window
     */
    open() {
        this.autostart = true;
        this.style.left = this.savedPosition.x;
        this.style.display = 'flex';
        this.state = 'opened';
        this.sendMessage();
    }

    /**
     * Force close window but not task (which is possibly link with a menu item)
     */
    close() {
        this.autostart = false;
        this.style.display = 'none';
        this.savedPosition = {x: this.style.left, y: this.style.top};
        this.style.left = -1000;
        this.state = 'closed';
        this.sendMessage();
    }

    /**
     * Force minimize window
     */
    minimize() {
        this.autostart = false;
        this.style.display = 'none';
        this.savedPosition = {x: this.style.left, y: this.style.top};
        this.style.left = -1000;
        this.state = 'minimized';
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
