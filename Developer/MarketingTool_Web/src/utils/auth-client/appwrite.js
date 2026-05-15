import { Client, Account, Storage, ID } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'http://localhost/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId);

export const appwriteClient = client;
export const appwriteAccount = new Account(client);
export const appwriteStorage = new Storage(client);
export { ID };
