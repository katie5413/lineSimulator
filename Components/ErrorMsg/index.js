function showErrorMsg({ target, msg }) {
    let elm = target.find(`.errorMsg`);
    elm.addClass('active');
    elm.find('.text').text(msg);
}

function hideErrorMsg() {
    let elm = $('.errorMsg');
    elm.removeClass('active');
}
