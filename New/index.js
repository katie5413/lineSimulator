$(document).ready(function () {
    // 輸入房間代碼
    const inputs = document.querySelectorAll('.passcodeArea > input');

    const newRoomId = generateUniqueId().slice(0, 6).toUpperCase();
    const newRoomArr = newRoomId.split('');

    for (let i = 0; i < newRoomArr.length; i++) {
        inputs[i].value = newRoomArr[i];
    }

    inputs[0].focus();
    for (elem of inputs) {
        elem.addEventListener('input', function () {
            const value = this.value;
            const nextElement = this.nextElementSibling;
            if (value === '' || !nextElement) {
                return;
            }
            nextElement.focus();

            hideErrorMsg();

            const code = getCode();
            if (code !== -1) {
                // 檢查房間是否存在
                $.ajax({
                    type: 'POST',
                    url: `../Api/getBackstage.php`,
                    data: {
                        code: code,
                        password: null,
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data.status);
                        switch (data.status) {
                            case 'backstage':
                            case 'wrongPass':
                                showErrorMsg({
                                    target: $('.loginForm'),
                                    msg: '房間已存在，請更換代號',
                                });
                                break;
                            default:
                                showErrorMsg({
                                    target: $('.loginForm'),
                                    msg: '房間可使用',
                                });
                                break;
                        }
                    },
                });
            }
        });
    }
    for (let elem of inputs) {
        elem.addEventListener('keydown', function (event) {
            //Right Arrow Key
            if (event.keyCode == 39) {
                this.nextElementSibling.focus();
            }
            //Left Arrow Key
            //Add Highlight
            if (event.keyCode == 37) {
                this.previousElementSibling.focus();
            }
            //Backspace Key
            if (event.keyCode == 8 && event.metaKey) {
                for (innerElem of inputs) {
                    innerElem.value = '';
                }
                inputs[0].focus();
            } else if (event.keyCode == 8) {
                if (elem.value === '') {
                    this.previousElementSibling.focus();
                    return;
                }
                elem.value = '';
            }
        });
    }

    const getCode = () => {
        let code = '';
        for (let elem of inputs) {
            code += elem.value;
        }

        return code.length === 6 ? code.toUpperCase() : -1;
    };

    $('input').each(function () {
        $(this).on('input', function () {
            hideErrorMsg();
        });
    });

    $('#peekPassword').click(function () {
        const newAttrType = $('#password').attr('type') === 'password' ? 'text' : 'password';
        $('#password').attr('type', newAttrType);
        $(this).toggleClass('active');
    });

    $('#addNewRoomBtn').click(function (event) {
        var valid = true;
        // If .required's value's length is zero

        for (let inputField of $('.required')) {
            if (inputField.value.length === 0) {
                // Usually show some kind of error message here
                valid = false;
                showErrorMsg({
                    target: $('.loginForm'),
                    msg: '所有欄位皆為必填',
                });
            }
        }

        if ($('#password').val() !== $('#passwordCheck').val()) {
            valid = false;
            showErrorMsg({
                target: $('.loginForm'),
                msg: '兩次密碼不相符，請再檢查一次',
            });
        }

        if (valid) {
            // Run $.ajax() here

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const mode = urlParams.get('mode');
            let inputCode = newRoomId;

            if (mode == 'god') {
                inputCode = getCode();
            }

            setTimeout(function () {
                $.ajax(
                    {
                        type: 'POST',
                        url: `../Api/addRoom.php`,
                        data: {
                            code: inputCode,
                            managerEmail: $('#newRoomManagerEmail').val(),
                            newRoomName: $('#newRoomName').val(),
                            password: $('#password').val(),
                        },
                        success: function (data) {
                            const statusData = JSON.parse(data);
                            console.log(statusData.status);
                            switch (statusData.status) {
                                case 'success':
                                    setTimeout(function () {
                                        window.location.href = '../ManageRoom/index.php';
                                    }, 200);

                                    break;
                                case 'duplicate':
                                    showErrorMsg({
                                        target: $('.loginForm'),
                                        msg: '該房間已存在，請再試一次',
                                    });
                                    break;
                                default:
                                    showErrorMsg({
                                        target: $('.loginForm'),
                                        msg: '網路錯誤，請再試一次',
                                    });
                                    break;
                            }
                        },
                    },
                    1000,
                );
            });
        } else {
            // Prevent the form from submitting
            event.preventDefault();
        }
    });
});
