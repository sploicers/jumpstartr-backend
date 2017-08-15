/**
 * Created by jwt52 on 16/08/17.
 */
module.exports = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send("working!");
    });
}
