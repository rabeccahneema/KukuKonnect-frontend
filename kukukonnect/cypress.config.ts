import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
     baseUrl: 'https://kukukonnect-frontend.vercel.app/',
    setupNodeEvents(on, config) {
    on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' || browser.name === 'electron') {
          launchOptions.preferences.default['profile.managed_default_content_settings.images'] = 2;
        }
        return launchOptions;
      });
    },
  },
});




