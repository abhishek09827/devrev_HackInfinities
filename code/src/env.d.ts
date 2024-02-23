declare global {
    namespace NodeJS {
        interface ProcessEnv {
            HOST: string
            NODE_ENV: 'development' | 'production'
            FIREBASE_API_KEY: "firebase_api_key"
            TWITTER_API_KEY: "TWITTER_API_KEY"
            TWITTER_API_SECRET: "TWITTER_API_SECRET"
            TWITTER_ACCESS_TOKEN: "TWITTER_ACCESS_TOKEN"
            TWITTER_API_TOKEN_SECRET: "TWITTER_API_TOKEN_SECRET"
        }
    }
}
export {}