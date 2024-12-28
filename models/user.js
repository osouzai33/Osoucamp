const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

UserSchema.plugin(passportLocalMongoose, {
    errorMessages: {
        UsernameExistsError: "このユーザー名は既に登録されています",
        MissingPasswordError: "パスワードを入力してください",
        AttemptTooSoonError:
            "アカウントがロックされています。後でもう一度お試しください",
        TooManyAttemptsError:
            "ログインの失敗が続いたため、アカウントをロックしました。",
        NoSaltValueStoredError: "認証ができませんでした。",
        IncorrectPasswordError: "パスワードが正しくありません",
        IncorrectUsernameError: "ユーザー名が正しくありません",
    },
});

module.exports = mongoose.model("User", UserSchema);
