"use strict";

var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    };

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });

    return false;
};

var handlePassChange = function handlePassChange(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#curr").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("RAWR! Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#passChangeForm").attr("action"), $("#passChangeForm").serialize(), redirect);

    return false;
};

var handleAction = function handleAction(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#actionForm").attr("action"), $("#actionForm").serialize(), redirect);
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm",
            onSubmit: handleDomo,
            name: "domoForm",
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "domoAge", type: "text", name: "age", placeholder: "Domo Age" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Make Domo" })
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Domos yet"
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            "div",
            { key: domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                " Name: ",
                domo.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                " Age: ",
                domo.age,
                " "
            )
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};

var DomoActions = function DomoActions(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "No Domos yet"
            )
        );
    }

    var actionMenu = props.domos.map(function (domo) {
        return React.createElement(
            "div",
            { "data-key": domo._id, className: "domo" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "domoName" },
                " Name: ",
                domo.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "domoAge" },
                " Age: ",
                domo.age,
                " "
            ),
            React.createElement(
                "form",
                {
                    id: "actionForm",
                    onSubmit: handleAction,
                    name: "actionForm",
                    action: "/happy",
                    method: "POST"
                },
                React.createElement(
                    "select",
                    { name: "happiness", form: "actionForm" },
                    React.createElement(
                        "option",
                        { value: "1" },
                        " Pet Domo "
                    ),
                    React.createElement(
                        "option",
                        { value: "5" },
                        " Give Treat "
                    ),
                    React.createElement(
                        "option",
                        { value: "10" },
                        " Cuddle Domo "
                    ),
                    React.createElement(
                        "option",
                        { value: "-1" },
                        " Call Names "
                    ),
                    React.createElement(
                        "option",
                        { value: "-10" },
                        " Tease Domo "
                    ),
                    React.createElement(
                        "option",
                        { value: "-100" },
                        " Kick Domo "
                    )
                ),
                React.createElement("input", { type: "hidden", name: "_id", value: domo._id }),
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { type: "submit", value: "Use" })
            ),
            React.createElement(
                "h3",
                { className: "domoName" },
                "Happiness: ",
                domo.happiness
            )
        );
    });

    return React.createElement("div", { className: "domoList" }, actionMenu);
};

var PassChangeForm = function PassChangeForm(props) {
    return React.createElement(
        "form",
        { id: "passChangeForm",
            name: "passChangeForm",
            onSubmit: handlePassChange,
            action: "/newPass",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "current" },
            "Current Password: "
        ),
        React.createElement("input", { id: "user", type: "password", name: "current", placeholder: "current" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "New Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
        React.createElement(
            "label",
            { htmlFor: "pass2" },
            "New Password: "
        ),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Submit" })
    );
};

var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector("#domos"));
    });
};

var getActions = function getActions(csrf) {
    sendAjax('GET', '/getDomos', null, function (data) {
        data.domos[csrf] = csrf;

        ReactDOM.render(React.createElement(DomoActions, { domos: data.domos }), document.querySelector("#domos"));
    });
};

var getPassChangeForm = function getPassChangeForm(csrf) {
    ReactDOM.render(React.createElement(PassChangeForm, { csrf: csrf }), document.querySelector("#domos"));
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector("#domos"));

    var actionButton = document.querySelector("#actionButton");
    var makerButton = document.querySelector("#makerButton");
    var changeButton = document.querySelector("#changeButton");

    actionButton.addEventListener("click", function (e) {
        e.preventDefault();
        getActions(csrf);
        return false;
    });

    makerButton.addEventListener("click", function (e) {
        e.preventDefault();
        loadDomosFromServer();
        return false;
    });

    changeButton.addEventListener("click", function (e) {
        e.preventDefault();
        getPassChangeForm(csrf);
        return false;
    });

    loadDomosFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
function newFunction() {
    return "#makerButton";
}
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
