$(document).ready(function () {
    let members = [];
    let message = [];
    let question = [];
    let images = [];
    let currentMsgIndex = -1;
    let mainCharacterID = 0;

    $('#backBtn').on('click', function () {
        history.back();
    });

    // show pillMsg
    function fetchRoomMemberStatus() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: `../Api/getRoomMember.php`,
                dataType: 'json',
                success: function (memberData) {
                    members = memberData;

                    $('#message').append(generatePillMsg({ member: members }));
                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    reject(false);
                },
            });
        });
    }

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

    function fetchRoomQuestionStatus() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: `../Api/getRoomQuestion.php`,
                dataType: 'json',
                success: function (data) {
                    const questionData = JSON.parse(data);
                    questionData.forEach((questionItem) => {
                        question.push(questionItem);
                    });
                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    reject(false);
                },
            });
        });
    }

    function fetchRoomMainPersonIDStatus() {
        return new Promise((resolve, reject) => {
            // get mainCharacterID
            $.ajax({
                type: 'GET',
                url: `../Api/getRoomMainPersonID.php`,
                success: function (id) {
                    mainCharacterID = id;
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

    // 確定都有拿到資料
    (async function () {
        try {
            let getMemberDone = await fetchRoomMemberStatus();
            let getMsgDone = await fetchRoomMsgStatus();
            let getMainPersonDone = await fetchRoomMainPersonIDStatus();
            let getQuestionDone = await fetchRoomQuestionStatus();
            let getImageDone = await fetchRoomImageStatus();

            if (
                getMemberDone &&
                getMsgDone &&
                getMainPersonDone &&
                getQuestionDone &&
                getImageDone
            ) {
                console.log('images', images);
                console.log('message', message);
                $('#triggerMsgNext').on('click', function () {
                    if (currentMsgIndex < message.length - 1) {
                        currentMsgIndex++;
                        playSound('bell');

                        let msgOwner = members.filter(
                            (person) => person.id == message[currentMsgIndex].who,
                        )[0];

                        let imageItem = null;

                        let text = null;

                        switch (message[currentMsgIndex].type) {
                            case 'text':
                                text = message[currentMsgIndex].text;
                                break;
                            case 'image':
                                images.forEach((image) => {
                                    if (image.id == message[currentMsgIndex].imageID) {
                                        imageItem = image;
                                    }
                                });
                                break;
                        }

                        let key = generateUniqueId();
                        let name = msgOwner == null ? '沒有成員' : msgOwner.name;

                        $('#message').append(
                            generateMsgItem({
                                key: key,
                                type: message[currentMsgIndex].type,
                                characterName: msgOwner == null ? '沒有成員' : msgOwner.name,
                                characterImg: msgOwner == null ? null : msgOwner.img,
                                msgImg: imageItem == null ? ' ' : imageItem.img,
                                msgImgName: imageItem == null ? ' ' : imageItem.name,
                                direction: message[currentMsgIndex].who == mainCharacterID ? 1 : 0,
                            }),
                        );

                        // 避免 XSS
                        $(`.messageItem[data-key="${key}"] .name`).text(name);
                        if (message[currentMsgIndex].type == 'text') {
                            $(`.messageItem[data-key="${key}"] .text`).text(text);
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
                            console.log();
                            if (e.target == document.getElementById('quickView')) {
                                closeModal();
                            }
                            // $('.modalWrapper').on('click', function () {
                            //     close = false;
                            //     console.log(close);
                            // });
                            // console.log(close);
                            // if (close) {
                            //     closeModal();
                            // }
                        });
                    }
                });
                $('#triggerMsgPrev').on('click', function () {
                    if (currentMsgIndex >= 0) {
                        currentMsgIndex--;

                        $('#message .messageItem').last().remove();

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

                        if (valid) {
                            $('.congrats').addClass('active');
                            playSound('correct');
                        } else {
                            $('.congrats').removeClass('active');

                            showErrorMsg({
                                target: $('.room_question'),
                                msg: '再檢查一下吧ＱＱ',
                            });
                            playSound('incorrect');
                        }
                    } else {
                        showErrorMsg({
                            target: $('.room_question'),
                            msg: '有未作答的題目',
                        });
                        playSound('incorrect');
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
            }
        } catch (err) {
            console.log(err);
        }
    })();

    function playSound(type) {
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
    }
});
