/* eslint-disable */
'use strict';

function createRipple(y, x) {
    var ripple = '<div class="circle" style="top:' + y + 'px;left:' + x + 'px;"></div>';
    var _ripple = $(ripple);
    $('.login-button').append(_ripple);
    setTimeout(function() {
        return _ripple.remove();
    }, 900);
}

$(function () {
    $('.login-button').mousedown(function(e) {
        var offset = $(e.target).offset();
        createRipple(e.pageY - offset.top, e.pageX - offset.left);
    });
});
