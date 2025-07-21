const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getFetcher = async (url: string) => {
  const response = await fetch(`${baseURL}${url}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const postFetcher = async (url: string, data: any) => {
  const response = await fetch(`${baseURL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const putFetcher = async (url: string, data: any) => {
  const response = await fetch(`${baseURL}${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const deleteFetcher = async (url: string, data: any) => {
  const params = new URLSearchParams(data);
  const response = await fetch(`${baseURL}${url}?${params}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}; 