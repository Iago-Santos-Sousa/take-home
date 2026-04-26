import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import KeyvRedis from "@keyv/redis";

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl =
          configService.get<string>("REDIS_URL") ?? "redis://localhost:6379";
        return {
          stores: [new KeyvRedis(redisUrl)],
          ttl: 5 * 60 * 1000, // 5 minutos em milissegundos
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
