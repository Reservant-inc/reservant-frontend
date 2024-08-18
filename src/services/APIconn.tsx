import Cookies from "js-cookie";
import { FetchError } from '../services/Errors';

export const fetchGET = async (connString: string) => {
  const token = Cookies.get("token");

  const response = await fetch(
    `${process.env.REACT_APP_SERVER_IP}${connString}`,
    {
      headers: {
        Authorization: `Bearer ${token as string}`,
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData);
  }

  const data = await response.json();

  return data;
};

export const fetchPOST = async (connString: string, body?: string) => {
  const token = Cookies.get("token");

  const fetchOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token as string}`,
    },
  };

  // czasem jest post bez body i jest error jezeli doda sie body, wiec
  // conditionally dodawanie body
  if (body) {
    fetchOptions.body = body;
  }

  const response = await fetch(
    `${process.env.REACT_APP_SERVER_IP}${connString}`,
    fetchOptions,
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new FetchError(errorData.title, errorData.status);
  }

  const text = await response.text();
  if (!text) {
    return {};
  }

  const data = JSON.parse(text);

  return data;
};

export const fetchPUT = async (connString: string, body: string) => {
  const token = Cookies.get("token");

  const response = await fetch(
    `${process.env.REACT_APP_SERVER_IP}${connString}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token as string}`,
      },
      body: body,
    },
  );

  if(!(response.json.length > 0)){
    return
  }

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData);
  }

  const data = await response.json();

  return data;
};

export const fetchDELETE = async (connString: string) => {
  const token = Cookies.get("token");

  const response = await fetch(
    `${process.env.REACT_APP_SERVER_IP}${connString}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token as string}`,
      },
    },
  );

  if(!(response.json.length > 0)){
    return
  }

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData.title);
    throw new FetchError(errorData.title, errorData.status);
  }

  const data = await response.json();

  return data;
};

export const fetchFilesPOST = async (connString: string, file: File) => {
  const token = Cookies.get("token");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.REACT_APP_SERVER_IP}${connString}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token as string}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData);
  }

  const data = await response.json();

  return data;
};

export const getImage = (path: string) => {
  return `${process.env.REACT_APP_SERVER_IP}${path}`;
};
