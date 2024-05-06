defmodule RealworldPhoenixWeb.UserController do
  use RealworldPhoenixWeb, :controller

  alias RealworldPhoenix.Accounts
  alias RealworldPhoenix.Accounts.User

  import RealworldPhoenix.Guardian

  action_fallback(RealworldPhoenixWeb.FallbackController)

  def create(conn, %{"user" => user_params}) do
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
    user = Guardian.Plug.current_resource(conn)

    with {:ok, %User{} = user} <- Accounts.update_user(user, user_params) do
      {:ok, token, _} = encode_and_sign(user)
      render(conn, "show.json", user: user, token: token)
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

    # user = Accounts.get_user_by_email(email)

    # case Bcrypt.check_pass(user, password, hash_key: :password) do
    #   {:error, msg} ->
    #     render(conn, "login.json", error: msg)

    #   _ ->
    #     {:ok, token, _} = encode_and_sign(user)
    #     render(conn, "show.json", user: user, token: token)
    # end
  end
end