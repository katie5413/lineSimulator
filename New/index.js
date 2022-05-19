$(document).ready(function () {
    const newRoomId = generateUniqueId().slice(0, 6).toUpperCase();
    const newRoomArr = newRoomId.split('');

    for (let i = 0; i < newRoomArr.length; i++) {
        $('#code_area input')[i].value = newRoomArr[i];
    }

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
                showErrorMsg('所有欄位皆為必填');
            }
        }

        if ($('#password').val() !== $('#passwordCheck').val()) {
            valid = false;
            showErrorMsg('兩次密碼不相符，請再檢查一次');
        }

        if (valid) {
            // Run $.ajax() here

            $.ajax({
                type: 'POST',
                url: `../Api/addRoom.php`,
                data: {
                    code: newRoomId,
                    newRoomName: $('#newRoomName').val(),
                    password: $('#password').val(),
                },
                success: function (data) {
                    const statusData = JSON.parse(data);
                    console.log(statusData.status);
                    switch (statusData.status) {
                        case 'success':
                            setTimeout(function () {
                                window.location.href = '../Backstage/index.php';
                            }, 200);

                            break;
                        case 'duplicate':
                            showErrorMsg('該房間已存在，請再試一次');
                            break;
                        default:
                            showErrorMsg('網路錯誤，請再試一次');
                            break;
                    }
                },
            });
        } else {
            // Prevent the form from submitting
            event.preventDefault();
        }
    });
});
