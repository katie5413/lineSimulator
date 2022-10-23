$(document).ready(function () {
    let members = [];
    let message = [];
    let question = [];
    let images = [];
    let mainCharacterID = 0;

    // 房間名
    $('.roomName.form__input').click(function () {
        $(this).addClass('edit');
    });

    $('#changeRoomName').blur(function () {
        $('.roomName.form__input.edit').removeClass('edit');
    });

    const initRoomName = $('#changeRoomName').val();

    // 改房間名
    $(document).click(function (e) {
        if (
            $('.roomName.form__input') !== e.target &&
            !$('.roomName.form__input').has(e.target).length
        ) {
            $('.roomName.form__input').removeClass('edit');
            if (initRoomName !== $('#changeRoomName').val()) {
                changeRoomName();
            }
        }
    });

    function changeRoomName() {
        $.ajax({
            type: 'POST',
            url: `../Api/updateRoomName.php`,
            data: {
                name: $('#changeRoomName').val(),
            },
            dataType: 'json',
            success: function (data) {
                console.log('editRoomName', data);
            },
        });
    }

    // 選擇視角
    $(document).on('click', '.mainCharacter .drop__container .option', function () {
        $('#character-avatar').attr(
            'src',
            $(`.person[data-id="${$(this).attr('value')}"] .img`).attr('src'),
        );

        $.ajax({
            type: 'POST',
            url: `../Api/updateRoomMainPerson.php`,
            data: {
                personID: $(this).attr('value'),
            },
            dataType: 'json',
            success: function (data) {
                console.log('updatePersonID', data);
                // 自動儲存後重整
                $('#saveContent').click();
            },
        });
    });

    // 成員名單
    function fetchRoomMemberStatus() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: `../Api/getRoomMember.php`,
                dataType: 'json',
                success: function (memberData) {
                    members = memberData;

                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    reject(false);
                },
            });
        });
    }

    // 對話
    function fetchRoomMsgStatus() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: `../Api/getRoomMsg.php`,
                dataType: 'json',
                success: function (msgData) {
                    const messageData = JSON.parse(msgData);
                    messageData.forEach((msg) => {
                        message.push(msg);
                    });

                    message = messageData;
                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    reject(false);
                },
            });
        });
    }

    // 問題
    function fetchRoomQuestionStatus() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: `../Api/getRoomQuestion.php`,
                dataType: 'json',
                success: function (data) {
                    const questionData = JSON.parse(data);
                    if (questionData != null) {
                        questionData.forEach((questionItem) => {
                            question.push(questionItem);
                        });
                    }

                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    reject(false);
                },
            });
        });
    }

    // 圖片
    function fetchRoomImageStatus() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: `../Api/getRoomGallery.php`,
                dataType: 'json',
                success: function (data) {
                    images = data;

                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    reject(false);
                },
            });
        });
    }

    (async function () {
        try {
            let getMemberDone = await fetchRoomMemberStatus();
            let getMsgDone = await fetchRoomMsgStatus();
            let getQuestionDone = await fetchRoomQuestionStatus();
            let getImageDone = await fetchRoomImageStatus();

            if (getMemberDone) {
                console.log('members', members);
                // Member
                $('.members').children().remove();

                if (members.length == 0) {
                    $('.memberArea').removeClass('active');
                } else {
                    $('.memberArea').addClass('active');
                    members.forEach((item) => {
                        $('.members').append(
                            generateAvatar({
                                id: item.id,
                                img: item.img,
                                name: item.name,
                            }),
                        );
                    });
                }
                activeMemberList();

                addMemberStep('init');
            }

            if (getImageDone) {
                console.log('images', images);
                $('#images').children().remove();

                if (images.length == 0) {
                    $('.galleryArea').removeClass('active');
                } else {
                    $('.galleryArea').addClass('active');
                    images.forEach((item) => {
                        $('#images').append(
                            generateGalleryItem({
                                id: item.id,
                                img: item.img,
                                name: item.name,
                            }),
                        );
                    });
                }

                activeGalleryItem();
            }

            if (getMsgDone && getImageDone) {
                console.log('msg', message);
                if (message != null) {
                    message.map((item, index) => {
                        let msgOwner = members.filter((person) => person.id == item.who)[0];
                        let imageItem = item.imageID
                            ? {
                                  id: item.imageID,
                                  name: $(
                                      `#images .galleryItem[data-id="${item.imageID}"] .name`,
                                  ).text(),
                              }
                            : null;

                        const typeText = {
                            undefined: '文字',
                            null: '文字',
                            text: '文字',
                            image: '圖片',
                            link: '連結',
                        };

                        item.type = item.type == null ? 'text' : item.type;

                        $('#message').append(
                            generateMsgInputItem({
                                index: index + 1, // 0 塞不進去，所以要加 1
                                characterID: item.who,
                                characterName:
                                    item.who == -1 || msgOwner == null ? '沒有成員' : msgOwner.name,
                                type: item.type,
                                typeText: typeText[item.type],
                                text: item.text,
                                imageID: imageItem == null ? ' ' : imageItem.id,
                                imageName: imageItem == null ? ' ' : imageItem.name,
                                memberData: members,
                                imageData: images,
                            }),
                        );

                        // 更改內容類型
                        $(
                            `.msgManageItem[data-id="${
                                index + 1
                            }"] .form__input.drop[data-type="contentType"] .option`,
                        ).on('click', function () {
                            $(this).closest('.msgManageItem').removeClass('text image link');
                            $(this).closest('.msgManageItem').addClass($(this).attr('value'));
                        });
                    });
                }

                // 註冊對話事件
                activeMsgItem();

                for (let i = 0; i < $('.msgCharacter').length; i++) {
                    if ($('.msgCharacter').eq(i).val() == '沒有成員') {
                        $('.msgCharacter').eq(i).addClass('alert');
                    }
                }
            }

            // 問題
            if (getQuestionDone) {
                console.log('question', question);
                if (question != null) {
                    question.map((item, index) => {
                        $('#question').append(
                            generateQuestionInputItem({
                                questionData: item.options, // ['選項一','選項二'...]
                                answerID: item.answerID,
                                questionIndex: item.indexName ? item.indexName : index + 1, // 題號
                            }),
                        );
                    });

                    // 註冊刪除問題事件
                    activeDeleteQuestionItem();
                }
            }
        } catch (err) {
            console.log(err);
        }
    })();

    $('#watch').on('click', function () {
        setTimeout(function () {
            window.open('../Room/index.php');
        }, 200);
    });

    // toggleExpand
    $('.toggleExpand').click(function () {
        $(this).toggleClass('collapse');
    });

    $('#memberDisplayArea').click(function () {
        $('.memberArea').toggleClass('collapse');
    });

    $('#galleryDisplayArea').click(function () {
        $('.galleryArea').toggleClass('collapse');
    });

    $('#contentDisplayArea').click(function () {
        $('.messageArea').toggleClass('collapse');
    });

    $('#questionDisplayArea').click(function () {
        $('.questionArea').toggleClass('collapse');
    });

    // 角色
    $('#addMember').click(function () {
        $('#memberTab').attr('mode', 'addMember');
        openPop({ tab: $('#memberTab') });
    });

    $('#submit_avatar').click(function () {
        let edit = $(this).hasClass('edit');

        let valid = true;
        if ($('#add_member_name').val().trim().length == 0) {
            valid = false;
            showErrorMsg({
                target: $('#memberTab'),
                msg: '請輸入成員名稱',
            });
        }

        if (valid) {
            if (edit) {
                $.ajax({
                    type: 'POST',
                    url: `../Api/addRoomMember.php`,
                    data: {
                        id: $(this).attr('data-id'),
                        name: $('#add_member_name').val(),
                        img: $('#member_img').attr('src'),
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log('edit', data);
                        // 自動儲存後重整
                        $('#saveContent').click();
                    },
                });
            } else {
                $.ajax({
                    type: 'POST',
                    url: `../Api/addRoomMember.php`,
                    data: {
                        name: $('#add_member_name').val(),
                        img: $('#member_img').attr('src'),
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log('add', data);
                        // 自動儲存後重整
                        $('#saveContent').click();
                    },
                });
            }

            addMemberStep('submit');
        }
    });

    $('#delete_avatar').click(function () {
        $.ajax({
            type: 'POST',
            url: `../Api/deleteRoomMember.php`,
            data: {
                id: $(this).attr('data-id'),
            },
            dataType: 'json',
            success: function (data) {
                console.log('delete', data);
                // 自動儲存後重整
                $('#saveContent').click();
            },
        });
    });

    function activeMemberList() {
        $('.person').click(function () {
            let data = {
                id: $(this).attr('data-id'),
                img: $(this).find('.img').attr('src'),
                name: $(this).find('span.name').text(),
            };
            $('#memberTab').attr('mode', 'editMember');
            openPop({ tab: $('#memberTab'), data });
        });
    }

    // 角色 end

    // 圖片
    $('#addGallery').click(function () {
        openModal({
            targetModal: $('#galleryModal'),
            modalTitle: '新增圖片',
            actionType: 'add',
        });
    });

    // 處理上傳的圖片

    $('#upload_gallery_img').change(function () {
        let file = this.files[0];
        //用size属性判断文件大小不能超过1M ，前端直接判断的好处，免去服务器的压力。
        if (file.size > 1 * 1024 * 1024) {
            alert('Too Big! No more than 1MB');
        }

        let reader = new FileReader();
        reader.onload = function () {
            // 通过 reader.result 来访问生成的 base64 DataURL
            let base64 = reader.result;
            $('#galleryModal')
                .find('.cropImageResult')
                .append(`<img class="tmpUploadImg" src="${base64}" alt="uploadImage">`);

            // switch status
            $('#galleryModal').attr('image-status', 'upload');

            let image = $('#galleryModal').find('.tmpUploadImg')[0];
            let button = $('#galleryModal').find('.crop_button')[0];

            var cropper = new Cropper(image, {
                ready: function (event) {
                    // Zoom the image to its natural size
                    // cropper.zoomTo(1);
                },
                crop: function (event) {},
                zoom: function (event) {
                    // Keep the image in its natural size
                    if (event.detail.oldRatio === 1) {
                        event.preventDefault();
                    }
                },
            });

            button.onclick = function () {
                let croppedCanvas = cropper.getCroppedCanvas();

                $('#galleryModal').find('.cropImageResult').children().remove();
                $('#galleryModal')
                    .find('.cropImageResult')
                    .append(
                        `<img class="croppedImg" src="${croppedCanvas.toDataURL()}" alt="croppedImg" />`,
                    );
                // switch status
                $('#galleryModal').attr('image-status', 'crop');
            };
        };
        reader.readAsDataURL(file);
    });

    // 重新上傳
    $('#galleryModal')
        .find('.reUpload_button')
        .click(function () {
            resetGalleryModal();
        });

    // 確認
    $('#galleryModal')
        .find('.modalConfirm')
        .on('click', function () {
            const actionType = $('#galleryModal').attr('action-type');
            let valid = true;
            const imageName = $('#galleryModal').find('.add_image_name').val().trim();
            const imageSRC = $('#galleryModal').find('.croppedImg').attr('src');
            const updateImageID = $('#galleryModal').attr('data-id');

            if (imageName.length == 0) {
                valid = false;
                showErrorMsg({
                    target: $('#galleryModal'),
                    msg: '請輸入圖片名稱',
                });
            }

            // 不用檢查是否上傳圖片，因為沒上傳圖片不會有按鈕

            if (valid) {
                switch (actionType) {
                    case 'add':
                        $.ajax({
                            type: 'POST',
                            url: `../Api/addRoomGallery.php`,
                            data: {
                                name: imageName,
                                img: imageSRC,
                            },
                            dataType: 'json',
                            success: function (data) {
                                console.log('add success', data);
                                // 自動儲存後重整
                                $('#saveContent').click();
                            },
                        });

                        break;
                    case 'edit':
                        $.ajax({
                            type: 'POST',
                            url: `../Api/addRoomGallery.php`,
                            data: {
                                id: updateImageID,
                                name: imageName,
                                img: imageSRC,
                            },
                            dataType: 'json',
                            success: function (data) {
                                console.log('edit success', data);
                                // 自動儲存後重整
                                $('#saveContent').click();
                            },
                        });
                        break;
                }

                resetGalleryModal();
                closeModal();
                $('#galleryModal').removeAttr('data-id');
            }
        });

    // 取消
    $('#galleryModal')
        .find('.modalCancel')
        .on('click', function (e) {
            e.preventDefault();
            resetGalleryModal();
            closeModal();
            $('#galleryModal').removeAttr('data-id');
        });

    // 刪除
    $('#galleryModal')
        .find('.delete_button')
        .on('click', function () {
            $.ajax({
                type: 'POST',
                url: `../Api/deleteRoomGallery.php`,
                data: {
                    id: $('#galleryModal').attr('data-id'),
                },
                dataType: 'json',
                success: function (data) {
                    console.log('delete', data);
                    // 自動儲存後重整
                    $('#saveContent').click();
                },
            });
        });

    function resetGalleryModal() {
        // 重置 gallery
        $('#galleryModal').attr('image-status', 'init');
        $('#galleryModal').find('.cropImageResult').children().remove();
    }

    function activeGalleryItem() {
        $('.galleryItem').on('click', function () {
            let data = {
                id: $(this).attr('data-id'),
                img: $(this).find('.img').attr('src'),
                name: $(this).find('span.name').text(),
            };

            openModal({
                targetModal: $('#galleryModal'),
                modalTitle: '編輯圖片',
                actionType: 'edit',
            });
            $('#galleryModal').attr('data-id', data.id);
            $('#galleryModal').attr('image-status', 'crop');
            $('#galleryModal').find('.add_image_name').val(data.name);

            if (data.img) {
                $('#galleryModal')
                    .find('.cropImageResult')
                    .append(`<img class="croppedImg" src="${data.img}" alt="croppedImg" />`);
            }
        });
    }
    // 圖片 end

    // 對話

    $('.openModal[action-target="content"][action-type="add"]').click(function () {
        let newContentTypeOption = $('.newContentTypeOption').attr('select-id');
        if (newContentTypeOption) {
            openModal({
                targetModal: $('#addMsgModal'),
                modalTitle: '新增對話內容',
                actionType: 'add',
            });

            // 設定內容類型
            $('#addMsgModal').attr('content-type', newContentTypeOption);

            // 新增對話
            $('#addMsgModal .modalConfirm').on('click', function () {
                const targetModal = $('#addMsgModal');
                const characterID = targetModal.find('.selectCharacter input').attr('select-id');
                const characterName =
                    targetModal.find('.selectCharacter input').val() || '沒有成員';
                const msgType = $('.newContentTypeOption').attr('select-id');

                const typeText = {
                    text: '文字',
                    image: '圖片',
                    link: '連結',
                };

                let msgText = null;
                let msgImageID = null;
                let imageItem = null;

                let valid = true;
                let errorMsg = [];

                if (characterID.trim().length == 0) {
                    valid = false;
                    targetModal.find('.selectCharacter .drop__container').addClass('error');
                    errorMsg.push('請選擇角色');
                    showErrorMsg({
                        target: targetModal,
                        msg: errorMsg.join('、'),
                    });
                }

                switch (msgType) {
                    case 'text':
                        msgText = targetModal.find('.newMsg input[name="newMsg"]').val();

                        if (msgText.trim().length == 0) {
                            valid = false;
                            targetModal.find('.newMsg').addClass('error');

                            errorMsg.push('請輸入對話');

                            showErrorMsg({
                                target: targetModal,
                                msg: errorMsg.join('、'),
                            });
                        }
                        break;
                    case 'link':
                        msgText = targetModal.find('.newMsg input[name="newLink"]').val();

                        if (msgText.trim().length == 0) {
                            valid = false;
                            targetModal.find('.newMsg').addClass('error');

                            errorMsg.push('請輸入連結');

                            showErrorMsg({
                                target: targetModal,
                                msg: errorMsg.join('、'),
                            });
                        }
                        break;
                    case 'image':
                        msgImageID = targetModal.find('.imageForm input').attr('select-id');

                        imageItem = msgImageID
                            ? {
                                  id: msgImageID,
                                  name: $(
                                      `#images .galleryItem[data-id="${msgImageID}"] .name`,
                                  ).text(),
                              }
                            : null;
                        if (msgImageID.trim().length == 0) {
                            valid = false;
                            targetModal.find('.newMsg').addClass('error');

                            errorMsg.push('請選擇圖片');

                            showErrorMsg({
                                target: targetModal,
                                msg: errorMsg.join('、'),
                            });
                        }
                        break;
                }

                if (valid) {
                    $('#message').append(
                        generateMsgInputItem({
                            characterID: characterID,
                            characterName: characterName,
                            type: msgType,
                            typeText: typeText[msgType],
                            text: msgText,
                            imageID: imageItem == null ? ' ' : imageItem.id,
                            imageName: imageItem == null ? ' ' : imageItem.name,
                            memberData: members,
                            imageData: images,
                        }),
                    );

                    //  清空原本的內容類型
                    $('.newContentTypeOption').removeAttr('select-id');
                    $('.newContentTypeOption').val('');

                    // 註冊對話事件
                    activeMsgItem();

                    // 關閉 modal
                    closeModal();
                }
            });

            // 刪除對話
            $('.deleteMsgItem').on('click', function () {
                $(this).parent().remove();
            });
        } else {
            alert('請先選擇內容類型');
        }
    });

    function activeMsgItem() {
        $('.deleteMsgItem').on('click', function () {
            $(this).parent().remove();
        });
    }

    // 對話 end

    // 問題
    $('#newQuestionContent').on('blur', function () {
        let selectValue = $('#newQuestionContent').val();
        let selection = selectValue.split(',');
        if (selection[selection.length - 1] == '') {
            selection.pop();
        }
        $('.selectAnswer .select-items .option').remove();

        const optionItemTemplate = `<div class="option" data-id="{{key}}" value="{{key}}">{{text}}</div>`;

        function generateOptionItem(props) {
            let template = optionItemTemplate;

            return generateHtml(template, {
                ...props,
            });
        }

        if (selection.length > 1) {
            // 至少兩個選項
            for (i = 0; i < selection.length; i++) {
                // 不得為空, key 不能為 0 ，所以要加一
                if (selection[i] != '') {
                    $('.selectAnswer .select-items').append(
                        generateOptionItem({ key: i + 1, text: selection[i] }),
                    );
                }
            }
        }
    });
    // 新增
    $('#addQuestionContent').click(function () {
        let questionIndexName = $('#newQuestionIndexName').val();
        let answerID = $('#newQuestionContentAnswer').attr('select-id'); // 1, 2, 3 ... 因為 key 不能有 0
        let selectValue = $('#newQuestionContent').val();
        let selection = selectValue.split(',');
        if (selection[selection.length - 1] == '') {
            selection.pop();
        }
        let valid = true;

        if (questionIndexName.length < 0) {
            valid = true;
            $('#newQuestionIndexName').parent().addClass('error');
        }

        if (!answerID) {
            valid = false;
            $('#newQuestionContentAnswer').parent().addClass('error');
        }

        if (selection.length < 2) {
            valid = false;
            $('#newQuestionContent').parent().addClass('error');
        }

        if (valid) {
            $('#question').append(
                generateQuestionInputItem({
                    questionIndex: questionIndexName,
                    questionData: selection, // ['選項一','選項二'...]
                    answerID: answerID,
                }),
            );
            //  清空原本的
            initAddQuestionForm();

            // 註冊刪除問題事件
            activeDeleteQuestionItem();
        }
    });

    function initAddQuestionForm() {
        $('#newQuestionIndexName').val(''); // 題號
        $('#newQuestionContent').val(''); // 選項
        $('#newQuestionContentAnswer').removeAttr('select-id'); // 答案號碼
        $('#newQuestionContentAnswer').val(''); // 答案
    }

    // 刪除問題
    $('.deleteQuestionItem').on('click', function () {
        $(this).parent().remove();
    });

    function activeDeleteQuestionItem() {
        $('.deleteQuestionItem').on('click', function () {
            $(this).parent().remove();
        });
    }
    // 問題 end

    // 儲存
    $('#saveContent').on('click', function () {
        // 儲存對話內容
        let msgData = [];

        for (let i = 0; i < $('.msgManageItem').length; i++) {
            const id = $('.msgManageItem').eq(i).find('.msgCharacter').attr('select-id') || -1;
            const text = $('.msgManageItem').eq(i).find('.content').val();
            const type =
                $('.msgManageItem').eq(i).find('.contentTypeOption').attr('select-id') || 'text';
            const imageID = $('.msgManageItem').eq(i).find('.msgImage').attr('select-id') || -1;

            if (text.length > 0) {
                let tmpData = {
                    who: id,
                    type,
                };

                if (type == 'image') {
                    tmpData.imageID = imageID;
                }

                if (type == 'text' || type == 'link') {
                    tmpData.text = text;
                }

                msgData.push(tmpData);
            }
        }
        console.log(msgData);

        $.ajax({
            type: 'POST',
            url: `../Api/updateRoomContent.php`,
            dataType: 'json',
            data: {
                content: JSON.stringify(msgData),
            },
            success: function (data) {
                console.log(data);
            },
        });

        // 儲存題目
        let questionData = [];

        for (let i = 0; i < $('.questionManageItem').length; i++) {
            let questionIndexName = $('.questionManageItem').eq(i).find('.questionIndexName').val();
            let answerID =
                $('.questionManageItem').eq(i).find('.answerOption').attr('select-id') || -1;
            let options = $('.questionManageItem').eq(i).find('.content').val();
            let selection = options.split(',');
            if (selection[selection.length - 1] == '') {
                selection.pop();
            }

            if (selection.length > 0) {
                let tmpData = {
                    indexName: questionIndexName,
                    options: selection,
                    answerID,
                };
                questionData.push(tmpData);
            }
        }

        $.ajax({
            type: 'POST',
            url: `../Api/updateRoomQuestion.php`,
            dataType: 'json',
            data: {
                content: JSON.stringify(questionData),
            },
            success: function (data) {
                console.log(data);
                setTimeout(function () {
                    window.location.reload();
                }, 200);
            },
        });
    });
});
