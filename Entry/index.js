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
            $.ajax({
                type: 'POST',
                url: `../Api/getRoom.php`,
                dataType: 'json',
                data:{
                    roomID: code,
                },
                success: function (data) {
                    switch (data.status) {
                        case 'success':
                            setTimeout(function () {
                                window.location.href = '../PotterRoom/index.php';
                            }, 200);

                            break;
                        default:
                            showErrorMsg('房間不存在，請檢查後再輸入一次');
                            break;
                    }
                },
            });
        } else {
            showErrorMsg('請輸入六碼英數字');
        }
    });
});
