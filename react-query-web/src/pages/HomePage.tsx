import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import FeedList from '@/components/feed/FeedList';
import { useGetArticlesQueries } from '@/queries/articles.query';
import { UserContext } from '@/contexts/UserContextProvider';

const HomePage = () => {
  const { isLogin } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [isGlobal, setIsGlobal] = useState(true);
  const [selectedTag, setSelectedTag] = useState('');
  const [articlesInfo, tagsInfo] = useGetArticlesQueries(isGlobal, page, selectedTag);

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {isLogin && (
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${isGlobal ? '' : 'active'}`}
                      to="/"
                      onClick={() => {
                        setIsGlobal(false);
                      }}
                    >
                      Your Feed
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className={`nav-link ${isGlobal ? 'active' : ''}`} to="/" onClick={() => setIsGlobal(true)}>
                    Global Feed
                  </Link>
                </li>
              </ul>
            </div>
            <FeedList articlesInfo={articlesInfo.data} toUrl={'/'} page={page} setPage={setPage} />
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <div className="tag-list">
                {tagsInfo.data.map((tag: string) => (
                  <Link
                    to="/"
                    key={tag}
                    className="tag-pill tag-default"
                    onClick={() => {
                      setSelectedTag(tag);
                    }}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
