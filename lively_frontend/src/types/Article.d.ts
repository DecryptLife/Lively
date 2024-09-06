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
  commentsID: Array<IComment>;
  commentsDisplayed?: boolean;
  __v?: string | number;
}

interface IUpdateArticle extends Partial<IArticle> {}
