$('.pop .inner .close').click(function () {
    closePop();
});

$('.pop .inner .cancel').click(function () {
    closePop();
});

function initAddMember() {
    let tab = $('#memberTab');

    // 標題
    tab.find('.inner .top .title span').text('新增成員');
    // 成員名稱
    tab.find('#add_member_name').val('');

    // 按鈕
    addMemberStep('init');

    // 上傳圖片
    $('#member__img_area').show();

    // 清空 result
    $('#result').children().remove();

    // 清除刪除按鈕的 data-id
    $('#delete_avatar').removeAttr('data-id');

    // 關掉確定按鈕的編輯模式
    $('#submit_avatar').removeClass('edit');
}

function openPop({ tab, data }) {
    tab.addClass('open').removeClass('close');
    let mode = tab.attr('mode');
    if (mode === 'editMember') {
        $('#submit_avatar').addClass('edit');
        $('#submit_avatar').attr('data-id', data.id);
        $('#delete_avatar').attr('data-id', data.id);
        tab.find('.inner .top .title span').text('編輯成員');
        tab.find('#add_member_name').val(data.name);

        addMemberStep('editInit');

        if (data.img) {
            $('#result').append(`<img id="member_img" src="${data.img}" alt="avatar">`);
        }
    }
    $('body').addClass('fixed');
}

function closePop() {
    $('.pop').removeClass('open').addClass('close');
    $('body').removeClass('fixed');

    initAddMember();
    hideErrorMsg();
}

function getRoundedCanvas(sourceCanvas) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
    return canvas;
}

// 上傳留言圖片
$('#upload_member_img').change(function () {
    var file = this.files[0];
    //用size属性判断文件大小不能超过 600KB ，前端直接判断的好处，免去服务器的压力。
    if (file.size > 1 * 1024 * 600) {
        alert('圖片不可大於 600KB');
    } else {
        addMemberStep('upload');

        var reader = new FileReader();
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 base64 DataURL
            var base64 = reader.result;
            $('#member__img_area').hide();
            $('#result').append(`<img id="member_img" src="${base64}" alt="avatar">`);

            var image = document.getElementById('member_img');
            var button = document.getElementById('crop_button');
            var cropper = new Cropper(image, {
                aspectRatio: 1,
                viewMode: 1,
                ready: function () {
                    croppable = true;
                },
            });

            button.onclick = function () {
                var croppedCanvas;
                var roundedCanvas;

                if (!croppable) {
                    return;
                }

                // Crop
                croppedCanvas = cropper.getCroppedCanvas();

                // Round
                roundedCanvas = getRoundedCanvas(croppedCanvas);

                // Show
                $('#result').children().remove();
                $('#result').append(
                    `<img id="member_img" src="${roundedCanvas.toDataURL()}" alt="avatar" />`,
                );

                addMemberStep('crop');
            };
        };
        reader.readAsDataURL(file);
    }

    // $('#uploadAvatar').click();
});

$('#reUpload_button').click(function () {
    addMemberStep('reUpload');
});

function addMemberStep(step) {
    switch (step) {
        case 'init':
            // 一進去先隱藏
            $('#reUpload_button').hide();
            $('#crop_button').hide();
            $('#submit_avatar').hide();
            $('#delete_avatar').hide();
            $('#submit_avatar.edit').show();
            break;
        case 'editInit':
            $('#member__img_area').hide();
            $('#reUpload_button').show();
            $('#delete_avatar').show();
            $('#submit_avatar').show();
            break;
        case 'upload':
            // 裁切與重新上傳 出現
            $('#crop_button').show();
            $('#reUpload_button').show();
            break;
        case 'reUpload':
            $('#member__img_area').show();
            $('#crop_button').hide();
            $('#reUpload_button').hide();
            $('#submit_avatar').hide();
            $('#result').children().remove();
            break;
        case 'crop':
            // Show
            $('#crop_button').hide();
            // $('#reUpload_button').hide();
            $('#submit_avatar').show();
            break;
        case 'submit':
            $('#member__img_area').show();
            $('#result').children().remove();
            closePop();
            break;
    }
}
