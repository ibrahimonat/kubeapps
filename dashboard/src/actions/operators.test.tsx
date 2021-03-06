import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { IResource } from "shared/types";
import { getType } from "typesafe-actions";
import actions from ".";
import { Operators } from "../shared/Operators";

const { operators: operatorActions } = actions;
const mockStore = configureMockStore([thunk]);

let store: any;

beforeEach(() => {
  store = mockStore({});
});

afterEach(jest.resetAllMocks);

describe("checkOLMInstalled", () => {
  it("dispatches OLM_INSTALLED when succeded", async () => {
    Operators.isOLMInstalled = jest.fn(() => true);
    const expectedActions = [
      {
        type: getType(operatorActions.checkingOLM),
      },
      {
        type: getType(operatorActions.OLMInstalled),
      },
    ];
    await store.dispatch(operatorActions.checkOLMInstalled());
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches OLM_NOT_INSTALLED when failed", async () => {
    Operators.isOLMInstalled = jest.fn(() => false);
    const expectedActions = [
      {
        type: getType(operatorActions.checkingOLM),
      },
      {
        type: getType(operatorActions.OLMNotInstalled),
      },
    ];
    await store.dispatch(operatorActions.checkOLMInstalled());
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("getOperators", () => {
  it("returns an ordered list of operators based on the name", async () => {
    Operators.getOperators = jest.fn(() => [
      { metadata: { name: "foo" } },
      { metadata: { name: "bar" } },
    ]);
    const sortedOperators = [{ metadata: { name: "bar" } }, { metadata: { name: "foo" } }];
    const expectedActions = [
      {
        type: getType(operatorActions.requestOperators),
      },
      {
        type: getType(operatorActions.receiveOperators),
        payload: sortedOperators,
      },
    ];
    await store.dispatch(operatorActions.getOperators("default"));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches an error", async () => {
    Operators.getOperators = jest.fn(() => {
      throw new Error("Boom!");
    });
    const expectedActions = [
      {
        type: getType(operatorActions.requestOperators),
      },
      {
        type: getType(operatorActions.errorOperators),
        payload: new Error("Boom!"),
      },
    ];
    await store.dispatch(operatorActions.getOperators("default"));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("getOperator", () => {
  it("returns an an operator", async () => {
    const op = { metadata: { name: "foo" } };
    Operators.getOperator = jest.fn(() => op);
    const expectedActions = [
      {
        type: getType(operatorActions.requestOperator),
      },
      {
        type: getType(operatorActions.receiveOperator),
        payload: op,
      },
    ];
    await store.dispatch(operatorActions.getOperator("default", "foo"));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches an error", async () => {
    Operators.getOperator = jest.fn(() => {
      throw new Error("Boom!");
    });
    const expectedActions = [
      {
        type: getType(operatorActions.requestOperator),
      },
      {
        type: getType(operatorActions.errorOperators),
        payload: new Error("Boom!"),
      },
    ];
    await store.dispatch(operatorActions.getOperator("default", "foo"));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("getCSVs", () => {
  it("returns an ordered list of csvs based on the name", async () => {
    Operators.getCSVs = jest.fn(() => [
      { metadata: { name: "foo" } },
      { metadata: { name: "bar" } },
    ]);
    const sortedCSVs = [{ metadata: { name: "bar" } }, { metadata: { name: "foo" } }];
    const expectedActions = [
      {
        type: getType(operatorActions.requestCSVs),
      },
      {
        type: getType(operatorActions.receiveCSVs),
        payload: sortedCSVs,
      },
    ];
    await store.dispatch(operatorActions.getCSVs("default"));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches an error", async () => {
    Operators.getCSVs = jest.fn(() => {
      throw new Error("Boom!");
    });
    const expectedActions = [
      {
        type: getType(operatorActions.requestCSVs),
      },
      {
        type: getType(operatorActions.errorCSVs),
        payload: new Error("Boom!"),
      },
    ];
    await store.dispatch(operatorActions.getCSVs("default"));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("getCSV", () => {
  it("returns an an ClusterServiceVersion", async () => {
    const csv = { metadata: { name: "foo" } };
    Operators.getCSV = jest.fn(() => csv);
    const expectedActions = [
      {
        type: getType(operatorActions.requestCSV),
      },
      {
        type: getType(operatorActions.receiveCSV),
        payload: csv,
      },
    ];
    await store.dispatch(operatorActions.getCSV("default", "foo"));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches an error", async () => {
    Operators.getCSV = jest.fn(() => {
      throw new Error("Boom!");
    });
    const expectedActions = [
      {
        type: getType(operatorActions.requestCSV),
      },
      {
        type: getType(operatorActions.errorCSVs),
        payload: new Error("Boom!"),
      },
    ];
    await store.dispatch(operatorActions.getCSV("default", "foo"));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("createResource", () => {
  it("creates a resource", async () => {
    const resource = {} as IResource;
    Operators.createResource = jest.fn(() => resource);
    const expectedActions = [
      {
        type: getType(operatorActions.creatingResource),
      },
      {
        type: getType(operatorActions.resourceCreated),
        payload: resource,
      },
    ];
    await store.dispatch(operatorActions.createResource("default", "v1", "pods", {}));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches an error", async () => {
    Operators.createResource = jest.fn(() => {
      throw new Error("Boom!");
    });
    const expectedActions = [
      {
        type: getType(operatorActions.creatingResource),
      },
      {
        type: getType(operatorActions.errorResourceCreate),
        payload: new Error("Boom!"),
      },
    ];
    await store.dispatch(operatorActions.createResource("default", "v1", "pods", {}));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("getResources", () => {
  it("list resources in a namespace", async () => {
    const csv = {
      metadata: { name: "foo" },
      spec: {
        customresourcedefinitions: { owned: [{ name: "foo.kubeapps.com", version: "v1alpha1" }] },
      },
    };
    const resource = { metadata: { name: "resource" } };
    Operators.getCSVs = jest.fn(() => [csv]);
    Operators.listResources = jest.fn(() => {
      return {
        items: [resource],
      };
    });
    const expectedActions = [
      {
        type: getType(operatorActions.requestCustomResources),
      },
      {
        type: getType(operatorActions.requestCSVs),
      },
      {
        type: getType(operatorActions.receiveCSVs),
        payload: [csv],
      },
      {
        type: getType(operatorActions.receiveCustomResources),
        payload: [resource],
      },
    ];
    await store.dispatch(operatorActions.getResources("default"));
    expect(store.getActions()).toEqual(expectedActions);
    expect(Operators.listResources).toHaveBeenCalledWith("default", "kubeapps.com/v1alpha1", "foo");
  });

  it("dispatches an error if listing resources fail", async () => {
    const csv = {
      metadata: { name: "foo" },
      spec: {
        customresourcedefinitions: { owned: [{ name: "foo.kubeapps.com", version: "v1alpha1" }] },
      },
    };
    Operators.getCSVs = jest.fn(() => [csv]);
    Operators.listResources = jest.fn(() => {
      throw new Error("Boom!");
    });
    const expectedActions = [
      {
        type: getType(operatorActions.requestCustomResources),
      },
      {
        type: getType(operatorActions.requestCSVs),
      },
      {
        type: getType(operatorActions.receiveCSVs),
        payload: [csv],
      },
      {
        type: getType(operatorActions.errorCustomResource),
        payload: new Error("Boom!"),
      },
    ];
    await store.dispatch(operatorActions.getResources("default"));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("getResources", () => {
  it("get a resource in a namespace", async () => {
    const csv = {
      metadata: { name: "foo" },
      spec: {
        customresourcedefinitions: { owned: [{ name: "foo.kubeapps.com", version: "v1alpha1" }] },
      },
    };
    const resource = { metadata: { name: "resource" } };
    Operators.getCSV = jest.fn(() => csv);
    Operators.getResource = jest.fn(() => resource);
    const expectedActions = [
      {
        type: getType(operatorActions.requestCustomResource),
      },
      {
        type: getType(operatorActions.requestCSV),
      },
      {
        type: getType(operatorActions.receiveCSV),
        payload: csv,
      },
      {
        type: getType(operatorActions.receiveCustomResource),
        payload: resource,
      },
    ];
    await store.dispatch(operatorActions.getResource("default", "foo", "foo.kubeapps.com", "bar"));
    expect(store.getActions()).toEqual(expectedActions);
    expect(Operators.getResource).toHaveBeenCalledWith(
      "default",
      "kubeapps.com/v1alpha1",
      "foo",
      "bar",
    );
  });

  it("dispatches an error if getting a resource fails", async () => {
    const csv = {
      metadata: { name: "foo" },
      spec: {
        customresourcedefinitions: { owned: [{ name: "foo.kubeapps.com", version: "v1alpha1" }] },
      },
    };
    Operators.getCSV = jest.fn(() => csv);
    Operators.getResource = jest.fn(() => {
      throw new Error("Boom!");
    });
    const expectedActions = [
      {
        type: getType(operatorActions.requestCustomResource),
      },
      {
        type: getType(operatorActions.requestCSV),
      },
      {
        type: getType(operatorActions.receiveCSV),
        payload: csv,
      },
      {
        type: getType(operatorActions.errorCustomResource),
        payload: new Error("Boom!"),
      },
    ];
    await store.dispatch(operatorActions.getResource("default", "foo", "foo.kubeapps.com", "bar"));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches an error if the given csv is not found", async () => {
    Operators.getCSV = jest.fn(() => undefined);
    const expectedActions = [
      {
        type: getType(operatorActions.requestCustomResource),
      },
      {
        type: getType(operatorActions.requestCSV),
      },
      {
        type: getType(operatorActions.receiveCSV),
      },
      {
        type: getType(operatorActions.errorCustomResource),
        payload: new Error("CSV foo not found in default"),
      },
    ];
    await store.dispatch(operatorActions.getResource("default", "foo", "foo.kubeapps.com", "bar"));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches an error if the given crd is not found fails", async () => {
    const csv = {
      metadata: { name: "foo" },
      spec: {
        customresourcedefinitions: { owned: [{ name: "foo.kubeapps.com", version: "v1alpha1" }] },
      },
    };
    Operators.getCSV = jest.fn(() => csv);
    const expectedActions = [
      {
        type: getType(operatorActions.requestCustomResource),
      },
      {
        type: getType(operatorActions.requestCSV),
      },
      {
        type: getType(operatorActions.receiveCSV),
        payload: csv,
      },
      {
        type: getType(operatorActions.errorCustomResource),
        payload: new Error("Not found a valid CRD definition for foo/not-foo.kubeapps.com"),
      },
    ];
    await store.dispatch(
      operatorActions.getResource("default", "foo", "not-foo.kubeapps.com", "bar"),
    );
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe("deleteResource", () => {
  it("delete a resource in a namespace", async () => {
    const resource = { metadata: { name: "resource" } } as any;
    Operators.deleteResource = jest.fn();
    const expectedActions = [
      {
        type: getType(operatorActions.deletingResource),
      },
      {
        type: getType(operatorActions.resourceDeleted),
      },
    ];
    await store.dispatch(operatorActions.deleteResource("default", "foos", resource));
    expect(store.getActions()).toEqual(expectedActions);
  });

  it("dispatches an error if deleting a resource fails", async () => {
    const resource = { metadata: { name: "resource" } } as any;
    Operators.deleteResource = jest.fn(() => {
      throw new Error("Boom!");
    });
    const expectedActions = [
      {
        type: getType(operatorActions.deletingResource),
      },
      {
        type: getType(operatorActions.errorResourceDelete),
        payload: new Error("Boom!"),
      },
    ];
    await store.dispatch(operatorActions.deleteResource("default", "foos", resource));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
