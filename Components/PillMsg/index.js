const pillTemplate = `<div class="pill">
<div>{{ member }} 已加入群組</div>
</div>`;

function generatePillMsg(props) {
    const template = pillTemplate;
    const memberData = props.member;
    let members = [];

    let groupMember = '';
    console.log(memberData.length);

    switch (memberData.length) {
        case 0:
            template = template.replace(
                '<div>{{ member }} 已加入群組</div>',
                '<div>群組目前沒有人ＱＱ</div>',
            );
            break;
        case 1:
        case 2:
            memberData.forEach((person) => {
                members.push(person.name);
            });

            for (person of members) {
                groupMember += `${person}、`;
            }

            // 最後一個逗號要去掉
            groupMember = groupMember.slice(0, groupMember.length - 1);
            break;
        default:
            members.push(memberData[0].name);
            members.push(memberData[1].name);
            for (person of members) {
                groupMember += `${person}、`;
            }
            // 最後一個逗號要去掉
            groupMember = groupMember.slice(0, groupMember.length - 1);

            let personNum = memberData.length - 2;
            groupMember += `與其他 ${personNum} 人`;
            break;
    }

    return generateHtml(template, {
        ...props,
        member: groupMember,
    });
}
