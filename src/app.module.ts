import { Module } from '@nestjs/common'
import { ItemsModule } from './items/items.module'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
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
      autoLoadEntities: true
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
