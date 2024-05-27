export interface postLoginParam {
  email: string;
  password: string;
}

export interface postRegisterParam {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface putUserParam {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  url: string;
  location: string;
  education: string;
  work: string;
  image: string;
  password: string;
}
