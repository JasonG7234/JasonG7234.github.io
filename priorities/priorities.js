document.addEventListener('DOMContentLoaded', function() {
    fetch('items.txt')
        .then(response => response.text())
        .then(data => {
            const items = data.split('\n'); // Assuming each item is on a new line
            const randomItems = [];
            while(randomItems.length < 5) {
                const index = Math.floor(Math.random() * items.length);
                if(!randomItems.includes(items[index])) {
                    randomItems.push(items[index]);
                }
            }
            const draggableDivs = document.querySelectorAll('.container .draggable');
            randomItems.forEach((item, index) => {
                draggableDivs[index].textContent = item;
            });
        })
        .catch(error => console.error('Error fetching items:', error));
});

var x = document.getElementById('all');

// Replace the old vertical mouse/touch loops with horizontal "snap" reordering.
(function initHorizontalReorder(container) {
    if (!container) return;

    // Prefer Pointer Events when available; fall back to mouse/touch if not.
    const supportsPointer = 'PointerEvent' in window;

    function getItems() {
        // Keep ordering based on current DOM order (this is the "snap" state).
        return Array.from(container.children);
    }

    function getClientX(evt) {
        if (evt.touches && evt.touches[0]) return evt.touches[0].clientX;
        return evt.clientX;
    }

    function indexFromX(items, clientX) {
        // Find the slot based on which item's center is closest / crossed.
        let closestIndex = 0;
        let closestDist = Infinity;
        for (let i = 0; i < items.length; i++) {
            const r = items[i].getBoundingClientRect();
            const center = r.left + r.width / 2;
            const d = Math.abs(clientX - center);
            if (d < closestDist) {
                closestDist = d;
                closestIndex = i;
            }
        }
        return closestIndex;
    }

    function attachDragHandlers(el) {
        let dragging = false;
        let startX = 0;
        let startTranslateX = 0;

        // Reduce accidental click/drag selection.
        el.style.touchAction = 'pan-y'; // allow vertical page scroll, but we handle horizontal drag
        el.style.userSelect = 'none';

        function onStart(e) {
            // Left mouse only (when using mouse events).
            if (e.type === 'mousedown' && e.button !== 0) return;

            dragging = true;
            startX = getClientX(e);
            startTranslateX = 0;

            el.style.position = 'relative';
            el.style.zIndex = '9999';
            el.style.willChange = 'transform';

            // Capture pointer so we keep receiving move events even if we leave the element.
            if (supportsPointer && e.pointerId != null && el.setPointerCapture) {
                try { el.setPointerCapture(e.pointerId); } catch (_) {}
            }

            // Prevent touch scrolling during active drag.
            if (e.cancelable) e.preventDefault();

            addMoveEndListeners();
        }

        function onMove(e) {
            if (!dragging) return;

            const clientX = getClientX(e);
            const dx = clientX - startX;

            // Move only on X axis.
            el.style.transform = `translateX(${startTranslateX + dx}px)`;

            // "Snap" by reordering DOM when crossing into a new slot.
            const items = getItems();
            const fromIndex = items.indexOf(el);
            const toIndex = indexFromX(items, clientX);

            if (toIndex !== -1 && toIndex !== fromIndex) {
                const target = items[toIndex];
                // Insert before target when moving left; otherwise insert after target.
                if (toIndex < fromIndex) {
                    container.insertBefore(el, target);
                } else {
                    container.insertBefore(el, target.nextSibling);
                }
            }

            if (e.cancelable) e.preventDefault();
        }

        function onEnd(e) {
            if (!dragging) return;
            dragging = false;

            // Clear drag styling; DOM order already represents the snapped order.
            el.style.transform = '';
            el.style.willChange = '';
            el.style.zIndex = '';
            el.style.position = '';

            removeMoveEndListeners();
            if (e && e.cancelable) e.preventDefault();
        }

        function addMoveEndListeners() {
            if (supportsPointer) {
                document.addEventListener('pointermove', onMove, { passive: false });
                document.addEventListener('pointerup', onEnd, { passive: false });
                document.addEventListener('pointercancel', onEnd, { passive: false });
            } else {
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onEnd);
                document.addEventListener('touchmove', onMove, { passive: false });
                document.addEventListener('touchend', onEnd, { passive: false });
                document.addEventListener('touchcancel', onEnd, { passive: false });
            }
        }

        function removeMoveEndListeners() {
            if (supportsPointer) {
                document.removeEventListener('pointermove', onMove);
                document.removeEventListener('pointerup', onEnd);
                document.removeEventListener('pointercancel', onEnd);
            } else {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onEnd);
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('touchend', onEnd);
                document.removeEventListener('touchcancel', onEnd);
            }
        }

        if (supportsPointer) {
            el.addEventListener('pointerdown', onStart, { passive: false });
        } else {
            el.addEventListener('mousedown', onStart);
            el.addEventListener('touchstart', onStart, { passive: false });
        }
    }

    // Attach to current children (your 5 elements).
    getItems().forEach(attachDragHandlers);
})(x);
