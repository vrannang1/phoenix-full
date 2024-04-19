import logo from './logo.svg';
import './App.css';
import { useQuery } from 'react-query';

function App() {
  const getArticles = async () => {
    const res = await fetch('http://localhost:4000/api/articles');
    return res.json();
  };

  const { data, error, isLoading } = useQuery('articles', getArticles);

  if (isLoading) return <div>Loading...</div>
  if (error) return <>{console.log(error)}</>

  return (
    <div>
      {data.articles.map( (article) => {
        return (
          <div key={article.id}>
          {article.title}<br/>
          </div>
        )
      })}
    </div>
  )


}

export default App;
