const key = "pk_test_E90FA292AE61C345";
const magic = new Magic(key);

const render = async() => {
    const isLoggedIn = await magic.user.isLoggedIn();
    /* Show login form if user is not logged in */
    let html = `<div class="card"><div class="card-body">
                <h5 class="card-title">Please sign up or login</h5>
                <p class="card-text">No password needed</p>
                <form onsubmit="handleLogin(event)">
                <input type="email" name="email" required="required" placeholder="Enter your email" class="form-control mb-2" />
                <button type="submit" class="btn btn-primary w-100">Send</button>
                </form>
                </div></div>
            `;
    if (isLoggedIn) {
        /* Get user metadata including email */
        const userMetadata = await magic.user.getMetadata();

        console.log(userMetadata);

        html = `<div class="card"><div class="card-body">
                <h5 class="card-title">Current user:</h5>
                <p class="card-text">${userMetadata.email}</p>
                <button onclick="handleLogout()" class="btn btn-primary w-100 mb-2">Logout</button>
                <button onclick="verify()" class="btn btn-secondary w-100">Verify</button>
                </div></div>
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