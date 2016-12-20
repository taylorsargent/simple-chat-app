/* eslint-disable */
'use strict';

function createRipple(y, x) {
    const ripple = '<div class="circle" style="top:' + y + 'px;left:' + x + 'px;"></div>';
    const _ripple = $(ripple);
    $('.ripple').append(_ripple);
    setTimeout(function() {
        return _ripple.remove();
    }, 900);
}

$(function () {
    $('.login-button').mousedown(function(e) {
        const offset = $(e.target).offset();
        createRipple(e.pageY - offset.top, e.pageX - offset.left);
    });
});
