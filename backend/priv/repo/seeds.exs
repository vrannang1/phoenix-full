# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     RealworldPhoenix.Repo.insert!(%RealworldPhoenix.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias RealworldPhoenix.Articles

alias RealworldPhoenix.Accounts

{:ok, user} =
  %{
    email: "venkat@example.com",
    username: "venkat",
    password: "Mum130brad898"
  }  |> Accounts.create_user()

categories = ~w(business entertainment general health science sports technology)

categories
|> Enum.map(fn cat ->
  1..5
  |> Enum.map(fn page ->
    newsapi =
      "https://newsapi.org/v2/top-headlines?apiKey=93f988d7f8c646cdb46525a25e0648d1&country=us&category=#{cat}&page=#{page}"

    case HTTPoison.get(newsapi) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        body
        |> Jason.decode!()
        |> Map.get("articles")
        |> Enum.map(fn article ->
          case article["title"] == "[Removed]" do
            true ->
              :ok

            _ ->
              Articles.create_article(%{
                title: article["title"],
                description: article["description"],
                body: article["content"],
                # tags: %{"0" => article["source"]["name"]},
                tagList: %{"0" => article["source"]["name"]},
                image: article["url"],
                photo_urls: [article["urlToImage"]],
                favoritesCount: 0,
                # published_at: article["publishedAt"],
                # author: article["author"],
                author_id: user.id
              })
          end
        end)

      {:ok, %HTTPoison.Response{status_code: 404}} ->
        "Not found :("

      {:error, %HTTPoison.Error{reason: reason}} ->
        reason
    end
  end)
end)

# 1..10
# |> Enum.each(fn i ->
#   %{
#     title: "How to train your dragon #{i}",
#     description: "Ever wonder how?",
#     body: "It takes a Jacobian",
#     tagList: ["dragons", "training"],
#     favoritesCount: 0,
#     author_id: user.id
#   }
#   |> Articles.create_article()
# end)
