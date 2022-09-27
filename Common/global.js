var roomData = {
    id: null,
    name: '',
    mainCharacterID: null,
    member: [],
    message: [],
};

function updateRoomData(data) {
    if (data.id) roomData.id = data.id;
    if (data.roomName) roomData.name = data.roomName;
    if (data.roomMember) roomData.member = data.roomMember;
}

function useRoomData() {
    return roomData;
}

function preventDefault(e) {
    e.preventDefault();
}

function fixHtmlScroll() {
    $('html').addClass('disable-scroll');
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
    };
    window.addEventListener('pointermove', preventDefault);
}

function releaseHtmlScroll() {
    if ($('[data-disable-html-scroll="true"]').length === 0) {
        $('html').removeClass('disable-scroll');
        window.onscroll = function () {};
    }
    // resume pointer events

    window.removeEventListener('pointermove', preventDefault);
}
