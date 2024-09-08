export type ConfigTypes = {
  port: number;
  url: string;
  whiteList: string[];
  databaseConfig: {
    uri: string;
  };
  jwtOptions: {
    tokenSecret: string;
  };
  cloudinaryConfig: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  roles: string[];
  adminCredentials: {
    code: number;
    password: string;
  };
};
