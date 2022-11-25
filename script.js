import fetch from 'node-fetch';

const limit = 25;
let page = 1;
let baseUrl = 'https://shuvalov2021.amocrm.ru/';
let getContactsListQueryUrl = '/api/v4/contacts';

async function getContacts() {
  let promise = await fetch(baseUrl + getContactsListQueryUrl).then(data => data.json());
  console.log(promise);
}

getContacts();
