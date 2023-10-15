$(document).ready(function () {
    let rank = [];

    // get Rank data
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
                        $('#rankTable tbody').append(
                            generateRankDataTr({
                                index: i + 1,
                                id: rank[i].id,
                                name: rank[i].name,
                                managerEmail: `${
                                    rank[i].managerEmail ? rank[i].managerEmail : '無'
                                }`,
                                time: rank[i].times,
                            }),
                        );
                    }

                    resolve(true);
                },
                fail: function (xhr, ajaxOptions, thrownError) {
                    reject(false);
                },
            });
        });
    }

    function generateRankDataTr(props) {
        let rankDataTrTemplate = `
        <tr>
            <td>{{index}}</td>
            <td><a href="../index.php?roomCode={{id}}" target="_blank">{{id}}</a></td>
            <td>{{name}}</td>
            <td>{{managerEmail}}</td>
            <td>{{time}}</td>
        </tr>
        `;

        return generateHtml(rankDataTrTemplate, {
            ...props,
        });
    }

    function initRankTable() {
        // table 1 library init
        rankTable = $('#rankTable').DataTable({
            scrollResize: true,
            scrollCollapse: true,
            scrollX: true,
            paging: true,
            searching: true,
            iDisplayLength: 100,
            language: {
                lengthMenu: '每頁顯示 _MENU_ 筆',
                zeroRecords: '沒有資料',
                info: '',
                infoEmpty: '沒有資料',
                search: '<img src="../Images/icon/search-black.svg">',
                searchPlaceholder: '篩選',
                paginate: {
                    next: '<img src="../Images/icon/arrow-right.svg">',
                    previous: '<img src="../Images/icon/arrow-left.svg">',
                },
            },
            columnDefs: [
                { width: '5%', targets: 0, orderable: false, searchable: false },
                { width: '30%', targets: 2 },
                { width: '30%', targets: 3 },
            ],
            order: [[4, 'desc']]
        });

        rankTable
            .on('order.dt search.dt', function () {
                rankTable
                    .column(0, { search: 'applied', order: 'applied' })
                    .nodes()
                    .each(function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
            })
            .draw();

        rankTable.columns.adjust().draw();
        sortPosition();

        $('.sort-btn').on('click', function (e) {
            if (!$(this).hasClass('active')) {
                $('.sort-btn.active').removeClass('active');
                $(this).addClass('active');

                const type = $(this).attr('type');
                switch (type) {
                    case 'build-time':
                        rankTable.order([0, 'asc']).draw();
                        break;
                    case 'times':
                        rankTable.order([4, 'desc']).draw();
                        break;
                }
            }
        });
    }

    // 確定都有拿到資料
    (async function () {
        try {
            let getRankDone = await fetchRankStatus();

            if (getRankDone) {
                initRankTable();

                closeLoading();
                $('.tab .sort').addClass('active');
            }
        } catch (err) {
            console.log(err);
        }
    })();
});
