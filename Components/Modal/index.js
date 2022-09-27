function openModal({ targetModal, modalTitle, actionType }) {
    fixHtmlScroll();
    $('.modal').css('top', $(document).scrollTop());
    targetModal.addClass('active');

    if (modalTitle) {
        targetModal.find('.content .top .title').text(modalTitle);
    }

    if (actionType) {
        targetModal.attr('action-type', actionType);
    }

    $('.modal').find('.drop__container.error').removeClass('error');
    $('.modal').find('.form__input.error').removeClass('error');

    hideErrorMsg();
}

function closeModal() {
    releaseHtmlScroll();
    $('.modal').css('top', 0);
    console.log('closeModal');
    $('.modal').removeClass('active');

    // 一般 input
    $('.modal').find('input').val('');
    $('.modal').find('.form__input.error').removeClass('error');

    // dropBox
    $('.modal .drop__container').find('label.active').removeClass('active');
    $('.modal').find('.drop__container.error').removeClass('error');
    $('.modal .drop__container').find('input').attr('select-id', '');

    hideErrorMsg();
}

$('.modalCancel').on('click', function () {
    closeModal();
});
