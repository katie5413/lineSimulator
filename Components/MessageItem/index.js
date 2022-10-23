const msgItemTemplate = `<div class="messageItem {{direction}} {{type}}" data-key="{{key}}">
    <div class="item">
        <img class="img" src="{{characterImg}}" alt="{{characterName}}" />
        <div class="content_box">
            <div class="name"></div>
            <div class="text"></div>
        </div>
    </div>
</div>`;

function generateMsgItem(props) {
    let template = msgItemTemplate;

    if (props.type == 'image') {
        template = template.replace(
            '<div class="text"></div>',
            '<div class="text"><div class="image"><img src="{{msgImg}}" alt="{{msgImgName}}" /></div></div>',
        );
    }

    if (props.type == 'link') {
        template = template.replace(
            '<div class="text"></div>',
            '<div class="text"><a class="link" target="_blank"></a></div>',
        );
    }

    if (!props.characterImg) {
        var tmpName = props.characterName.substring(0, 1);
        template = template.replace(
            '<img class="img" src="{{characterImg}}" alt="{{characterName}}" />',
            `<div class="tmpImg"><span>${tmpName}</span></div>`,
        );
    }

    return generateHtml(template, {
        ...props,
        direction: props.direction === 0 ? 'left' : 'right',
    });
}

const msgInputItemTemplate = `<div class="msgManageItem {{type}}" data-id={{index}} draggable="true" ondragstart="DragStartMsg()"  ondragover="DragOverMsg()">
    <button class="button dragMsgItem">
        <img src="../Images/icon/drag.png" alt="drag" class="icon">
    </button>
    <button class="button deleteMsgItem">
        <img src="../Images/icon/delete.svg" alt="delete" class="icon">
    </button>
    <div class="form__input drop">
        <div class="drop__container">
            <input class="select-selected msgCharacter" type="text" placeholder="角色" autocomplete="off" value="{{characterName}}" select-id="{{characterID}}" />
            <img src="../Images/icon/arrowRight.svg" alt="icon" class="icon">
            <img src="../Images/icon/clear.svg" alt="icon" class="drop__clear" />
            <div class="line"></div>
            <div class="select-items selectMsgCharacter"></div>
        </div>
    </div>
    <div class="form__input drop" data-type="contentType">
        <div class="drop__container">
            <input class="select-selected contentTypeOption" type="text" placeholder="內容類型" autocomplete="off" value="{{typeText}}" select-id="{{type}}" />
            <img src="../Images/icon/arrowRight.svg" alt="icon" class="icon">
            <img src="../Images/icon/clear.svg" alt="icon" class="drop__clear" />
            <div class="line"></div>
            <div class="select-items">
                <div class="option" value="text">文字</div>
                <div class="option" value="image">圖片</div>
            </div>
        </div>
    </div>
    <div class="form__input" data-type="text">
        <input class="input content" type="text" value="{{text}}" placeholder="對話" />
    </div>
    <div class="form__input drop" data-type="image">
        <div class="drop__container">
            <input class="select-selected msgImage" type="text" placeholder="圖片" autocomplete="off" value="{{imageName}}" select-id="{{imageID}}" />
            <img src="../Images/icon/arrowRight.svg" alt="icon" class="icon">
            <img src="../Images/icon/clear.svg" alt="icon" class="drop__clear" />
            <div class="line"></div>
            <div class="select-items selectImage"></div>
        </div>
    </div>
</div>`;

function generateMsgInputItem(props) {
    let template = msgInputItemTemplate;

    if (props.memberData) {
        let optionItemHTML = '';

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
            '<div class="select-items selectMsgCharacter"></div>',
            `<div class="select-items selectMsgCharacter">${optionItemHTML}</div>`,
        );
    }

    if (props.imageData) {
        let optionItemHTML = '';

        function generateMsgInputItemOption(props) {
            const msgInputItemOptionTemplate = `<div class="option" value="{{imageID}}">{{imageName}}</div>`;
            let template = msgInputItemOptionTemplate;

            return generateHtml(template, {
                ...props,
            });
        }

        for (var i = 0; i < props.imageData.length; i++) {
            optionItemHTML += generateMsgInputItemOption({
                imageID: props.imageData[i].id,
                imageName: props.imageData[i].name,
            });
        }

        template = template.replace(
            '<div class="select-items selectImage"></div>',
            `<div class="select-items selectImage">${optionItemHTML}</div>`,
        );
    }

    return generateHtml(template, {
        ...props,
    });
}


let msgRow;

function DragStartMsg() {
    msgRow = event.target.closest(`.msgManageItem`);
    msgRow.classList.add('drag');
}

function DragOverMsg() {


    event.preventDefault();

    let target = transformToJQuery(event.target.closest(`.msgManageItem`));

    let children = Array.from(target.parent().children());

    if (children.indexOf(target) < children.indexOf(msgRow)) target.after(msgRow);
    else target.before(msgRow);
    msgRow.classList.remove('drag');
}
