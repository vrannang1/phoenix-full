defmodule ApiWeb.UsersRegistrationControllerTest do
  use ApiWeb.ConnCase, async: true

  import Api.AccountsFixtures

  describe "GET /user/register" do
    test "renders registration page", %{conn: conn} do
      conn = get(conn, ~p"/user/register")
      response = html_response(conn, 200)
      assert response =~ "Register"
      assert response =~ ~p"/user/log_in"
      assert response =~ ~p"/user/register"
    end

    test "redirects if already logged in", %{conn: conn} do
      conn = conn |> log_in_users(users_fixture()) |> get(~p"/user/register")

      assert redirected_to(conn) == ~p"/"
    end
  end

  describe "POST /user/register" do
    @tag :capture_log
    test "creates account and logs the users in", %{conn: conn} do
      email = unique_users_email()

      conn =
        post(conn, ~p"/user/register", %{
          "users" => valid_users_attributes(email: email)
        })

      assert get_session(conn, :users_token)
      assert redirected_to(conn) == ~p"/"

      # Now do a logged in request and assert on the menu
      conn = get(conn, ~p"/")
      response = html_response(conn, 200)
      assert response =~ email
      assert response =~ ~p"/user/settings"
      assert response =~ ~p"/user/log_out"
    end

    test "render errors for invalid data", %{conn: conn} do
      conn =
        post(conn, ~p"/user/register", %{
          "users" => %{"email" => "with spaces", "password" => "too short"}
        })

      response = html_response(conn, 200)
      assert response =~ "Register"
      assert response =~ "must have the @ sign and no spaces"
      assert response =~ "should be at least 12 character"
    end
  end
end
