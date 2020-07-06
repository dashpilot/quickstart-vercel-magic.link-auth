const { Magic } = require("@magic-sdk/admin");
const mAdmin = new Magic();

module.exports = (req, res) => {
    const DIDToken = req.headers.authorization.substring(7);

    try {
        mAdmin.token.validate(DIDToken);
        res.json({ body: "yes" });
    } catch (error) {
        res.json({ body: "no" });
    }
};