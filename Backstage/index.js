$(document).ready(function () {
    // 輸入房間代碼

    const inputs = document.querySelectorAll('.passcodeArea > input');
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
                $('#loginBtn').focus();
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
                console.log('🐰🥚 FOUND!!! Cmd + Backspace = clear all');
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

    $('#loginBtn').on('click', function () {
        const code = getCode();
        // 是否六碼
        if (code.length === 6) {
            // 有輸入密碼？
            if ($('#password').val().length != 0) {
                console.log('enter password');
                $.ajax({
                    type: 'POST',
                    url: `../Api/getBackstage.php`,
                    data: {
                        code: code,
                        password: $('#password').val(),
                    },
                    dataType: 'json',
                    success: function (data) {
                        console.log(data.status);
                        switch (data.status) {
                            case 'backstage':
                                setTimeout(function () {
                                    window.location.href = '../ManageRoom/index.php';
                                }, 200);
                                break;
                            case 'wrongPass':
                                showErrorMsg({
                                    target: $('.loginForm'),
                                    msg: '密碼錯誤',
                                });
                                break;
                            default:
                                showErrorMsg({
                                    target: $('.loginForm'),
                                    msg: '房間不存在，請檢查後再輸入一次',
                                });
                                break;
                        }
                    },
                });
            } else {
                showErrorMsg({
                    target: $('.loginForm'),
                    msg: '請輸入密碼',
                });
            }
        } else {
            showErrorMsg({
                target: $('.loginForm'),
                msg: '請輸入六碼英數字',
            });
        }
    });
});
