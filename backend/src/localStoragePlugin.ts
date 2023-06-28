export default {
    install: (app: any) => {
      app.config.globalProperties.$localStorage = {
        setItem(key: string, value: any) {
          localStorage.setItem(key, JSON.stringify(value));
        },
        getItem(key: string) {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        },
        removeItem(key: string) {
          localStorage.removeItem(key);
        },
      };
    },
  };
  