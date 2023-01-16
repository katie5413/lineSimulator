$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const roomID = urlParams.get('roomCode');
    const windowID = generateUniqueId().slice(0, 10);

    // 先檢查是否存在
    $.ajax({
        type: 'POST',
        url: `../Api/checkRoomExist.php`,
        data: {
            roomID,
        },
        dataType: 'json',
        success: function (res) {
            console.log('res', res.status);

            if (res.status != 'exist') {
                alert('房間不存在');

                window.location.href = '../index.php';
            } else {
                dataLayer.push({ event: 'enterRoom', roomID: roomID, windowID: windowID });
            }
        },
        fail: function (xhr, ajaxOptions, thrownError) {
            console.log('伺服器錯誤');
        },
    });

    let members = [];
    let message = [];
    let question = [];
    let currentMsgIndex = -1;
    let mainCharacterID = 0;

    $('#backBtn').on('click', function () {
        history.back();
    });

    // show pillMsg
    const fetchRoomMemberStatus = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: `../Api/getRoomMember.php`,
                data: {
                    roomID,
                },
                dataType: 'json',
                success: function (memberData) {
                    console.log('member', memberData);

                    if (memberData.length > 0) {
                        members = memberData;
                        $('#message').append(generatePillMsg({ member: members }));
                    }

                    console.log('載入成員成功');
                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    console.log('載入成員失敗');
                    reject(false);
                },
            });
        });
    };

    const fetchRoomMsgStatus = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: `../Api/getRoomMsg.php`,
                data: {
                    roomID,
                },
                dataType: 'json',
                success: function (msgData) {
                    const messageData = msgData.length > 0 ? JSON.parse(msgData) : null;

                    console.log('message', messageData);

                    // 創建時沒有內容，會是 null ，因此會報錯
                    if (messageData != null) {
                        messageData.forEach((msg) => {
                            message.push(msg);
                        });
                        message = messageData;
                    }

                    console.log('載入對話成功');
                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    console.log('載入對話失敗');
                    reject(false);
                },
            });
        });
    };

    const fetchRoomQuestionStatus = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: `../Api/getRoomQuestion.php`,
                data: {
                    roomID,
                },
                dataType: 'json',
                success: function (data) {
                    const questionData = JSON.parse(data);
                    console.log('question', questionData);
                    if (questionData != null) {
                        questionData.forEach((questionItem) => {
                            question.push(questionItem);
                        });
                    }
                    console.log('載入題目成功');
                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    console.log('載入題目失敗');
                    reject(false);
                },
            });
        });
    };

    const fetchRoomMainPersonIDStatus = () => {
        return new Promise((resolve, reject) => {
            // get mainCharacterID
            $.ajax({
                type: 'POST',
                url: `../Api/getRoomMainPersonID.php`,
                data: {
                    roomID,
                },
                success: function (id) {
                    mainCharacterID = id;
                    console.log('載入角色視角成功');
                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    console.log('載入角色視角失敗');
                    reject(false);
                },
            });
        });
    };

    const playSound = (type) => {
        let sound;
        switch (type) {
            case 'bell':
                sound = new Audio('../sound/bell.mp3');
                break;
            case 'correct':
                sound = new Audio('../sound/correct.mp3');
                break;
            case 'incorrect':
                sound = new Audio('../sound/incorrect.mp3');
                break;
        }

        sound.play();
    };

    // 確定都有拿到資料
    (async function () {
        try {
            let getMemberDone = await fetchRoomMemberStatus();
            let getMsgDone = await fetchRoomMsgStatus();
            let getMainPersonDone = await fetchRoomMainPersonIDStatus();
            let getQuestionDone = await fetchRoomQuestionStatus();

            if (getMemberDone && getMsgDone && getMainPersonDone && getQuestionDone) {
                $('#triggerMsgNext').on('click', function () {
                    if (currentMsgIndex < message.length - 1) {
                        currentMsgIndex++;
                        dataLayer.push({ event: 'nextMsg', roomID: roomID, windowID: windowID });

                        playSound('bell');

                        let msgOwner = members.filter(
                            (person) => person.id == message[currentMsgIndex].who,
                        )[0];

                        let imageItem = null;

                        let text = null;

                        switch (message[currentMsgIndex].type) {
                            case 'text':
                            case undefined:
                            case 'link':
                                text = message[currentMsgIndex].text;
                                break;
                            case 'image':
                                imageItem = message[currentMsgIndex].imageSRC;
                                break;
                        }

                        let key = generateUniqueId();
                        let name = msgOwner == null ? '沒有成員' : msgOwner.name;

                        $('#message').append(
                            generateMsgItem({
                                key: key,
                                type:
                                    message[currentMsgIndex].type == undefined
                                        ? 'text'
                                        : message[currentMsgIndex].type,
                                characterName: msgOwner == null ? '沒有成員' : msgOwner.name,
                                characterImg: msgOwner == null ? null : msgOwner.img,
                                msgImg: imageItem,
                                direction: message[currentMsgIndex].who == mainCharacterID ? 1 : 0,
                            }),
                        );

                        // 避免 XSS
                        $(`.messageItem[data-key="${key}"] .name`).text(name);
                        if (
                            message[currentMsgIndex].type == 'text' ||
                            message[currentMsgIndex].type == undefined
                        ) {
                            $(`.messageItem[data-key="${key}"] .text`).text(text);
                        }

                        if (message[currentMsgIndex].type == 'link') {
                            $(`.messageItem[data-key="${key}"] .text a`).text(text);
                            $(`.messageItem[data-key="${key}"] .text a`).attr('href', text);
                        }

                        $(`.messageItem[data-key="${key}"]`)[0].scrollIntoView();

                        $('#message').scrollTop += 60;

                        if (currentMsgIndex == message.length - 1) {
                            $(this).removeClass('active');
                        }

                        $('#triggerMsgPrev').addClass('active');

                        $('.messageItem.image .text').on('click', function () {
                            openModal({
                                targetModal: $('#quickView'),
                            });

                            $('#quickView .content .middle img').attr(
                                'src',
                                $(this).find('img').attr('src'),
                            );
                        });

                        $('#quickView').on('click', function (e) {
                            let close = true;
                            if (e.target == document.getElementById('quickView')) {
                                closeModal();
                            }
                        });
                    }
                });
                $('#triggerMsgPrev').on('click', function () {
                    if (currentMsgIndex >= 0) {
                        currentMsgIndex--;

                        $('#message .messageItem').last().remove();

                        dataLayer.push({ event: 'preMsg', roomID: roomID, windowID: windowID });

                        if (currentMsgIndex == -1) {
                            $('#triggerMsgPrev').removeClass('active');
                        } else {
                            $('#triggerMsgPrev').addClass('active');
                        }
                        $('#triggerMsgNext').addClass('active');
                    }
                });

                let answer = [];

                // 題目
                if (question != null) {
                    question.map((item, index) => {
                        $('#question').append(
                            generateQuestionItem({
                                questionData: item.options, // ['選項一','選項二'...]
                                questionIndex: item.indexName ? item.indexName : index + 1, // 題號
                            }),
                        );
                        answer.push(item.answerID);
                    });
                    activeQuestionItemFunction();
                }

                $('#questionBtn').on('click', function () {
                    $('.room_question').addClass('active');
                });
                $('#closeQA').on('click', function () {
                    $('.room_question').removeClass('active');
                });

                $('#submitAnswer').click(() => {
                    let userAnswer = getAnswer();
                    console.log(userAnswer.length, answer.length);
                    if (userAnswer.length == answer.length) {
                        let valid = checkAnswer(userAnswer, answer);
                        dataLayer.push({
                            event: 'submitAnswer',
                            roomID: roomID,
                            windowID: windowID,
                        });

                        if (valid) {
                            $('.congrats').addClass('active');
                            playSound('correct');
                            dataLayer.push({
                                event: 'correct',
                                roomID: roomID,
                                windowID: windowID,
                            });
                        } else {
                            $('.congrats').removeClass('active');

                            showErrorMsg({
                                target: $('.room_question'),
                                msg: '再檢查一下吧ＱＱ',
                            });
                            playSound('incorrect');
                            dataLayer.push({
                                event: 'incorrect',
                                roomID: roomID,
                                windowID: windowID,
                                answer: userAnswer,
                            });
                        }
                    } else {
                        showErrorMsg({
                            target: $('.room_question'),
                            msg: '有未作答的題目',
                        });
                        playSound('incorrect');

                        dataLayer.push({
                            event: 'notAllFill',
                            roomID: roomID,
                            windowID: windowID,
                        });
                    }
                });

                // 拿到使用者填答
                function getAnswer() {
                    let userAnswer = [];
                    for (let i = 0; i < $('.answerOption').length; i++) {
                        let selected = $('.answerOption').eq(i).attr('select-id');
                        if (selected != '') {
                            userAnswer.push(selected);
                        }
                    }
                    return userAnswer;
                }

                // 檢查答案是否相同
                function checkAnswer(userAnswer, answer) {
                    let valid = true;
                    for (let i = 0; i < answer.length; i++) {
                        if (userAnswer[i] != answer[i]) {
                            valid = false;
                            $('#question .questionItem').eq(i).find('input').addClass('alert');
                        } else {
                            $('#question .questionItem').eq(i).find('input').removeClass('alert');
                        }
                    }
                    return valid;
                }

                // first msg
                $('#triggerMsgNext').click();
            }
        } catch (err) {
            console.log(err);
        }
    })();
});
