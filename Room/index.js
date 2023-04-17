$(document).ready(function () {
    let roomID;
    const windowID = generateUniqueId().slice(0, 10);

    activeLoading('init');

    const fetchRoomID = () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: `../Api/getRoomID.php`,
                success: function (res) {
                    console.log('roomID', res);
                    roomID = res;
                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    console.log('伺服器錯誤');
                    reject(false);
                },
            });
        });
    };

    (async function () {
        try {
            let getRoomIDDone = await fetchRoomID();

            if (getRoomIDDone) {
                init();
            }
        } catch (err) {
            console.log(err);
        }
    })();

    // 確定都有拿到資料
    const init = () => {
        let members = [];
        let message = [];
        let question = [];
        let currentMsgIndex = -1;
        let mainCharacterID = 0;
        console.log('init');

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
        (async function () {
            try {
                let getMemberDone = await fetchRoomMemberStatus();
                let getMsgDone = await fetchRoomMsgStatus();
                let getMainPersonDone = await fetchRoomMainPersonIDStatus();
                let getQuestionDone = await fetchRoomQuestionStatus();
                const startTime = new Date();
                let submittedTimes = 0; // 提交次數

                function showRecord() {
                    // 將兩個時間轉換成 JavaScript 的 Date 物件
                    const date1 = startTime;
                    const date2 = new Date();

                    // 取得兩個 Date 物件的時間戳記
                    const timestamp1 = date1.getTime();
                    const timestamp2 = date2.getTime();

                    const minutes = 60;
                    const hours = 60 * 24;

                    // 計算毫秒差
                    const diffSeconds = (Math.round((timestamp2 - timestamp1) / 1000) * 10) / 10;

                    const totalHours = Math.floor(diffSeconds / hours);
                    const formattedHours = totalHours > 9 ? totalHours : `0${totalHours}`;

                    const totalMinutes = Math.floor(diffSeconds / minutes);
                    const formattedMinutes = totalMinutes > 9 ? totalMinutes : `0${totalMinutes}`;
                    const totalSeconds = diffSeconds - minutes * totalMinutes;
                    const formattedSeconds = totalSeconds > 9 ? totalSeconds : `0${totalSeconds}`;

                    const formattedTime =
                        totalHours === 0
                            ? `${formattedMinutes}:${formattedSeconds}`
                            : `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

                    const name = $('#submitName').val();
                    $('.congrats .text span').text(name);
                    $('.congrats .time span').text(formattedTime);
                    $('.congrats .submitTimes span').text(submittedTimes);

                    $('#submitAnswer').hide();
                }

                if (getMemberDone && getMsgDone && getMainPersonDone && getQuestionDone) {
                    closeLoading();
                    console.log('start:', startTime.toDateString());
                    $('#triggerMsgNext').on('click', function () {
                        if (currentMsgIndex < message.length - 1) {
                            currentMsgIndex++;
                            dataLayer.push({
                                event: 'nextMsg',
                                roomID: roomID,
                                windowID: windowID,
                            });

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
                                    direction:
                                        message[currentMsgIndex].who == mainCharacterID ? 1 : 0,
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

                        // 累積提交次數
                        submittedTimes++;

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

                                showRecord();
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
                                $('#question .questionItem')
                                    .eq(i)
                                    .find('input')
                                    .removeClass('alert');
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
    };
});
