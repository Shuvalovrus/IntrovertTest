import * as dotenv from 'dotenv';
import fetch from "node-fetch";
import fs from "fs";
dotenv.config();

const {BASE_URL, CLIENT_ID, CLIENT_SECRET, CODE, REDIRECT_URI, ACCESS_TOKEN} = process.env;

export async function getAccessTokens() {
  const getTokensQueryUrl = BASE_URL + '/oauth2/access_token';
  const getTokensQueryBody =  JSON.stringify({
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "grant_type": "authorization_code",
    "code": CODE,
    "redirect_uri": REDIRECT_URI
  });

  const response = await fetch(getTokensQueryUrl, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: getTokensQueryBody
  })

  const result = await response.json();

  if (result.status === 400) throw new Error(`${result.hint}`);

  fs.appendFile(".env", `ACCESS_TOKEN="${result.access_token}"`, function(error){
    if(error) throw error;
  });

  return result.access_token;
}

export async function createTaskQuery(id) {
  const createTaskQueryUrl = BASE_URL + '/api/v4/tasks';
  const currentDate = new Date();
  const dateInTwoHours = Math.floor(currentDate.setHours(currentDate.getHours() + 2) / 1000);

  const createTaskQueryBody = JSON.stringify([{
    "entity_type": "contacts",
    "entity_id": id,
    "complete_till": dateInTwoHours,
    "text": "Контакт без сделок"
  }]);

  const response = await fetch(createTaskQueryUrl , {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
    },
    body: createTaskQueryBody
  })
  if (response.status === 400) throw new Error(`${response.hint}`);
}

export async function getContactsQuery(limit,page) {
  const getContactsListQueryUrl = BASE_URL + '/api/v4/contacts';

  let response = await fetch(getContactsListQueryUrl + '?with=leads' + `&page=${page}` + `&limit=${limit}`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
    }
  })

  if (response.status === 400) throw new Error('Что то пошло не так!');
  if (response.status === 204) {
    console.log('Пользователи не найдены');
  } else {
    let result = await response.json();
    return result?._embedded?.contacts;
  }
}
