defmodule RealworldPhoenixWeb.CommentController do
  use RealworldPhoenixWeb, :controller

  alias RealworldPhoenix.Articles
  alias RealworldPhoenix.Articles.Comment
  alias RealworldPhoenix.Repo

  action_fallback(RealworldPhoenixWeb.FallbackController)

  def list(conn, %{"slug" => slug}) do
    user = Guardian.Plug.current_resource(conn)

    comments = Articles.list_comment_by_article_slug(slug, user) |> Repo.preload(:author)
    render(conn, "list.json", comments: comments)
  end

  def create(conn, %{"comment" => comment_params}) do
    params_with_atoms =
      for {key, val} <- comment_params, into: %{}, do: {String.to_atom(key), val}

    with user <- Guardian.Plug.current_resource(conn),
    article <- Articles.get_article_by_slug(params_with_atoms[:slug]),
         new_comment_params =
           params_with_atoms |> Map.put(:author_id, user.id) |> Map.put(:article_id, article.id),
         {:ok, comment} <- Articles.create_comment(new_comment_params) do
      comment =
        comment
        |> Articles.comment_preload()

      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.article_path(conn, :show, article))
      |> render("show.json", comment: comment)
    end

    # with user <- Guardian.Plug.current_resource(conn),
    #      %Article{} = article <- Articles.get_article_by_slug(slug),
    #      {:ok, comment} = Articles.create_comment(%{body: body}, article, user) do
    #   render(conn, "show.json", comment: comment |> Repo.preload(:author))
    # end
  end

  def delete(conn, %{"slug" => _, "id" => comment_id}) do
    %{id: user_id} = Guardian.Plug.current_resource(conn)

    with %Comment{} = comment <- Articles.get_comment!(comment_id),
         ^user_id <- comment.author_id,
         {:ok, _} <- Articles.delete_comment(comment) do
      send_resp(conn, 200, "")
    end
  end

  def temp do
    # {{%MatchError{term: {:error, #Ecto.Changeset<action: :insert, changes: %{author_id: 1, article_id: 76}, errors: [body: {"can't be blank", [validation: :required]}], data: #RealworldPhoenix.Articles.Comment<>, valid?: false>}}
  end
end
