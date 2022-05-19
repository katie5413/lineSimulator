<?php
session_start();
include "../pdoInc.php";
?>

<html>

<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover" />
    <link rel="stylesheet" type="text/css" href="../Common/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Components/DropBox/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Components/PillMsg/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Components/Button/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Components/Notice/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Components/MessageItem/index.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" type="text/css" href="../Components/QuestionItem/index.css?v=<?php echo time(); ?>">
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
    <div class="room_bg">
        <div class="room_content_overlay">
        </div>
        <div class="room_header">
            <div class="room_header_left">
                <img id="backBtn" src="../Images/icon/arrowBack.svg" alt="back" />
                <div class="room_name"><?php echo $_SESSION['roomName']; ?>（<?php echo $_SESSION['roomMemberNumber']; ?>）</div>
            </div>
            <div class="room_header_right">
                <img src="../Images/icon/search.svg" alt="search" />
                <img src="../Images/icon/telephone.svg" alt="telephone" />
                <img src="../Images/icon/menu.svg" alt="menu" />
                <img id="questionBtn" src="../Images/icon/question.png" alt="question" />
            </div>
        </div>
        <div class="room_content">

            <div class="noticeArea active">
                <div class="notice">
                    <div class="left">
                        <img class="icon" src="../Images/icon/speaker.svg" alt="speaker" />
                        <div class="text">點擊右下方播放鍵開始閱讀</div>
                    </div>
                    <button id="closeSpeaker" class="button" type="button">
                        不再顯示
                    </button>
                </div>
            </div>

            <div class="messageArea">
                <div id="message">
                </div>
            </div>
        </div>
        <div class="bottomArea">
            <button id="triggerMsgPrev" class="button prev" type="button">
                <img src="../Images/icon/start.svg" alt="prev" />
            </button>
            <div class="function">
                <span class="text">Aa</span>
            </div>
            <button id="triggerMsgNext" class="button next active" type="button">
                <img src="../Images/icon/start.svg" alt="next" />
            </button>
        </div>
    </div>

    <div class="room_question">
        <div class="wrapper">
            <div class="blockTitle">作答區
                <img id="closeQA" src="../Images/icon/close.svg" alt="close">
            </div>
            <div id="question"></div>
            <div class="errorMsg">
                <img class="icon" src="../Images/icon/error.svg" alt="error" />
                <span class="text">errorText</span>
            </div>
            <div class="congrats">
                <span>🥳</span>
                <span class="text">答對了！你是梅林本人吧</span>
                <span>🎉</span>
            </div>
            <div class="function_button">
                <button id="submitAnswer" class="button button-fill">提交</button>
            </div>
        </div>
    </div>
    <script src="../Common/util.js"></script>
    <script src="../Common/global.js"></script>
    <script src="../Dependencies/jquery/jquery.min.js"></script>
    <script src="../Components/DropBox/index.js?v=<?php echo time(); ?>"></script>
    <script src="../Components/PillMsg/index.js?v=<?php echo time(); ?>"></script>
    <script src="../Components/Notice/index.js?v=<?php echo time(); ?>"></script>
    <script src="../Components/MessageItem/index.js?v=<?php echo time(); ?>"></script>
    <script src="../Components/QuestionItem/index.js?v=<?php echo time(); ?>"></script>
    <script src="../Components/ErrorMsg/index.js?v=<?php echo time(); ?>"></script>
    <script src="index.js?v=<?php echo time(); ?>"></script>
</body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TWGQMN8" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

</html>