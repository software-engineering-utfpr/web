export const TOKEN_KEY = 'blood_token';
export const ADMIN = 'blood_admin';
export const NAME = 'blood_name';
export const ID = 'blood_id';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const isAdmin = () => localStorage.getItem(ADMIN);
export const getName = () => localStorage.getItem(NAME);
export const getID = () => localStorage.getItem(ID);

export const login = (token, name, superuser, id) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(NAME, name);
  localStorage.setItem(ADMIN, superuser);
  localStorage.setItem(ID, id);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME);
  localStorage.removeItem(ADMIN);
  localStorage.removeItem(ID);
};
