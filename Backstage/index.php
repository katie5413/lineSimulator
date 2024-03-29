<?php
session_start();
include "../pdoInc.php";
?>

<html>

<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="robots" content="noindex">
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
        })(window, document, 'script', 'dataLayer', 'GTM-MNWLVHK');
    </script>
    <!-- End Google Tag Manager -->
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-8DB50MGVFV"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'G-8DB50MGVFV');
    </script>
    <title>超時空座談｜後台</title>
</head>

<body>
    <div class="timeTunnel">
        <img class="img" src="../Images/bg.png" alt="" />
        <div class="cover" />
    </div>

    <div class="loginForm">
        <div class="passCodeInput">
            <div class="container">
                <img class="board" src="../Images/board.png" alt="" />
                <div class="passcodeArea">
                    <input autoFocus type="text" maxLength="1" autocomplete="new-password" />
                    <input type="text" maxLength="1" autocomplete="new-password" />
                    <input type="text" maxLength="1" autocomplete="new-password" />
                    <input type="text" maxLength="1" autocomplete="new-password" />
                    <input type="text" maxLength="1" autocomplete="new-password" />
                    <input type="text" maxLength="1" autocomplete="new-password" />
                    <div class="form__input password">
                        <input class="input" type="password" id="password" name="password" placeholder="密碼" type="text" autocomplete="new-password" />
                    </div>
                    <div class="errorMsg">
                        <img class="icon" src="../Images/icon/error.svg" alt="error" />
                        <span class="text">errorText</span>
                    </div>
                </div>
            </div>

            <div class="btnArea">
                <a class="entryBtn" type="button" href="../index.php">
                    使用
                </a>
                <a class="entryBtn" type="button" href="../New/index.php">
                    創建
                </a>
                <button class="entryBtn" type="button">
                    編輯
                </button>
            </div>
            <div class="bottomBtnArea">
                <button id="loginBtn" class="entryBtn" type="button">
                    登入
                </button>
            </div>
        </div>
    </div>
    <script src="../Common/global.js?v=<?php echo time(); ?>"></script>
    <script src="../Dependencies/jquery/jquery.min.js"></script>
    <script src="../Components/CybrBtn/index.js?v=<?php echo time(); ?>"></script>
    <script src="../Components/ErrorMsg/index.js?v=<?php echo time(); ?>"></script>
    <script src="index.js?v=<?php echo time(); ?>"></script>
</body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MNWLVHK" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

</html>