import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'


// the translations
// (tip move them in a JSON file and import them)
const resources = {
	en: {
		translation: {
			'A shopping list has been shared with you': 'A shopping list has been shared with you!',
			'Account': 'Account',
			'Account_already_exists': `
                An account with this E-Mail address already exists.
                Try to login with this account instead. If you think the
                account is already used from one of the social logins, try
                to sign in with one of them. Afterward, associate your accounts
                on your personal account page.
                `,
			'All Needs Lists': 'Shared with me',
			'All Shopping Lists': 'My Shopping Lists',
			'Allow friends to add own needs': 'Allow friends to add own needs',
			'archived': 'archived',
			'Back': 'Back',
			'by': 'by',
			'Change Password': 'Change Password',
			'Create Shopping List': 'New Shopping List',
			'Created on': 'Created on',
			'Creating_own_items_disabled': 'The shopping list owner does not allow to add items which he does not shop anyway',
			'Edit': 'Edit',
			'Edit_not_possible_shopping': 'Editing ist not possible: It\'s currently being shopped! If you want to change something, better give the shopper a call ;)',
			'Edit_not_possible_finished': 'Editing ist not possible: Shopping has already been completed.',
			'Edit_not_possible_archived': 'Editing ist not possible: The shopping list has been archived.',
			'Email': 'Email',
			'Email_confirmation_sent': `E-Mail confirmation sent: \n
                Check you E-Mails (Spam folder included) for a confirmation E-Mail.\n
                Refresh this page once you confirmed your E-Mail.`,
			'Email_verification_needed': `Verify your E-Mail: \n
                Check you E-Mails (Spam folder included) for a confirmation E-Mail \n
                or send another confirmation E-Mail.`,
			'Finish shopping': 'Finish shopping',
			'finished': 'Shopping finished',
			'For': 'For',
			'Forgot Password': 'Forgot Password?',
			'Full Name': 'Full Name',
			'Go Shopping': 'Go shopping',
			'has shared a shopping list with you': 'has shared a shopping list with you',
			'Include archived': 'Include archived lists',
			'Is confirmed. Reload': 'Is confirmed. Reload',
			'Item name': 'Item',
			'Items': 'Items',
			'Loading_message': 'Loading...',
			'My own shopped items': 'My own shopped items',
			'Name_mandatory': 'Please enter what you want to shop!',
			'Name of shopping list': 'List name',
			'Name_and_quantity_mandatory': 'How much of what do you want to add to your cart?',
			'No account yet?': 'No account yet?',
			'Open shared shopping list': 'Open shared shopping list',
			'or with': 'or with',
			'Password': 'Password',
			'Plan Shopping': 'Plan Shopping',
			'Quantity': 'Quantity',
			'Reset My Password': 'Reset My Password',
			'Repeat Password': 'Repeat Password',
			'Save': 'Save',
			'Send confirmation E-Mail': 'Send confirmation E-Mail',
			'Share': 'Share',
			'Sharing_message': 'Hi there! I\'m about to go for shopping. Is there something on my shopping list which I shall bring along for you as well? Here\'s a link to my shopping list:',
			'Sharing_link_copied': 'A link to your shopping list has been copied to the clipboard.\nSend it to people you like so that they ask you to bring something along for you!',
			'Sharing_link_received': 'You received a link to a shared shopping list! Just sign-in or -up quickly to see what items your friend is going to shop!',
			'Sign In': 'Sign In',
			'Sign Out': 'Sign Out',
			'Sign Up': 'Sign Up',
			'Shared': 'Shared',
			'shopping': 'currently shopping',
			'Shopping': 'Shopping',
			'Shopping list': 'Shopping list',
			'Username': 'Username',
		}
	},
	de: {
		translation: {
			'A shopping list has been shared with you': 'Ein Einkaufszettel wurde mit Dir geteilt!',
			'Account': 'Konto',
			'Account_already_exists': `
                Ein Konto mit dieser E-Mail-Adresse existiert bereits.\n
                Versuche stattdessen, Dich mit diesem Konto anzumelden.\n
                Wenn Du glaubst, dass das Konto bereits von einem der sozialen Logins aus verwendet wird, \n
                versuche, Dich mit diesem anzumelden.\n
                Danach verbinde Deine Konten auf Deiner persönlichen Konto-Seite.
                `,
			'All Needs Lists': 'Mit mir geteilt',
			'All Shopping Lists': 'Meine Einkaufszettel',
			'Allow friends to add own needs': 'Freunde können neue Artikel ergänzen',
			'archived': 'archiviert',
			'Back': 'Zurück',
			'by': 'von',
			'Change Password': 'Passwort ändern',
			'Create Shopping List': 'Neuer Einkauszettel',
			'Created on': 'Angelegt am',
			'Creating_own_items_disabled': 'Der Eigentümer des Einkaufszettels erlaubt es nicht, dass Du weitere Artikel ergänzt',
			'Edit': 'Bearbeiten',
			'Edit_not_possible_shopping': 'Bearbeiten ist nicht mehr möglich: Es wird gerade eingekauft! Wenn Du noch etwas ändern möchtest, ruf lieber an ;)',
			'Edit_not_possible_finished': 'Bearbeiten ist nicht mehr möglich: Der Einkauf ist schon beendet!',
			'Edit_not_possible_archived': 'Bearbeiten ist nicht mehr möglich: Der Einkaufszettel wurde archiviert',
			'Email': 'Email',
			'Email_confirmation_sent': `Bestätigungs-E-Mail wurde gesendet: \n
                Prüfe Deine E-Mails (inklusive des Spam-Ordners) für eine Bestätigungs-E-Mail.\n
                Aktualisiere diese Seite, sobald Du Deine E-Mail bestätigt hast.`,
			'Email_verification_needed': `Verifiziere Deine E-Mail-Adresse: \n
                Prüfe Deine E-Mails (inklusive des Spam-Ordners) für eine Bestätigungs-E-Mail.\n
                oder sende eine weitere E-Mail-Bestätigungs-Anfrage.`,
			'Finish shopping': 'Einkauf beenden',
			'finished': 'Einkauf beendet',
			'For': 'Für',
			'Forgot Password': 'Passwort vergessen?',
			'Full Name': 'Vollständiger Name',
			'Go Shopping': 'Einkaufen',
			'has shared a shopping list with you': 'hat einen Einkaufszettel mit Dir geteilt!',
			'Help': 'Hilfe',
			'Include archived': 'Auch archivierte anzeigen',
			'Is confirmed. Reload': 'Ist bestätigt. Aktualisieren!',
			'Item name': 'Artikel',
			'Items': 'Artikel',
			'Loading_message': 'Ich lade...',
			'Login': 'Anmelden',
			'Logout': 'Abmelden',
			'My own shopped items': 'Meine eigenen Einkäufe',
			'Name_mandatory': 'Bitte gib an, was Du einkaufen möchtest!',
			'Name of shopping list': 'Name der Liste',
			'Name_and_quantity_mandatory': 'Was und wieviel soll es sein?',
			'No account yet?': 'Noch kein Konto?',
			'Open shared shopping list': 'Geteilten Einkaufszettel öffnen',
			'or with': 'oder mit',
			'Password': 'Passwort',
			'Plan Shopping': 'Einkauf planen',
			'Quantity': 'Menge',
			'Repeat Password': 'Passwort wiederholen',
			'Reset My Password': 'Mein Passwort zurücksetzen',
			'Save': 'Speichern',
			'Send confirmation E-Mail': 'Bestätigungs-E-Mail senden',
			'Share': 'Teilen',
			'Sign In': 'Anmelden',
			'Sign Out': 'Abmelden',
			'Sign Up': 'Anmelden',
			'Shared': 'Geteilt',
			'Sharing_message': 'Hallo! Ich gehe demnächst etwas einkaufen. \nSteht auf meinem Einkaufszettel etwas, das ich Dir auch mitbringen soll? Hier ist ein Link auf meinen Einkaufszettel:',
			'Sharing_link_copied': `
                Ein Link zu Deinem Einkaufszettel wurde in die Zwischenablage kopiert.\n
                Schicke ihn an Leute, denen Du etwas, das ohnehin schon auf Deinem Zettel steht, mitbringen möchtest.
                `,
			'Sharing_link_received': 'Ein Freund hat einen Einkaufszettel mit Dir geteilt! \nMelde Dich flott an, um zu erfahren, was drauf steht!',
			'shopping': 'wird eingekauft',
			'Shopping': 'Einkaufen',
			'Shopping list': 'Einkaufszettel',
			'Username': 'Benutzername',
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
	})

export default i18n