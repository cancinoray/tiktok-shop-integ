interface IConfig {
  port: string;
}

export const config: IConfig = {
  port: process.env.PORT || "9090",
};
