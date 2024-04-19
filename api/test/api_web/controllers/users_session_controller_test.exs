defmodule ApiWeb.UsersSessionControllerTest do
  use ApiWeb.ConnCase, async: true

  import Api.AccountsFixtures

  setup do
    %{users: users_fixture()}
  end

  describe "GET /user/log_in" do
    test "renders log in page", %{conn: conn} do
      conn = get(conn, ~p"/user/log_in")
      response = html_response(conn, 200)
      assert response =~ "Log in"
      assert response =~ ~p"/user/register"
      assert response =~ "Forgot your password?"
    end

    test "redirects if already logged in", %{conn: conn, users: users} do
      conn = conn |> log_in_users(users) |> get(~p"/user/log_in")
      assert redirected_to(conn) == ~p"/"
    end
  end

  describe "POST /user/log_in" do
    test "logs the users in", %{conn: conn, users: users} do
      conn =
        post(conn, ~p"/user/log_in", %{
          "users" => %{"email" => users.email, "password" => valid_users_password()}
        })

      assert get_session(conn, :users_token)
      assert redirected_to(conn) == ~p"/"

      # Now do a logged in request and assert on the menu
      conn = get(conn, ~p"/")
      response = html_response(conn, 200)
      assert response =~ users.email
      assert response =~ ~p"/user/settings"
      assert response =~ ~p"/user/log_out"
    end

    test "logs the users in with remember me", %{conn: conn, users: users} do
      conn =
        post(conn, ~p"/user/log_in", %{
          "users" => %{
            "email" => users.email,
            "password" => valid_users_password(),
            "remember_me" => "true"
          }
        })

      assert conn.resp_cookies["_api_web_users_remember_me"]
      assert redirected_to(conn) == ~p"/"
    end

    test "logs the users in with return to", %{conn: conn, users: users} do
      conn =
        conn
        |> init_test_session(users_return_to: "/foo/bar")
        |> post(~p"/user/log_in", %{
          "users" => %{
            "email" => users.email,
            "password" => valid_users_password()
          }
        })

      assert redirected_to(conn) == "/foo/bar"
      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~ "Welcome back!"
    end

    test "emits error message with invalid credentials", %{conn: conn, users: users} do
      conn =
        post(conn, ~p"/user/log_in", %{
          "users" => %{"email" => users.email, "password" => "invalid_password"}
        })

      response = html_response(conn, 200)
      assert response =~ "Log in"
      assert response =~ "Invalid email or password"
    end
  end

  describe "DELETE /user/log_out" do
    test "logs the users out", %{conn: conn, users: users} do
      conn = conn |> log_in_users(users) |> delete(~p"/user/log_out")
      assert redirected_to(conn) == ~p"/"
      refute get_session(conn, :users_token)
      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~ "Logged out successfully"
    end

    test "succeeds even if the users is not logged in", %{conn: conn} do
      conn = delete(conn, ~p"/user/log_out")
      assert redirected_to(conn) == ~p"/"
      refute get_session(conn, :users_token)
      assert Phoenix.Flash.get(conn.assigns.flash, :info) =~ "Logged out successfully"
    end
  end
end
