import * as dotenv from 'dotenv';
import { getAccessTokens, createTaskQuery, getContactsQuery } from './utils.js';
dotenv.config();

!process.env.ACCESS_TOKEN ? process.env.ACCESS_TOKEN = await getAccessTokens() : process.env.ACCESS_TOKEN;

async function createTasks() {
  let page = 1;
  let limit = 25;
  let contacts = await getContactsQuery(limit,page);
  while (contacts) {
    contacts.forEach(item => !item?._embedded?.leads.length ? createTaskQuery(item.id) : '')
    page++;
    contacts = await getContactsQuery(limit,page);
  }
}

await createTasks();


