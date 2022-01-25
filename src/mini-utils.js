import {render, html} from 'lit';

export class MiniUtils {

    /**
     * Query One slot with a name
     * @param {string} name
     * @param {LitElement} element
     */
    static queryOneSlot(name, element) {
        return element.renderRoot.querySelector(`slot[name=${name}]`);
    }

    /**
     * Query All slot with a name
     * @param {string} name
     * @param {LitElement} element
     */
    static queryAllSlot(name, element) {
        return element.renderRoot.querySelectorAll(`slot[name=${name}]`);
    }

    static tooltip(message, x, y, timeout) {
        const tooltipId = 'tooltipid_' +  Math.floor(Math.random()*1000000);
        const tooltip = html`
            <span class="mini-tooltip" id="${tooltipId}">${message}</span>
        `;

        const element = render(tooltip, document.body).startNode.nextElementSibling;
        element.style.display = 'block';
        element.style.position = 'absolute';
        element.style.top = y + 'px';
        element.style.left = x + 'px';

        setTimeout(() => {
            element.style.display = 'none';
        }, timeout);
    }

    static dragging(event) {
        console.info('dragging start');
        let that = this;
        let shiftX = event.clientX - this.getBoundingClientRect().left;
        let shiftY = event.clientY - this.getBoundingClientRect().top;

        moveAt(event.pageX, event.pageY);

        // moves the ball at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
            that.style.left = (pageX - shiftX) + 'px';
            that.style.top = (pageY - shiftY) + 'px';

            if(that.savePosition !== undefined) {
                that.savePosition(true);
            }
        }

        function onMouseMove(event) {
            if(event.buttons === 0 ||
                event.pageX < 0 || event.pageY < 0 ||
                event.pageX > document.defaultView.innerWidth ||
                event.pageY > document.defaultView.innerHeight) {
                console.info('dragging stop');
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
            console.info('dragging stop');
            document.removeEventListener('mousemove', onMouseMove);
            that.onmouseup = null;
        };
    }
}


