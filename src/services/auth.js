export const TOKEN_KEY = 'blood_token';
export const NAME = 'blood_name';
export const ID = 'blood_id';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getName = () => localStorage.getItem(NAME);
export const getID = () => localStorage.getItem(ID);

export const login = (token, name, id) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(NAME, name);
  localStorage.setItem(ID, id);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME);
  localStorage.removeItem(ID);
};
