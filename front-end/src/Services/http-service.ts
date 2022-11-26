const domain = "http://localhost:5000";

const get = async (route: string) => {
  const response = await fetch(`${domain}${route}`, {
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
    mode: "cors",
  });
  const data = await response.json();

  return data;
};

const post = async (route: string, body: any) => {
  const bodyOption = body ? { body: JSON.stringify(body) } : {};
  const response = await fetch(`${domain}${route}`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...bodyOption,
    credentials: "include",
    mode: "cors",
  });
  const data = await response.json();

  return data;
};
const put = async (route: string, body: any) => {
  const bodyOption = body ? { body: JSON.stringify(body) } : {};
  const response = await fetch(`${domain}${route}`, {
    method: "put",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...bodyOption,
    credentials: "include",
    mode: "cors",
  });
  const updateddata = await response.json();

  return updateddata;
};
export const httpService = { post, get, put };
