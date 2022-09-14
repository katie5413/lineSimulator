$(document).ready(function () {
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
            url: `../Api/updatRoomName.php`,
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
    showMember();
    addMemberStep('init');

    $('#addMember').click(function () {
        $('#memberTab').attr('mode', 'addMember');
        openPop({ tab: $('#memberTab') });
    });

    $('#submit_avatar').click(function () {
        let edit = $(this).hasClass('edit');

        let valid = true;
        if ($('#add_member_name').val().trim().length == 0) {
            valid = false;
            showErrorMsg('請輸入成員名稱');
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

    function showMember() {
        $.ajax({
            type: 'GET',
            url: `../Api/getRoomMember.php`,
            dataType: 'json',
            success: function (memberData) {
                $('.members').children().remove();

                if (memberData.length == 0) {
                    $('.memberArea').removeClass('active');
                } else {
                    $('.memberArea').addClass('active');
                    memberData.forEach((item) => {
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
            },
        });
    }

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

    // 對話

    $.ajax({
        type: 'POST',
        url: `../Api/getRoom.php`,
        dataType: 'json',
        data: {
            roomID: $('#roomCode').text(),
        },
        success: function (data) {
            const messageData = JSON.parse(data.roomMsg);
            const memberData = data.roomMember;
            const questionData = JSON.parse(data.roomQuestion);
            setMemberData(memberData);

            if (messageData != null) {
                messageData.map((item) => {
                    let msgOwner = memberData.filter((person) => person.id == item.who)[0];

                    $('#message').append(
                        generateMsgInputItem({
                            id: item.who,
                            name: item.who == -1 || msgOwner == null ? '沒有成員' : msgOwner.name,
                            text: item.text,
                            memberData: memberData,
                        }),
                    );
                });
            }

            // 註冊刪除對話事件
            activeDeleteMsgItem();

            for (let i = 0; i < $('.msgCharactor').length; i++) {
                if ($('.msgCharactor').eq(i).val() == '沒有成員') {
                    $('.msgCharactor').eq(i).addClass('alert');
                }
            }

            // 問題
            console.log(questionData);
            if (questionData != null) {
                questionData.map((item, index) => {
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
        },
    });

    let memberData = [];

    function setMemberData(data) {
        memberData = data;
    }

    // 新增對話
    $('#addMsgContent').on('click', function () {
        let id = $('#selectMsgCharactor').attr('select-id');
        let name = $('#selectMsgCharactor').val() || '沒有成員';
        let text = $('#newMsgContent').val();
        let valid = true;

        if (id.trim().length == 0) {
            valid = false;
            $('#selectMsgCharactor').parent().addClass('error');
        }

        if (text.trim().length == 0) {
            valid = false;
            $('#newMsgContent').parent().addClass('error');
        }

        if (valid) {
            $('#message').append(
                generateMsgInputItem({
                    id: id,
                    name: name,
                    text: text,
                    memberData: memberData,
                }),
            );
            //  清空原本的
            initAddMsgForm();

            // 註冊刪除對話事件
            activeDeleteMsgItem();
        }
    });

    function initAddMsgForm() {
        $('#selectMsgCharactor').removeAttr('select-id');
        $('#selectMsgCharactor').val('');
        $('#newMsgContent').val('');
    }

    // 刪除對話
    $('.deleteMsgItem').on('click', function () {
        $(this).parent().remove();
    });

    function activeDeleteMsgItem() {
        $('.deleteMsgItem').on('click', function () {
            $(this).parent().remove();
        });
    }

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

    $('#contentDisplayArea').click(function () {
        $('.messageArea').toggleClass('collapse');
    });

    $('#questionDisplayArea').click(function () {
        $('.questionArea').toggleClass('collapse');
    });

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

    // 儲存
    $('#saveContent').on('click', function () {
        // 儲存對話內容
        let msgData = [];

        for (let i = 0; i < $('.msgManageItem').length; i++) {
            let id = $('.msgManageItem').eq(i).find('.msgCharactor').attr('select-id') || -1;
            let text = $('.msgManageItem').eq(i).find('.content').val();

            if (text.length > 0) {
                let tmpData = {
                    who: id,
                    text: text,
                };
                msgData.push(tmpData);
            }
        }

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
