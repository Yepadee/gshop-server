import NodeEnvironment from "jest-environment-node";
import { startServer } from "./src/start";

export class GraphQLEnvironment extends NodeEnvironment {

  app;

  constructor(config) {
    super(config);
  }

  async setup() {
    this.app = await startServer();
    await super.setup();
  }

  async teardown() {
    this.app.close();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}