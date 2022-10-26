import "reflect-metadata";
import { dataSource } from "./data-source";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";

import LocationResolver from "./resolvers/location/location-resolver";

import { IncomingMessage, ServerResponse } from "http";
import { Container } from "typedi";

import { setFunctionalServices } from "./di";

const dev = false;
const resolvers = [LocationResolver] as any;

/** Initiate container */
setFunctionalServices();

async function startServer() {
  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: true,
    container: Container,
  });

  const server = new ApolloServer({
    schema, 
  });

  await server.listen(4000);
  console.log("Server has started!");
}
startServer();
