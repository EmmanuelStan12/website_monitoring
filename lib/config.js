const environments = {};

environments.development = {
    'http': 3000,
    'https': 3001,
    'env': 'development',
    'hashingSecret' : 'thisIsAlsoASecret',
    'maxChecks': 5
}

environments.staging = {
    'http': 4000,
    'https': 4001,
    'env': 'staging',
    'hashingSecret' : 'thisIsAlsoASecret',
    'maxChecks': 5
}

environments.production = {
    'http': 5000,
    'https': 5001,
    'env': 'production',
    'hashingSecret' : 'thisIsAlsoASecret',
    'maxChecks': 5
}

const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

const env = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = env;