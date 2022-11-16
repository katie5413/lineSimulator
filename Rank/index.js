$(document).ready(function () {
    let rank = [];

    // show pillMsg
    function fetchRankStatus() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: `../Api/getRoomRank.php`,
                dataType: 'json',
                success: function (rankData) {
                    rank = rankData;

                    function encodeEmail(email) {
                        const emailFront = email.slice(0, email.indexOf('@'));
                        const emailEnd = email.slice(email.indexOf('@'));
                        return (
                            emailFront.slice(0, Math.floor(emailFront.length / 2)) +
                            '*'.repeat(Math.floor(emailFront.length / 2)) +
                            emailEnd
                        );
                    }

                    for (let i = 0; i < rank.length; i++) {
                        $('#rankTable tbody').append(`<tr>
                        <td>${i + 1}</td>
                        <td>${rank[i].id}</td>
                        <td>${rank[i].managerEmail ? encodeEmail(rank[i].managerEmail) : '無'}</td>
                        <td>${rank[i].name}</td>
                        <td>${rank[i].times}</td>
                        </tr>`);
                    }

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
            let getRankDone = await fetchRankStatus();

            if (getRankDone) {
                console.log(rank);
            }
        } catch (err) {
            console.log(err);
        }
    })();
});
