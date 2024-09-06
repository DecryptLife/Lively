interface IImage {}

interface IComment {
  comment: string;
  author: string;
  author_image: string;
}

interface IArticle {
  _id: string;
  text: string;
  authorID: string;
  image: object;
  date: string;
  comments: Array<IComment>;
  __v?: string | number;
}
