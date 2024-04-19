defmodule ApiWeb.UsersRegistrationController do
  use ApiWeb, :controller

  alias Api.Accounts
  alias Api.Accounts.Users
  alias ApiWeb.UsersAuth

  def new(conn, _params) do
    changeset = Accounts.change_users_registration(%Users{})
    render(conn, :new, changeset: changeset)
  end

  def create(conn, %{"users" => users_params}) do
    case Accounts.register_users(users_params) do
      {:ok, users} ->
        {:ok, _} =
          Accounts.deliver_users_confirmation_instructions(
            users,
            &url(~p"/user/confirm/#{&1}")
          )

        conn
        |> put_flash(:info, "Users created successfully.")
        |> UsersAuth.log_in_users(users)

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, :new, changeset: changeset)
    end
  end
end
