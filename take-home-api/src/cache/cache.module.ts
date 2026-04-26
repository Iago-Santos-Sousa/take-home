import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import KeyvRedis from "@keyv/redis";
import { Socket } from "node:net";

const assertRedisTcpConnection = async (redisUrl: string): Promise<void> => {
  const parsed = new URL(redisUrl);
  const host = parsed.hostname;
  const port = parsed.port ? Number(parsed.port) : 6379;

  await new Promise<void>((resolve, reject) => {
    const socket = new Socket();

    const handleError = (error: Error) => {
      socket.destroy();
      reject(error);
    };

    socket.setTimeout(3_000);
    socket.once("timeout", () => {
      handleError(new Error("Timeout ao conectar no Redis"));
    });

    socket.once("error", handleError);
    socket.connect(port, host, () => {
      socket.end();
      resolve();
    });
  });
};

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl =
          configService.get<string>("REDIS_URL") ?? "redis://localhost:6379";

        try {
          await assertRedisTcpConnection(redisUrl);
        } catch (error) {
          throw new Error(
            `Redis indisponivel em ${redisUrl}. A API nao sera iniciada. Erro: ${error instanceof Error ? error.message : "desconhecido"}`,
          );
        }

        const redisStore = new KeyvRedis(redisUrl);
        const healthKey = "__redis_startup_healthcheck__";

        try {
          await redisStore.set(healthKey, "ok", 1_000);
          const healthValue = await redisStore.get<string>(healthKey);
          await redisStore.delete(healthKey);

          if (healthValue !== "ok") {
            throw new Error("Redis healthcheck returned unexpected value");
          }
        } catch (error) {
          throw new Error(
            `Redis indisponivel em ${redisUrl}. A API nao sera iniciada. Erro: ${error instanceof Error ? error.message : "desconhecido"}`,
          );
        }

        return {
          stores: [redisStore],
          ttl: 5 * 60 * 1000, // 5 minutos em milissegundos
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
