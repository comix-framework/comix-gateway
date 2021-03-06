import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo'
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
// import GraphQLJSON from 'graphql-type-json'

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    const headers = context?.req?.headers
    for (const key in headers) {
      const value = headers[key]
      if (value) {
        request.http?.headers.set(key, String(value))
      }
    }
  }
}

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
              { name: 'users', url: 'http://localhost:3069/graphql' },
              { name: 'categories', url: 'http://localhost:3070/graphql' }
            ]
          }),
          buildService({ name, url }) {
            return new AuthenticatedDataSource({ url })
          }
        }
      })
    })
  ]
})
export class ApolloModule {}
