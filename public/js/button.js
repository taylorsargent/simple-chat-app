/* eslint-disable */
'use strict';

function createRipple(target, y, x) {
    var ripple = '<div class="circle" style="top:' + y + 'px;left:' + x + 'px;"></div>';
    var _ripple = $(ripple);
    $(target).append(_ripple);
    setTimeout(function() {
        return _ripple.remove();
    }, 900);
}

$(function () {
    $('button').mousedown(function(e) {
        var offset = $(e.target).offset();
        createRipple(e.target, e.pageY - offset.top, e.pageX - offset.left);
    });
});
