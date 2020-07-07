const { Magic } = require("@magic-sdk/admin");
const mAdmin = new Magic(process.env.ML_SECRET);

module.exports = async(req, res) => {
    const DIDToken = req.headers.authorization.substring(7);

    try {
        mAdmin.token.validate(DIDToken);
        const metadata = await mAdmin.users.getMetadataByToken(DIDToken);
        const id = metadata.issuer;

        res.json({ body: "yes" });
    } catch (error) {
        res.json({ body: "no" });
    }
};