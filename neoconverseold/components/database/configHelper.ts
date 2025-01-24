
const KeyPrefix = 'NEXT_PUBLIC';

const DbKeys = {
    Database: "DATABASE",
    Host: "HOST",
    Username: "UNAME",
    Password: "PWD"
}

export const GetDbConfig = (dbConfigName) => {
    return {
        databaseName: GetEnvConfig(dbConfigName, DbKeys.Database),
        hostUrl: GetEnvConfig(dbConfigName, DbKeys.Host),
        username: GetEnvConfig(dbConfigName, DbKeys.Username),
        password: GetEnvConfig(dbConfigName, DbKeys.Password)      
    }
}

export const GetEnvConfig = (dbConfigName, key) => {
    let keyName = `${KeyPrefix}_${dbConfigName}_${key}`
    return process.env[keyName];
}