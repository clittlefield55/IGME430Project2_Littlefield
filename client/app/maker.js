const handleDomo = (e) => {
    e.preventDefault();

    $("domoMessage").animate({width:'hide'},350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    };

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });

    return false;
};

const handlePassChange = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);
    
        if($("#curr").val() == '' || $("#pass").val() == ''|| $("#pass2").val() == '') {
            handleError("RAWR! All fields are required");
            return false;
        }
    
        if($("#pass").val() !== $("#pass2").val()) {
            handleError("RAWR! Passwords do not match");
            return false;
        }
    
        sendAjax('POST', $("#passChangeForm").attr("action"), $("#passChangeForm").serialize(), redirect);
    

    return false;
};

const handleAction = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'}, 350);

    sendAjax('POST', $("#actionForm").attr("action"), $("#actionForm").serialize(), redirect);
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
              onSubmit={handleDomo}
              name="domoForm"
              action="/maker"
              method="POST"
              className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age} </h3> 
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const DomoActions = function (props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }

    const actionMenu = props.domos.map(function(domo) {
        return ( 
        <div data-key={domo._id} className="domo">
            <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
            <h3 className="domoName"> Name: {domo.name} </h3>
            <h3 className="domoAge"> Age: {domo.age} </h3> 
            <form
                id="actionForm"
                onSubmit={handleAction}
                name="actionForm"
                action="/happy"
                method="POST"
            >

            <select name="happiness" form="actionForm">
                <option value="1"> Pet Domo </option>
                <option value="5"> Give Treat </option>
                <option value="10"> Cuddle Domo </option>
                <option value="-1"> Call Names </option>
                <option value="-10"> Tease Domo </option>
                <option value="-100"> Kick Domo </option>
            </select>
            <input type="hidden" name="_id" value={domo._id} />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input type="submit" value="Use" />
            </form>
            <h3 className="domoName">Happiness: {domo.happiness}</h3>
        </div>
        )
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        actionMenu
    );
};

const PassChangeForm = (props) => {
    return (
        <form id="passChangeForm"
              name="passChangeForm"
              onSubmit={handlePassChange}
              action="/newPass"
              method="POST"
              className="mainForm"
        >
        <label htmlFor="current">Current Password: </label>
        <input id="user" type="password" name="current" placeholder="current" />
        <label htmlFor="pass">New Password: </label>
        <input id="pass" type="password" name="pass" placeholder="password" />
        <label htmlFor="pass2">New Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder="retype password" />
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit" type="submit" value="Submit" />
       </form>
    )
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const getActions = (csrf) => {
    sendAjax('GET', '/getDomos', null, (data) => {
        data.domos[csrf] = csrf;

        ReactDOM.render(
            <DomoActions domos={data.domos}/>, document.querySelector("#domos")
        );
    });
};

const getPassChangeForm = (csrf) => {
    ReactDOM.render(
    <PassChangeForm csrf={csrf}/>, document.querySelector("#domos")
    );
};

const setup = function(csrf) {
    ReactDOM.render(
       <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );

    const actionButton = document.querySelector("#actionButton");
    const makerButton = document.querySelector("#makerButton");
    const changeButton = document.querySelector("#changeButton");
    
    actionButton.addEventListener("click", (e) => {
        e.preventDefault();
        getActions(csrf);
        return false;
    });

    makerButton.addEventListener("click", (e) => {
        e.preventDefault();
        loadDomosFromServer();
        return false;
    });

    changeButton.addEventListener("click", (e) => {
        e.preventDefault();
        getPassChangeForm(csrf);
        return false;
    });

    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
function newFunction() {
    return "#makerButton";
}
