import { describe, it, expect, jest } from "@jest/globals";
import { run } from "../src/runner";
import lokijs from "lokijs";

const metaDataLokiInsert = {
  meta: { revision: 0, created: Date.now(), version: 0 },
  $loki: 1,
};

const ID_UUID = "0";
jest.mock("node:crypto", () => ({
  randomUUID: jest.fn(() => ID_UUID),
}));

jest.mock("lokijs");

function configureDbDriverMock(initialData = [{ collection: "", data: [] }]) {
  const spies = {
    db: null,
    addCollection: null,
    insert: null,
    find: null,
  };

  const seedDB = () => {
    const dbData = {};
    initialData.forEach(({ collection, data }) => {
      dbData[collection] ??= [];
      data.forEach((item) => dbData[collection].push(item));
    });

    return dbData;
  };

  spies.db = lokijs.mockImplementationOnce((dbname) => {
    const _dbData = seedDB();

    const addCollection = (spies.addCollection = jest.fn((collectionName) => {
      const insert = (spies.insert = jest.fn((data) => {
        const item = {
          ...data,
          ...metaDataLokiInsert,
        };
        _dbData[collectionName].push(item);

        return item;
      }));
      const find = (spies.find = jest.fn(() => {
        return _dbData[collectionName];
      }));

      return {
        insert,
        find,
      };
    }));
    return { addCollection };
  });

  return spies;
}

describe("Complex Tests", () => {
  it("should spy DB Driver calls", async () => {
    const dbName = "heroes";
    const collectionName = "characters";
    const initialData = [
      {
        id: "1",
        name: "Chapolin",
        age: 80,
        power: "Axe",
        ...metaDataLokiInsert,
      },
    ];
    const seedDB = [
      {
        collection: collectionName,
        data: initialData,
      },
    ];
    const input = {
      name: "Batman",
      power: "rich",
      age: 50,
    };

    jest.spyOn(console, 'log').mockImplementation(() => {})
    const spies = configureDbDriverMock(seedDB);

    await run(input);

    const insertCall = {
      ...input,
      id: ID_UUID
    }
    const expectedInsertResult = {
      ...input,
      ...metaDataLokiInsert,
      id: ID_UUID
    }

    expect(spies.db).toHaveBeenNthCalledWith(1, dbName)
    expect(spies.addCollection).toHaveBeenNthCalledWith(1, collectionName)
    expect(spies.insert).toHaveBeenNthCalledWith(1, insertCall)
    expect(spies.find).toHaveBeenNthCalledWith(1)

    const logCalls = console.log.mock.calls

    expect(logCalls[0]).toEqual([
      'createHero',
      expectedInsertResult
    ])

    const expectedCurrentDB = initialData.concat(expectedInsertResult)
    expect(logCalls[1]).toEqual([
      'listHeroes',
      expectedCurrentDB
    ])
  });
});
