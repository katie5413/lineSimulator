function activeLoading(type) {
    $('#loaderWrapper').addClass('active');
    $('#loaderWrapper').attr('type', type);
}

function closeLoading() {
    $('#loaderWrapper').removeClass('active');
    $('#loaderWrapper').removeAttr('type');
}
