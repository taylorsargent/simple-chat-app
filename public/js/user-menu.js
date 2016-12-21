/* eslint-disable */
'use strict';

$(function () {
    $('.user-list-button').on('touchstart click', function (e) {
        $('.user-list').toggleClass('open');
        $('.user-list-button').toggleClass('active');
    });
});
