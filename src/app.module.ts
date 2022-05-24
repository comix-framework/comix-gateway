import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApolloModule } from './apollo/apollo.module'

@Module({
  imports: [ApolloModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
