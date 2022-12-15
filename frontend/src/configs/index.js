export const envConfig = {
    development: {
        appApiUrl: "http://localhost:3020/api",
    },
    production: {
        appApiUrl: `${process.env.REACT_APP_API_URL}`,
    },
};