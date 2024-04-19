defmodule ApiWeb.UsersResetPasswordControllerTest do
  use ApiWeb.ConnCase, async: true

  alias Api.Accounts
  alias Api.Repo
  import Api.AccountsFixtures

  setup do
    %{users: users_fixture()}
  end

  describe "GET /user/reset_password" do
    test "renders the reset password page", %{conn: conn} do
      conn = get(conn, ~p"/user/reset_password")
      response = html_response(conn, 200)
      assert response =~ "Forgot your password?"
    end
  end

  describe "POST /user/reset_password" do
    @tag :capture_log
    test "sends a new reset password token", %{conn: conn, users: users} do
      conn =
        post(conn, ~p"/user/reset_password", %{
          "users" => %{"email" => users.email}
        })

      assert redirected_to(conn) == ~p"/"

      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~
               "If your email is in our system"

      assert Repo.get_by!(Accounts.UsersToken, users_id: users.id).context == "reset_password"
    end

    test "does not send reset password token if email is invalid", %{conn: conn} do
      conn =
        post(conn, ~p"/user/reset_password", %{
          "users" => %{"email" => "unknown@example.com"}
        })

      assert redirected_to(conn) == ~p"/"

      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~
               "If your email is in our system"

      assert Repo.all(Accounts.UsersToken) == []
    end
  end

  describe "GET /user/reset_password/:token" do
    setup %{users: users} do
      token =
        extract_users_token(fn url ->
          Accounts.deliver_users_reset_password_instructions(users, url)
        end)

      %{token: token}
    end

    test "renders reset password", %{conn: conn, token: token} do
      conn = get(conn, ~p"/user/reset_password/#{token}")
      assert html_response(conn, 200) =~ "Reset password"
    end

    test "does not render reset password with invalid token", %{conn: conn} do
      conn = get(conn, ~p"/user/reset_password/oops")
      assert redirected_to(conn) == ~p"/"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "Reset password link is invalid or it has expired"
    end
  end

  describe "PUT /user/reset_password/:token" do
    setup %{users: users} do
      token =
        extract_users_token(fn url ->
          Accounts.deliver_users_reset_password_instructions(users, url)
        end)

      %{token: token}
    end

    test "resets password once", %{conn: conn, users: users, token: token} do
      conn =
        put(conn, ~p"/user/reset_password/#{token}", %{
          "users" => %{
            "password" => "new valid password",
            "password_confirmation" => "new valid password"
          }
        })

      assert redirected_to(conn) == ~p"/user/log_in"
      refute get_session(conn, :users_token)

      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~
               "Password reset successfully"

      assert Accounts.get_users_by_email_and_password(users.email, "new valid password")
    end

    test "does not reset password on invalid data", %{conn: conn, token: token} do
      conn =
        put(conn, ~p"/user/reset_password/#{token}", %{
          "users" => %{
            "password" => "too short",
            "password_confirmation" => "does not match"
          }
        })

      assert html_response(conn, 200) =~ "something went wrong"
    end

    test "does not reset password with invalid token", %{conn: conn} do
      conn = put(conn, ~p"/user/reset_password/oops")
      assert redirected_to(conn) == ~p"/"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "Reset password link is invalid or it has expired"
    end
  end
end
