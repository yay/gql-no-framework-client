import "./style.css";
import {
  ApolloClient,
  DocumentNode,
  FetchResult,
  gql,
} from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <button id="get-dogs-button" type="button">Get Dogs</button>
    <button id="create-folder-button" type="button">Create Folder</button>
    <select id="dog-selector">
  </div>
`;

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

const GET_DOGS: DocumentNode = gql`
  query GetDogs {
    dogs {
      id
      breed
    }
  }
`;

const CREATE_FOLDER: DocumentNode = gql`
  mutation CreateFolder($input: CreateFolderInput!) {
    createFolder(input: $input) {
      id
      name
      parentId
    }
  }
`;

type Dog = {
  id: string;
  breed: string;
};

type DogsQueryData = {
  dogs: Dog[];
};

type CreateFolderData = {
  data: {
    createFolder: {
      id: string;
      name: string;
      parentId: string;
      __typename: "Folder";
    };
  };
};

const getDogsButton =
  document.querySelector<HTMLButtonElement>("#get-dogs-button")!;
const createFolderButton = document.querySelector<HTMLButtonElement>(
  "#create-folder-button"
)!;
const dogSelector = document.querySelector<HTMLSelectElement>("#dog-selector")!;

getDogsButton.onclick = async () => {
  // `loading` seems to always be `false`.
  const { data, loading } = await client.query<DogsQueryData>({
    query: GET_DOGS,
  });
  data.dogs.forEach((dog) => {
    const option = document.createElement("option");
    option.setAttribute("key", dog.id);
    option.setAttribute("value", dog.breed);
    option.innerText = dog.breed;
    dogSelector.appendChild(option);
    return option;
  });
  console.log(data, loading);
};

async function createFolder(
  name: string,
  fileSystemId: string,
  parentId: string
): Promise<FetchResult<CreateFolderData>> {
  return await client.mutate<CreateFolderData>({
    mutation: CREATE_FOLDER,
    variables: {
      input: {
        name,
        fileSystemId,
        parentId,
      },
    },
  });
}

createFolderButton.onclick = async () => {
  const result = await createFolder("LOL", "FS", "NO");
  console.log("result", result);
};
