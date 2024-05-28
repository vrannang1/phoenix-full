defmodule RealworldPhoenixWeb.ProfileController do
  use RealworldPhoenixWeb, :controller

  alias RealworldPhoenix.Accounts.User
  alias RealworldPhoenix.Profiles

  action_fallback(RealworldPhoenixWeb.FallbackController)

  def show(conn, %{"username" => username}) do

    IO.inspect Profiles.get_by_username(username), label: "username"
    IO.inspect Guardian.Plug.current_resource(conn), label: "Guardian"

    with profile <- Profiles.get_by_username(username),
         %User{} = user <- Guardian.Plug.current_resource(conn),
         following <- Profiles.following?(user, profile) do
      render(conn, "show.json", profile: profile, following: following)
    end

    # profile = Profiles.get_by_username(username)

    # following =
    #   case Guardian.Plug.current_resource(conn) do
    #     %User{} = user -> Profiles.following?(user, profile)
    #     _ -> false
    #   end

    # render(conn, "show.json", profile: profile, following: following)
  end

  def follow(conn, %{"username" => username}) do
    IO.inspect(username, label: "Follow controller")

    user = Guardian.Plug.current_resource(conn)

    with target_user <- Profiles.get_by_username(username),
         {:ok, _} = Profiles.create_follow(user, target_user) do
      render(conn, "show.json", profile: target_user, following: true)
    end
  end

  def unfollow(conn, %{"username" => username}) do
    user = Guardian.Plug.current_resource(conn)

    with target_user <- Profiles.get_by_username(username),
         {1, _} = Profiles.delete_follow(user, target_user) do
      render(conn, "show.json", profile: target_user, following: false)
    end
  end
end
