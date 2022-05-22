import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { AuthModule } from '@app/auth/auth.module'
import { AuthService } from '@app/auth/auth.service'
// import GraphQLJSON from 'graphql-type-json'

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [AuthModule],
      inject: [AuthService],
      driver: ApolloDriver,
      useFactory: (authService: AuthService) => ({
        playground: false,
        autoSchemaFile: true,
        sortSchema: true,
        debug: true,
        cors: true,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        subscriptions: {
          'subscriptions-transport-ws': {
            onConnect: async ({ Authorization }) => {
              if (Authorization) {
                return {
                  currentUser: await authService.checkToken(Authorization)
                }
              }
            }
          },
          'graphql-ws': {
            onConnect: async (context: any) => {
              const { connectionParams, extra } = context

              // user validation will remain the same as in the example above
              // when using with graphql-ws, additional context value should be stored in the extra field
              extra.user = await authService.checkToken(
                connectionParams.Authorization
              )
            }
          },
          context: ({ extra }) => {
            console.log('Contect WS: ', extra?.user?.id)
            return {
              currentUser: extra.user
            }
          }
        },
        //resolvers: { JSON: GraphQLJSON },
        context: ({ req }) => ({ req })
      })
    })
  ]
})
export class ApolloModule {}
