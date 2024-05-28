defmodule RealworldPhoenixWeb.ArticleView do
  use RealworldPhoenixWeb, :view
  alias RealworldPhoenixWeb.ArticleView
  alias RealworldPhoenix.ImageUploader
  alias RealworldPhoenixWeb.TagView

  def render("index.json", %{articles: articles}) do
    %{
      articles: render_many(articles, ArticleView, "article.json"),
      articlesCount: length(articles)
    }
  end

  def render("show.json", %{article: article}) do
    %{article: render_one(article, ArticleView, "article.json")}
  end

  def render("article.json", %{article: article}) do
    %{
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      source: article.source,
      coverImage: ImageUploader.url({article.coverImage,article}, String.to_atom("thumb")),
      imageUrl: article.imageUrl,
      tagList: render_many(article.tags, TagView, "tags.json"),
      favoritesCount: article.favorites |> Enum.count(),
      favorited: article.favorited,
      createdAt:
        article.inserted_at
        |> DateTime.truncate(:millisecond)
        |> DateTime.to_iso8601(:extended, 0),
      updatedAt:
        article.updated_at
        |> DateTime.truncate(:millisecond)
        |> DateTime.to_iso8601(:extended, 0),
      author: render_one(article.author, ArticleView, "author.json")
    }
  end

  def render("author.json", %{article: author}) do
    %{
      username: author.username,
      bio: author.bio,
      image: ImageUploader.url({author.image,author}, String.to_atom("thumb")),
      following: author.following
    }
  end
end
