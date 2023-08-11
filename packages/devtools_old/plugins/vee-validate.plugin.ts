import {configure, defineRule} from "vee-validate";
import AllRules from '@vee-validate/rules'
import fr from '@vee-validate/i18n/dist/locale/fr.json';
import {localize, setLocale} from "@vee-validate/i18n";

export default defineNuxtPlugin(nuxt => {
  Object.keys(AllRules).forEach(rule => {
    if (typeof AllRules[rule] === 'function') {
      defineRule(rule, AllRules[rule])
    }
  })

  configure({
    generateMessage: localize({
      fr,
    }),
      bails: false,
      validateOnModelUpdate: true
  });

  setLocale('fr')

})
