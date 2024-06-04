defmodule RealworldPhoenixWeb.FallbackController do
  @moduledoc """
  Translates controller action results into valid `Plug.Conn` responses.

  See `Phoenix.Controller.action_fallback/1` for more details.
  """
  use RealworldPhoenixWeb, :controller

  require Logger

  # This clause handles errors returned by Ecto's insert/update/delete.
  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    Logger.error("Changeset error: #{inspect(changeset)}")
    conn
    |> put_status(:unprocessable_entity)
    |> put_view(RealworldPhoenixWeb.ChangesetView)
    |> render("error.json", changeset: changeset)
  end

  # This clause is an example of how to handle resources that cannot be found.
  def call(conn, {:error, :not_found}) do
    Logger.error("Resource not found")
    conn
    |> put_status(:not_found)
    |> put_view(RealworldPhoenixWeb.ErrorView)
    |> render(:"404")
  end

  def call(conn, {:error, :invalid_parameter}) do
    Logger.error("Invalid parameter")

    conn
    |> put_status(:bad_request)
    |> put_view(RealworldPhoenixWeb.ErrorView)
    |> render("400.json")
  end


  # This clause is an example of how to handle resources that cannot be found.
  def call(conn, {:error, error}) do
    Logger.error("Error: #{inspect(error)}")
    conn
    |> put_status(error)
    |> put_view(RealworldPhoenixWeb.ErrorView)
    |> render(:"404")
  end

  def call(conn, _) do
    Logger.error("Unhandled error")
    conn
    |> put_status(500)
    |> put_view(RealworldPhoenixWeb.ErrorView)
    |> render(:"500")
  end
end
