// const config = require('config');
// const passport = require('passport');

// // Github passport auth
// const githubPassportOptions = config.get('providers.github.passportOptions');
// const githubLoginMiddlewares = [
//   '/login/github',
//   passport.authenticate('github', githubPassportOptions),
// ];

// module.exports.login = {
//   get: 
// }
// router.get(...githubLoginMiddlewares);
// router.get('/auth/github', passport.authenticate('github', {
//   successRedirect: '/',
//   failureRedirect: '/',
//   successFlash: true,
//   failureFlash: true,
// }));