import Select from "@/shared/ui/Select";
import {useTranslation} from 'react-i18next';

const languages = [
  {value: 'en', label: 'En 🇺🇸'},
  {value: 'ua', label: 'Ua 🇺🇦'},
  {value: 'ru', label: 'Ru 🇷🇺'},
];

export default function LanguageSwitch() {
  const {i18n} = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng); // Change the language
  };

  return (
    <Select
      options={languages} // Pass the array of objects
      onChange={(selectedValue) => changeLanguage(selectedValue)} // Pass the selected value
    />
  );
}
