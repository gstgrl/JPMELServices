<template>
    <div class="language-switcher">
      <button
        v-for="(lang, code) in languages"
        :key="code"
        @click="changeLanguage(code)"
        :class="{ active: locale === code }"
      >
        <img :src="lang.flag" :alt="lang.label" class="flag" />
      </button>
    </div>
</template>
  
<script setup>
  import { useI18n } from 'vue-i18n'
  
  const { locale } = useI18n()
  
  const languages = {
    it: {
      label: 'Italiano',
      flag: '/flags/italy.png'
    },
    en: {
      label: 'English',
      flag: '/flags/united-kingdom.png'
    },
    esp: {
      label: 'Español',
      flag: '/flags/spain.png'
    }
  }
  
  const changeLanguage = (lang) => {
    locale.value = lang
  }
</script>
  
<style scoped>
  .language-switcher {
    display: flex;
    gap: 1rem;
    margin: 1rem 0;
  }
  
  .language-switcher button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    font-weight: bold;
    cursor: pointer;
    padding: 0.3rem 0.5rem;
    border-radius: 6px;
    transition: background-color 0.2s;
  }
  
  .language-switcher button:hover {
    background-color: #f0f0f0;
  }
  
  .language-switcher button.active {
    background-color: #dceeff;
  }
  
  .flag {
    width: 24px;
    height: auto;
    border-radius: 50%;
  }
</style>
  