defmodule RealworldPhoenixWeb.ArticleController do
  use RealworldPhoenixWeb, :controller

  alias RealworldPhoenix.Articles
  alias RealworldPhoenix.Articles.Article

  action_fallback(RealworldPhoenixWeb.FallbackController)

  def index(conn, params) do
    keywords = for {key, val} <- params, do: {String.to_atom(key), val}

    keywords =
      case Guardian.Plug.current_resource(conn) do
        nil -> keywords
        user -> keywords |> Keyword.put(:user, user)
      end

    articles =
      Articles.list_articles(keywords)
      |> Articles.article_preload()

    render(conn, "index.json", articles: articles)
  end

  def create(conn, %{"article" => article_params}) do
    params_with_atoms =
      for {key, val} <- article_params, into: %{}, do: {String.to_atom(key), val}

    with user when not is_nil(user) <- Guardian.Plug.current_resource(conn),
         article_params <- Map.put(params_with_atoms, :author_id, user.id),
         {:ok, article} <- Articles.create_article(article_params) do
      article =
        article
        |> Articles.article_preload()

      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.article_path(conn, :show, article))
      |> render("show.json", article: article)
    else
      _ -> conn |> put_status(:unprocessable_entity) |> json(%{error: "Unable to create article"})
    end
  end

  def show(conn, %{"slug" => "undefined"}) do
    conn
    |> put_status(:bad_request)
    |> json(%{error: "Invalid parameter"})
  end

  def show(conn, %{"slug" => slug}) do
    user = Guardian.Plug.current_resource(conn)

    with %Article{} = article <-
           Articles.get_article_by_slug(slug, user),
         article <- article |> Articles.article_preload() do
      render(conn, "show.json", article: article)
    else
      nil -> conn |> put_status(:not_found) |> json(%{error: "Article not found"})
    end
  end

  def update(conn, %{"slug" => slug, "article" => article_params}) do
    with %Article{} = article <- Articles.get_article_by_slug(slug),
         {:ok, %Article{} = updated_article} <- Articles.update_article(article, article_params) do
      updated_article =
        updated_article
        |> Articles.article_preload()

      render(conn, "show.json", article: updated_article)
    else
      nil -> conn |> put_status(:not_found) |> json(%{error: "Article not found"})
      _ -> conn |> put_status(:unprocessable_entity) |> json(%{error: "Unable to update article"})
    end
  end

  def delete(conn, %{"slug" => slug}) do
    with %Article{} = article <- Articles.get_article_by_slug(slug),
         {:ok, %Article{}} <- Articles.delete_article(article) do
      send_resp(conn, :no_content, "")
    else
      nil -> conn |> put_status(:not_found) |> json(%{error: "Article not found"})
      _ -> conn |> put_status(:unprocessable_entity) |> json(%{error: "Unable to delete article"})
    end
  end

  def feed(conn, params) do
    keywords = for {key, val} <- params, do: {String.to_atom(key), val}

    user = Guardian.Plug.current_resource(conn)

    articles =
      Articles.list_articles_feed(user, keywords)
      |> Articles.article_preload()

    render(conn, "index.json", articles: articles)
  end
end
