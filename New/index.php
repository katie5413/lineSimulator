<?php
session_start();
include "../pdoInc.php";
?>

<html>

<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" type="text/css" href="../Common/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Components/TimeTunnel/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Components/CybrBtn/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Components/LoginForm/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Components/Input/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Components/ErrorMsg/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="index.css?v=<?php echo time(); ?>">
    <!-- Google Tag Manager -->
    <script>
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-TWGQMN8');
    </script>
    <!-- End Google Tag Manager -->
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-CMZ45H5BZ4"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'G-CMZ45H5BZ4');
    </script>
</head>

<body>
    <div class="timeTunnel">
        <img class="img" src="../Images/bg.png" alt="" />
        <div class="cover" />
    </div>

    <div class="loginForm">
        <div class="passCodeInput">
            <div class="container">
                <div class="typedStrings">
                    ???????????????
                </div>
                <div class="passcodeArea">
                    <input autoFocus type="text" maxLength="1" autocomplete="new-password" />
                    <input type="text" maxLength="1" autocomplete="new-password" />
                    <input type="text" maxLength="1" autocomplete="new-password" />
                    <input type="text" maxLength="1" autocomplete="new-password" />
                    <input type="text" maxLength="1" autocomplete="new-password" />
                    <input type="text" maxLength="1" autocomplete="new-password" />
                </div>
                <div class="input_area">
                    <div class="input_field">
                        <input type="text" id="newRoomName" name="newRoomName" class="name required" placeholder="????????????????????????" />
                    </div>
                    <div class="input_field">
                        <input type="text" id="newRoomManagerEmail" name="newRoomManagerEmail" class="email required" placeholder="????????????????????????" />
                    </div>
                    <div class="input_field input_with_peek">
                        <input type="password" id="password" name="password" class="password required" placeholder=" ???????????????" />
                        <button id="peekPassword" class="button peek">
                            <img src="../Images/icon/eye.svg" class="open" alt="peek" active="false" />
                            <img src="../Images/icon/closeEye.svg" class="close" alt="close peek" active="true" />
                        </button>
                    </div>
                    <div class="input_field">
                        <input type="password" id="passwordCheck" name="passwordCheck" class="password required" placeholder="??????????????????" />
                    </div>
                </div>
                <div class="errorMsg">
                    <img class="icon" src="../Images/icon/error.svg" alt="error" />
                    <span class="text">errorText</span>
                </div>
                <div class="btnArea">
                    <button id="addNewRoomBtn" class="cybrBtn" type="button">
                        ??????????????????<span aria-hidden>_</span>
                        <span aria-hidden class="cybrBtn_Tag">
                            NEW
                        </span>
                    </button>
                </div>
            </div>

            <div class="btnOutsideArea">
                <a class="cybrBtn secondary" href="../Backstage/index.php">
                    ????????????<span aria-hidden>_</span>
                    <span aria-hidden class="cybrBtn_Tag">
                        Manage
                    </span>
                </a>
                <a class="cybrBtn third" type="button" href="../index.php">
                    ????????????<span aria-hidden>_</span>
                    <span aria-hidden class="cybrBtn_Tag">
                        Visitor
                    </span>
                </a>
            </div>
        </div>
    </div>
    <script src="../Common/global.js?v=<?php echo time(); ?>"></script>
    <script src="../Common/util.js?v=<?php echo time(); ?>"></script>
    <script src="../Dependencies/jquery/jquery.min.js"></script>
    <script src="../Components/CybrBtn/index.js?v=<?php echo time(); ?>"></script>
    <script src="../Components/ErrorMsg/index.js?v=<?php echo time(); ?>"></script>
    <script src="index.js?v=<?php echo time(); ?>"></script>
</body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TWGQMN8" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

</html>