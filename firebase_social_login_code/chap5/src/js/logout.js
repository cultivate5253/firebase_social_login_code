import { getAuth } from 'firebase/auth';

const logout = () => {
  const auth = getAuth();
  auth.signOut();
};

export default logout;
