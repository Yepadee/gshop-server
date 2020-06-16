import { createConnection } from "typeorm";

beforeAll(async () => {
    const ormconfig = require("../../../ormconfig-test.json");
    await createConnection(ormconfig).then(async connection => {
      connection.synchronize(true)
    }).catch(error => console.log(error));
});

test("Add Category", async () => {

});