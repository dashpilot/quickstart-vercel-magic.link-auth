const key = "pk_test_E90FA292AE61C345";
const magic = new Magic(key);

const render = async() => {
    const isLoggedIn = await magic.user.isLoggedIn();
    /* Show login form if user is not logged in */
    let html = `
                <h1>Please sign up or login</h1>
                <form onsubmit="handleLogin(event)">
                <input type="email" name="email" required="required" placeholder="Enter your email" />
                <button type="submit">Send</button>
                </form>
            `;
    if (isLoggedIn) {
        /* Get user metadata including email */
        const userMetadata = await magic.user.getMetadata();

        console.log(userMetadata);

        html = `
                <h1>Current user: ${userMetadata.email}</h1>
                <button onclick="handleLogout()">Logout</button>
                <button onclick="verify()">Verify</button>
                `;
    }
    document.getElementById("app").innerHTML = html;
};

const handleLogin = async(e) => {
    e.preventDefault();
    const email = new FormData(e.target).get("email");
    if (email) {
        /* One-liner login 🤯 */
        await magic.auth.loginWithMagicLink({
            email,
        });
        render();
    }
};

const handleLogout = async() => {
    await magic.user.logout();
    render();
};

async function verify() {
    const token = await magic.user.getIdToken();

    var bearer = "Bearer " + token;
    opts = {
        name: "test",
    };
    fetch("api/verify", {
            body: JSON.stringify(opts),
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
                Authorization: bearer,
                "Content-Type": "application/json",
            },
        })
        .then((resp) => {
            return resp.text();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.log("error: ", error);
        });
}

render();