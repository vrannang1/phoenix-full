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
alias RealworldPhoenix.Accounts.User
alias RealworldPhoenix.Repo

{:ok, user} =
  %{
    email: "venkat@example.com",
    firstName: "Venkat",
    lastName: "Annangi",
    password: "Mum130brad898"
  }
  |> Accounts.create_user()

# categories = ~w(business entertainment general health science sports technology)

# categories
# |> Enum.map(fn cat ->
#   1..5
#   |> Enum.map(fn page ->
#     newsapi =
#       "https://newsapi.org/v2/top-headlines?apiKey=93f988d7f8c646cdb46525a25e0648d1&country=us&category=#{cat}&page=#{page}"

#     case HTTPoison.get(newsapi) do
#       {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
#         body
#         |> Jason.decode!()
#         |> Map.get("articles")
#         |> Enum.map(fn article ->
#           case article["title"] == "[Removed]" do
#             true ->
#               :ok

#             _ ->
#               Articles.create_article(%{
#                 title: article["title"],
#                 description: article["description"],
#                 body: article["content"],
#                 source: article["source"]["name"],
#                 tags: [article["source"]["name"]],
#                 externalUrl: article["url"],
#                 imageUrl: article["urlToImage"],
#                 tagList: %{"0" => article["source"]["name"]},
#                 image: article["url"],
#                 photo_urls: [article["urlToImage"]],
#                 favoritesCount: 0,
#                 # published_at: article["publishedAt"],
#                 # author: article["author"],
#                 author_id: user.id
#               }) |> IO.inspect
#           end
#         end)

#       {:ok, %HTTPoison.Response{status_code: 404}} ->
#         "Not found :("

#       {:error, %HTTPoison.Error{reason: reason}} ->
#         reason
#     end
#   end)
# end)

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

# user = Repo.get_by(User, email: "venkat@example.com")

1..500
|> Enum.map(fn article ->
  dev_url = "https://dev.to/api/articles?page=#{article}&per_page=100"

  case HTTPoison.get(dev_url) do
    {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
      body
      |> Jason.decode!()
      |> Enum.map(fn id ->
        id = id["id"]

        article_url = "https://dev.to/api/articles/#{id}"

        case HTTPoison.get(article_url) do
          {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
            article = body |> Jason.decode!()

            Articles.create_article(%{
              title: article["title"],
              description: article["description"],
              body: article["body_html"],
              source: "dev.to",
              externalUrl: article["url"],
              imageUrl: article["cover_image"],
              tags: article["tags"],
              # tagList: article["tag_list"],
              favoritesCount: 0,
              # published_at: article["publishedAt"],
              # author: article["author"],
              author_id: user.id
            })
            |> IO.inspect()

          {:ok, %HTTPoison.Response{status_code: 429, body: body}} ->
            :ok

          {:ok, _} ->
            :ok

          _ ->
            :ok
        end
      end)

    {:ok, %HTTPoison.Response{status_code: 429, body: body}} ->
      :ok

    {:ok, _} ->
      :ok

    _ ->
      :ok

      :timer.sleep(5000)
  end
end)
