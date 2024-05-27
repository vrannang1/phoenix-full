defmodule RealworldPhoenixWeb.UserController do
  use RealworldPhoenixWeb, :controller

  alias RealworldPhoenix.Accounts
  alias RealworldPhoenix.Accounts.User

  import RealworldPhoenix.Guardian

  action_fallback(RealworldPhoenixWeb.FallbackController)

  def create(conn, %{"user" => user_params}) do

    IO.inspect user_params

    with {:ok, %User{} = user} <- Accounts.create_user(user_params) do
      {:ok, token, _} = encode_and_sign(user)

      conn
      |> render("show.json", user: user, token: token)
    else
      {:error, changeset} ->
        render(conn, "show.json", error: changeset)
    end
  end

  def show(conn, _) do
    user = Guardian.Plug.current_resource(conn)
    {:ok, token, _} = encode_and_sign(user)
    render(conn, "show.json", user: user, token: token)
  end

  def update(conn, %{"user" => user_params}) do
    params = for {key, val} <- user_params, into: %{}, do: {String.to_atom(key), val}
    user = Guardian.Plug.current_resource(conn)

    with {:ok, %User{} = user} <- Accounts.update_user(user, params) do
      {:ok, token, _} = encode_and_sign(user)
      render(conn, "show.json", user: user, token: token)
    else
      {:error, changeset} ->
        render(conn, "show.json", error: changeset)
    end
  end

  def login(conn, %{"user" => %{"email" => email, "password" => password}}) do
    case Accounts.get_user_by_email_and_password(email, password) do
      {:ok, user} ->
        {:ok, token, _} = encode_and_sign(user)
        render(conn, "show.json", user: user, token: token)

      {:error, msg} ->
        render(conn, "login.json", error: msg)
    end
  end
end
