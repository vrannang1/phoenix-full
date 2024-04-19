import { useGetArticleQueries } from '@/queries/articles.query';
import { Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ButtonSelector from '@/components/article/ButtonSelector';
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContextProvider';
import Comment from '@/components/article/Comment';
import routerMeta from '@/lib/routerMeta';
import convertToDate from '@/lib/utils/convertToDate';

const ArticlePage = () => {
  const { state } = useLocation();
  const [articleInfo, commentsInfo] = useGetArticleQueries(state);
  const { isLogin } = useContext(UserContext);

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{articleInfo.data.title}</h1>

          <div className="article-meta">
            <Link to={`/profile/${articleInfo.data.author.username}`} state={articleInfo.data.author.username}>
              <img src={articleInfo.data.author.image} alt="comment-author" />
            </Link>

            <div className="info">
              <Link
                to={`/profile/${articleInfo.data.author.username}`}
                state={articleInfo.data.author.username}
                className="author"
              >
                {articleInfo.data.author.username}
              </Link>
              <span className="date">{convertToDate(articleInfo.data.updatedAt)}</span>
            </div>
            {isLogin ? <ButtonSelector articleInfo={articleInfo.data} /> : <></>}
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <ReactMarkdown children={articleInfo.data.body} remarkPlugins={[remarkGfm]}></ReactMarkdown>
          </div>
        </div>
        <div>
          {articleInfo.data.tagList.map((tag: string) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </div>
        <hr />

        <div className="article-actions">
          <div className="article-meta">
            <Link to={`/profile/${articleInfo.data.author.username}`} state={articleInfo.data.author.username}>
              <img src={articleInfo.data.author.image} alt="profile" />
            </Link>
            <div className="info">
              <Link
                to={`/profile/${articleInfo.data.author.username}`}
                state={articleInfo.data.author.username}
                className="author"
              >
                {articleInfo.data.author.username}
              </Link>
              <span className="date">{convertToDate(articleInfo.data.updatedAt)}</span>
            </div>
            {isLogin ? <ButtonSelector articleInfo={articleInfo.data} /> : <></>}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isLogin ? (
              <Comment comments={commentsInfo.data} slug={articleInfo.data.slug} />
            ) : (
              <p>
                <Link to={routerMeta.SignInPage.path}>Sign in</Link>
                &nbsp;or&nbsp;
                <Link to={routerMeta.SignUpPage.path}>Sign up</Link>
                &nbsp;to add comments on this article.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
