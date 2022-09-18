const questionInputItemTemplate = `<div class="questionManageItem">
    <button class="button deleteQuestionItem">
        <img src="../Images/icon/delete.svg" alt="delete" class="icon">
    </button>
    <div class="form__input name">
        <input class="input questionIndexName" type="text" value="{{questionIndex}}" placeholder="題號" />
    </div>
    <div class="form__input">
        <input class="input content" type="text" value="{{questionContent}}" placeholder="所有選項，至少兩個，且用半形逗號分隔（選項一,選項二）" />
    </div>
    <div class="form__input drop">
    <div class="drop__container">
        <input class="select-selected answerOption" type="text" placeholder="答案" autocomplete="off" value="{{answerText}}" select-id="{{answerID}}" />
        <img src="../Images/icon/arrowRight.svg" alt="icon" class="icon">
        <img src="../Images/icon/clear.svg" alt="icon" class="drop__clear" />
        <div class="line"></div>
        <div class="select-items"></div>
    </div>
</div>
</div>`;

function generateQuestionInputItem(props) {
    let template = questionInputItemTemplate;

    if (props.questionData) {
        // 處理選項
        var optionItemHTML = '';

        function generateQuestionInputItemOption(props) {
            const questionInputItemOptionTemplate = `<div class="option" value="{{optionID}}">{{optionText}}</div>`;
            let template = questionInputItemOptionTemplate;

            return generateHtml(template, {
                ...props,
            });
        }

        console.log(props.questionData, props.answerID);
        for (i = 0; i < props.questionData.length; i++) {
            optionItemHTML += generateQuestionInputItemOption({
                optionID: i + 1,
                optionText: props.questionData[i],
            });
        }

        template = template.replace(
            '<div class="select-items"></div>',
            `<div class="select-items">${optionItemHTML}</div>`,
        );
    }

    return generateHtml(template, {
        ...props,
        answerText: props.questionData[props.answerID - 1],
        questionContent: props.questionData.toString(),
    });
}

const questionItemTemplate = `<div class="questionItem">
    <div class="questionIndexName">
        {{questionIndex}}
    </div>
    <div class="form__input drop">
        <div class="drop__container">
            <input class="select-selected answerOption" type="text" placeholder="請選擇" autocomplete="off" value="" select-id="" />
            <img src="../Images/icon/arrowRight.svg" alt="icon" class="icon">
            <img src="../Images/icon/clear.svg" alt="icon" class="drop__clear" />
            <div class="line"></div>
            <div class="select-items"></div>
        </div>
    </div>
</div>`;
function generateQuestionItem(props) {
    let template = questionItemTemplate;
    if (props.questionData) {
        // 處理選項
        var optionItemHTML = '';

        function generateQuestionInputItemOption(props) {
            const questionInputItemOptionTemplate = `<div class="option" value="{{optionID}}">{{optionText}}</div>`;
            let template = questionInputItemOptionTemplate;

            return generateHtml(template, {
                ...props,
            });
        }

        for (i = 0; i < props.questionData.length; i++) {
            optionItemHTML += generateQuestionInputItemOption({
                optionID: i + 1,
                optionText: props.questionData[i],
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

function activeQuestionItemFunction() {
    $('.questionItem .drop__container').click(() => {
        hideErrorMsg();
    });
}
