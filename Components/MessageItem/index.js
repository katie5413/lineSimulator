const msgItemTemplate = `<div class="messageItem {{direction}}" data-key="{{key}}">
    <div class="item">
        <img class="img" src="{{img}}" alt="{{name}}" />
        <div class="content_box">
            <div class="name"></div>
            <div class="text"></div>
        </div>
    </div>
</div>`;

function generateMsgItem(props) {
    let template = msgItemTemplate;

    if (!props.img) {
        var tmpName = props.name.substring(0, 1);
        template = template.replace(
            '<img class="img" src="{{img}}" alt="{{name}}" />',
            `<div class="tmpImg"><span>${tmpName}</span></div>`,
        );
    }

    return generateHtml(template, {
        ...props,
        direction: props.direction === 0 ? 'left' : 'right',
    });
}

const msgInputItemTemplate = `<div class="msgManageItem">
    <button class="button deleteMsgItem">
        <img src="../Images/icon/delete.svg" alt="delete" class="icon">
    </button>
    <div class="form__input drop">
        <div class="drop__container">
            <input class="select-selected msgCharactor" type="text" placeholder="角色" autocomplete="off" value="{{name}}" select-id="{{id}}" />
            <img src="../Images/icon/arrowRight.svg" alt="icon" class="icon">
            <img src="../Images/icon/clear.svg" alt="icon" class="drop__clear" />
            <div class="line"></div>
            <div class="select-items"></div>
        </div>
    </div>
    <div class="form__input">
        <input class="input content" type="text" value="{{text}}" placeholder="對話" />
    </div>
</div>`;

function generateMsgInputItem(props) {
    let template = msgInputItemTemplate;

    if (props.memberData) {
        var optionItemHTML = '';

        function generateMsgInputItemOption(props) {
            const msgInputItemOptionTemplate = `<div class="option" value="{{memberID}}">{{memberName}}</div>`;
            let template = msgInputItemOptionTemplate;

            return generateHtml(template, {
                ...props,
            });
        }

        for (var i = 0; i < props.memberData.length; i++) {
            optionItemHTML += generateMsgInputItemOption({
                memberID: props.memberData[i].id,
                memberName: props.memberData[i].name,
            });
        }

        template = template.replace(
            '<div class="select-items"></div>',
            `<div class="select-items">${optionItemHTML}</div>`,
        );
    }

    return generateHtml(template, {
        ...props,
    });
}
