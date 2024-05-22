defmodule RealworldPhoenixWeb.FallbackController do
  @moduledoc """
  Translates controller action results into valid `Plug.Conn` responses.

  See `Phoenix.Controller.action_fallback/1` for more details.
  """
  use RealworldPhoenixWeb, :controller

  # This clause handles errors returned by Ecto's insert/update/delete.
  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> put_view(RealworldPhoenixWeb.ChangesetView)
    |> render("error.json", changeset: changeset)
    |> halt()
  end

  # This clause is an example of how to handle resources that cannot be found.
  def call(conn, {:error, :not_found_item}) do
    conn
    |> put_status(:not_found_item)
    |> put_view(RealworldPhoenixWeb.ErrorView)
    |> render(:"404")
    |> halt()
  end

  def call(conn, _) do
    conn
    |> put_status(500)
    |> put_view(RealworldPhoenixWeb.ErrorView)
    |> render(:"404")
    |> halt()
  end
end
