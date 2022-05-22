import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo'
import { IntrospectAndCompose } from '@apollo/gateway'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
// import GraphQLJSON from 'graphql-type-json'

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      imports: [],
      inject: [],
      driver: ApolloGatewayDriver,
      useFactory: () => ({
        server: {
          playground: false,
          debug: true,
          cors: true,
          path: '/graphql',
          plugins: [ApolloServerPluginLandingPageLocalDefault()]
        },
        gateway: {
          debug: true,
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              { name: 'users', url: 'http://localhost:3069/graphql' }
              // { name: 'auth', url: 'http://localhost:3070/graphql' }
            ]
          })
        }
      })
    })
  ]
})
export class ApolloModule {}
