/** @type {import('next').NextConfig} */

const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

const nextConfig = (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return {
            webpack(config) {
                // Grab the existing rule that handles SVG imports
                const fileLoaderRule = config.module.rules.find((rule) =>
                    rule.test?.test?.(".svg"),
                )
            
                config.module.rules.push(
                    // Reapply the existing rule, but only for svg imports ending in ?url
                    {
                    ...fileLoaderRule,
                    test: /\.svg$/i,
                    resourceQuery: /url/, // *.svg?url
                    },
                    // Convert all other *.svg imports to React components
                    {
                    test: /\.svg$/i,
                    issuer: /\.[jt]sx?$/,
                    resourceQuery: { not: /url/ }, // exclude if *.svg?url
                    use: ["@svgr/webpack"],
                    },
                )
            
                // Modify the file loader rule to ignore *.svg, since we have it handled now.
                fileLoaderRule.exclude = /\.svg$/i
            
                return config
            },
            reactStrictMode: true,
            env: {
                NEXTAUTH_URL: "http://localhost:3000",
                NEXTAUTH_SECRET: "N6rmb+F34RR7AGT3EiNSBhu4/H17BRVF9XVwm4JtbAg=",
                DB_USERNAME: "deniswmonteiro",
                DB_PASSWORD: "woftam-corMat-1pipna",
                DB_NAME: "fitness-protocols-db"
            }
        }
    }

    else {
        return {
            webpack(config) {
                // Grab the existing rule that handles SVG imports
                const fileLoaderRule = config.module.rules.find((rule) =>
                    rule.test?.test?.(".svg"),
                )
            
                config.module.rules.push(
                    // Reapply the existing rule, but only for svg imports ending in ?url
                    {
                    ...fileLoaderRule,
                    test: /\.svg$/i,
                    resourceQuery: /url/, // *.svg?url
                    },
                    // Convert all other *.svg imports to React components
                    {
                    test: /\.svg$/i,
                    issuer: /\.[jt]sx?$/,
                    resourceQuery: { not: /url/ }, // exclude if *.svg?url
                    use: ["@svgr/webpack"],
                    },
                )
            
                // Modify the file loader rule to ignore *.svg, since we have it handled now.
                fileLoaderRule.exclude = /\.svg$/i
            
                return config
            },
            reactStrictMode: true,
            env: {
                NEXTAUTH_URL: "https://fitnessprotocols.vercel.app",
                NEXTAUTH_SECRET: "EmvuPP8SCub18UsakDdCn9NHGzNzKB9yKgyvdx0cwz4=",
                DB_USERNAME: "deniswmonteiro",
                DB_PASSWORD: "woftam-corMat-1pipna",
                DB_NAME: "fitness-protocols-db"
            }
        }
    }
}

module.exports = nextConfig
