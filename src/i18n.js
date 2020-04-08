import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';


// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        translation: {
            "A shopping list has been shared with you": "A shopping list has been shared with you!",
            "Account": "Account",
            "by": "by",
            "Change Password": "Change Password",
            "Edit": "Edit",
            "Email": "Email",
            "Forgot Password": "Forgot Password?",
            "Go Shopping": "Go shopping",
            "has shared a shopping list with you": "has shared a shopping list with you",
            "Item name": "Item name",
            "No account yet?": "No account yet?",
            "Open shared shopping list": "Open shared shopping list",
            "or with": "or with",
            "Password": "Password",
            "Quantity": "Quantity",
            "Reset My Password": "Reset My Password",
            "Save": "Save",
            "Share": "Share",
            "Sharing_link_copied": "A link to your shopping list has been copied to the clipboard.\nSend it to people you like so that they ask you to bring something along for you!",
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
            "A shopping list has been shared with you": "Eine Einkaufsliste wurde mit Dir geteilt!",
            "Account": "Konto",
            "by": "von",
            "Change Password": "Passwort ändern",
            "Edit": "Bearbeiten",
            "Email": "Email",
            "Forgot Password": "Passwort vergessen?",
            "Go Shopping": "Einkaufen",
            "has shared a shopping list with you": "hat eine Einkaufsliste mit Dir geteilt!",
            "Help": "Hilfe",
            "Item name": "Sache",
            "Login": "Anmelden",
            "Logout": "Abmelden",
            "No account yet?": "Noch kein Konto?",
            "Open shared shopping list": "Geteilte Einkaufsliste öffnen",
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