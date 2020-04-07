import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';


// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        translation: {
            "Account": "Account",
            "by": "by",
            "Change Password": "Change Password",
            "Edit": "Edit",
            "Email": "Email",
            "Forgot Password": "Forgot Password?",
            "Go Shopping": "Go shopping",
            "Item name": "Item name",
            "No account yet?": "No account yet?",
            "or with": "or with",
            "Password": "Password",
            "Quantity": "Quantity",
            "Reset My Password": "Reset My Password",
            "Save": "Save",
            "Share": "Share",
            "Sign In": "Sign In",
            "Sign Out": "Sign Out",
            "Sign Up": "Sign Up",
            "Shared": "Shared",
            "Shopping": "Shopping",
            "Shopping list": "Shopping list",
            "Username": "Username",
        }
    },
    de: {
        translation: {
            "Account": "Konto",
            "by": "von",
            "Change Password": "Passwort ändern",
            "Edit": "Bearbeiten",
            "Email": "Email",
            "Forgot Password": "Passwort vergessen?",
            "Go Shopping": "Einkaufen",
            "Help": "Hilfe",
            "Item name": "Sache",
            "Login": "Anmelden",
            "Logout": "Abmelden",
            "No account yet?": "Noch kein Konto?",
            "or with": "oder mit",
            "Password": "Passwort",
            "Quantity": "Menge",
            "Reset My Password": "Mein Passwort zurücksetzen",
            "Save": "Speichern",
            "Share": "Teilen",
            "Sign In": "Anmelden",
            "Sign Out": "Abmelden",
            "Sign Up": "Anmelden",
            "Shared": "Geteilt",
            "Shopping": "Einkaufen",
            "Shopping list": "Einkaufsliste",
            "Username": "Benutzername",
        }
    }
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: 'en',
        debug: true,

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;