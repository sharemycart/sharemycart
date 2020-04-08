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
            "Account_already_exists": `
                An account with this E-Mail address already exists.
                Try to login with this account instead. If you think the
                account is already used from one of the social logins, try
                to sign in with one of them. Afterward, associate your accounts
                on your personal account page.
                `,
            "by": "by",
            "Change Password": "Change Password",
            "Edit": "Edit",
            "Email": "Email",
            "Forgot Password": "Forgot Password?",
            "Full Name": "Full Name",
            "Go Shopping": "Go shopping",
            "has shared a shopping list with you": "has shared a shopping list with you",
            "Item name": "Item name",
            "No account yet?": "No account yet?",
            "Open shared shopping list": "Open shared shopping list",
            "or with": "or with",
            "Password": "Password",
            "Quantity": "Quantity",
            "Reset My Password": "Reset My Password",
            "Repeat Password": "Repeat Password",
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
            "Account_already_exists": `
                Ein Konto mit dieser E-Mail-Adresse existiert bereits.
                Versuchen Sie stattdessen, sich mit diesem Konto anzumelden. 
                Wenn Sie glauben, dass das Konto bereits von einem der sozialen Logins aus verwendet wird, 
                versuchen Sie, sich mit iesem anzumelden. 
                Danach verbinden Sie Ihre Konten auf Ihrer persönlichen Konto-Seite.
                `,
            "by": "von",
            "Change Password": "Passwort ändern",
            "Edit": "Bearbeiten",
            "Email": "Email",
            "Forgot Password": "Passwort vergessen?",
            "Full Name": "Vollständiger Name",
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
            "Repeat Password": "Passwort wiederholen",
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