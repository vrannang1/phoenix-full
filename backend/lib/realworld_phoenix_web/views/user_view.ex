defmodule RealworldPhoenixWeb.UserView do
  use RealworldPhoenixWeb, :view
  alias RealworldPhoenixWeb.UserView
  alias RealworldPhoenix.ImageUploader

  def render("index.json", %{users: users}) do
    %{user: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user} = params) do
    %{user: render_one(user, UserView, "user.json", params)}
  end

  def render("show.json", %{error: changeset} ) do
    %{
      errors: changeset_errors(changeset)
    }
  end

  def render("user.json", %{user: user, token: token}) do
    render("user.json", %{user: user})
    |> Map.put_new(:token, token)
  end

  def render("login.json", %{error: _error}) do
    %{
      errors: %{emailOrPassword: "is invalid"}
    }
  end

  def render("user.json", %{user: user}) do
    %{
      email: user.email,
      username: user.username,
      bio: user.bio,
      image: ImageUploader.url({user.image,user}, String.to_atom("thumb"))
    }
  end

  defp changeset_errors(changeset) do
    changeset.errors |> Enum.map(fn {field, {error, _details}} -> Map.put(%{}, field, error) end) |> Enum.at(0)
  end
end
