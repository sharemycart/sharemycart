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
            "All Shopping Lists": "My Shopping Lists",
            "by": "by",
            "Change Password": "Change Password",
            "Create Shopping List": "New Shopping List",
            "Edit": "Edit",
            "Email": "Email",
            "Email_confirmation_sent": `E-Mail confirmation sent: \n
                Check you E-Mails (Spam folder included) for a confirmation E-Mail.\n
                Refresh this page once you confirmed your E-Mail.`,
            "Email_verification_needed": `Verify your E-Mail: \n
                Check you E-Mails (Spam folder included) for a confirmation E-Mail \n
                or send another confirmation E-Mail.`,
            "Forgot Password": "Forgot Password?",
            "Full Name": "Full Name",
            "Go Shopping": "Go shopping",
            "has shared a shopping list with you": "has shared a shopping list with you",
            "Item name": "Item name",
            "Loading_message": "Loading...",
            "Name_mandatory": "Please enter what you want to shop!",
            "Name_and_quantity_mandatory": "How much of what do you want to add to your cart?",
            "No account yet?": "No account yet?",
            "Open shared shopping list": "Open shared shopping list",
            "or with": "or with",
            "Password": "Password",
            "Plan Shopping": "Plan Shopping",
            "Quantity": "Quantity",
            "Reset My Password": "Reset My Password",
            "Repeat Password": "Repeat Password",
            "Save": "Save",
            "Send confirmation E-Mail": "Send confirmation E-Mail",
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
            "A shopping list has been shared with you": "Ein Einkaufszettel wurde mit Dir geteilt!",
            "Account": "Konto",
            "Account_already_exists": `
                Ein Konto mit dieser E-Mail-Adresse existiert bereits.\n
                Versuchen Sie stattdessen, sich mit diesem Konto anzumelden.\n
                Wenn Sie glauben, dass das Konto bereits von einem der sozialen Logins aus verwendet wird, \n
                versuchen Sie, sich mit iesem anzumelden.\n
                Danach verbinden Sie Ihre Konten auf Ihrer persönlichen Konto-Seite.
                `,
            "All Shopping Lists": "Meine Einkaufszettel",
            "by": "von",
            "Change Password": "Passwort ändern",
            "Create Shopping List": "Neuer Einkauszettel",
            "Edit": "Bearbeiten",
            "Email": "Email",
            "Email_confirmation_sent": `Bestätigungs-E-Mail wurde gesendet: \n
                Prüfen Sie Ihre E-Mails (inklusive des Spam-Ordners) für eine Bestätigungs-E-Mail.\n
                Aktualisieren Sie diese Seite, sobald Sie Ihre E-Mail bestätigt haben.`,
            "Email_verification_needed": `Verifizieren Sie Ihre E-Mail-Adresse: \n
                Prüfen Sie Ihre E-Mails (inklusive des Spam-Ordners) für eine Bestätigungs-E-Mail.\n
                oder senden Sie eine weitere E-Mail-Bestätigungs-Anfrage.`,
            "Forgot Password": "Passwort vergessen?",
            "Full Name": "Vollständiger Name",
            "Go Shopping": "Einkaufen",
            "has shared a shopping list with you": "hat einen Einkaufszettel mit Dir geteilt!",
            "Help": "Hilfe",
            "Item name": "Sache",
            "Loading_message": "Ich lade...",
            "Login": "Anmelden",
            "Logout": "Abmelden",
            "Name_mandatory": "Bitte geben Sie an, was Sie einkaufen möchten!",
            "Name_and_quantity_mandatory": "Was und wieviel soll es sein?",
            "No account yet?": "Noch kein Konto?",
            "Open shared shopping list": "Geteilten Einkaufszettel öffnen",
            "or with": "oder mit",
            "Password": "Passwort",
            "Plan Shopping": "Einkauf planen",
            "Quantity": "Menge",
            "Repeat Password": "Passwort wiederholen",
            "Reset My Password": "Mein Passwort zurücksetzen",
            "Save": "Speichern",
            "Send confirmation E-Mail": "Bestätigungs-E-Mail senden",
            "Share": "Teilen",
            "Sign In": "Anmelden",
            "Sign Out": "Abmelden",
            "Sign Up": "Anmelden",
            "Shared": "Geteilt",
            "Sharing_link_copied": "Ein Link zu Ihrem Einkaufszettel wurde in die Zwischenablage kopiert. \nSchicken Sie ihn an Leute, denen Sie etwas, das ohnehin schon auf Ihrem Zettel steht, mitbringen möchten",
            "Shopping": "Einkaufen",
            "Shopping list": "Einkaufszettel",
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