import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as enLang from "./en.json";
import * as ptLang from "./pt.json";


// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    en: enLang,
    pt: ptLang
};

let selectedLanguage = localStorage.getItem('language');
if(selectedLanguage === null){
    selectedLanguage = "pt";
    localStorage.setItem('language', selectedLanguage);
}

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: selectedLanguage, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option
        fallbackLng: "pt",
        interpolation: {
            escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescap
        }
    });

export default i18n;
