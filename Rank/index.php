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

    <div class="table">
        <table id="rankTable">
            <thead>
                <td>#</td>
                <td>ID</td>
                <td>信箱</td>
                <td>房間名稱</td>
                <td>使用人次</td>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>

    <script src="../Common/global.js?v=<?php echo time(); ?>"></script>
    <script src="../Dependencies/jquery/jquery.min.js"></script>
    <script src="index.js?v=<?php echo time(); ?>"></script>
</body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TWGQMN8" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

</html>