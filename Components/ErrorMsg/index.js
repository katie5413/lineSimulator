const showErrorMsg = (msg) => {
    const elm = document.querySelectorAll(`.errorMsg`);
    elm[0].classList.add("active");
    elm[0].getElementsByClassName("text")[0].innerText = msg;
};

const hideErrorMsg = () => {
    const elm = document.querySelectorAll(`.errorMsg`);
    elm[0].classList.remove("active");
};
