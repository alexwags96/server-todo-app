const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");

// Stratégie locale avec Passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user)
        return done(null, false, { message: "Utilisateur non trouvé" });

      const isMatch = await user.matchPassword(password);
      if (!isMatch)
        return done(null, false, { message: "Mot de passe incorrect" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Sérialisation de l'utilisateur dans la session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Désérialisation de l'utilisateur
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
