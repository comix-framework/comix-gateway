import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo'
import { IntrospectAndCompose } from '@apollo/gateway'
// import GraphQLJSON from 'graphql-type-json'

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      imports: [],
      inject: [],
      driver: ApolloGatewayDriver,
      useFactory: () => ({
        server: {
          debug: true,
          cors: true,
          path: '/graphql'
        },
        gateway: {
          debug: true,
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              { name: 'started', url: 'http://localhost:3069/graphql' }
            ]
          })
        }
      })
    })
  ]
})
export class ApolloModule {}
