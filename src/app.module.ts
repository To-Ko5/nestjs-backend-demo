import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { ItemsModule } from './items/items.module'
@Module({
  imports: [
    ItemsModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DATABASE_USER_NAME,
      password: process.env.DATABASE_PASSWORD,
      database: 'postgres',
      autoLoadEntities: true,
      entities: ['dist/entities/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
      cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations'
      }
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
