defmodule RealworldPhoenix.Articles.Article do
  use Ecto.Schema
  use Arc.Ecto.Schema
  import Ecto.Changeset

  alias RealworldPhoenix.Accounts.User
  alias RealworldPhoenix.Articles.Comment
  alias RealworldPhoenix.Articles.Favorite

  schema "articles" do
    field :body, :string
    field :description, :string
    field :slug, :string
    field :title, :string
    field :uuid, :string
    field :source, :string, default: "annrapid"
    field :externalUrl, :string
    field :imageUrl, :string
    field :coverImage, RealworldPhoenix.ImageUploader.Type
    field :tags, {:array, :string}, default: []
    belongs_to :author, User

    field :favorited, :boolean, virtual: true

    has_many :comments, Comment
    has_many :favorites, Favorite

    # many_to_many :tagList, Tag, join_through: ArticleTag, on_replace: :delete

    timestamps(type: :utc_datetime_usec)
  end

  @doc false
  def changeset(article, attrs) do
    attributes =
      case attrs[:photoUrl] do
        %Plug.Upload{} -> Map.merge(attrs, %{coverImage: attrs[:photoUrl]})
        _ -> attrs
      end

    article
    |> cast(attributes, [:title, :description, :uuid, :tags, :body, :source, :externalUrl, :imageUrl, :author_id])
    |> check_uuid
    |> cast_attachments(attributes, [:coverImage])
    |> cast_assoc(:author)
    # |> put_assoc(:tagList, parse_tags(attrs))
    # |> parse_tags(attributes)
    |> validate_required([:title, :body])
    |> unique_constraint(:slug, name: :articles_slug_index)
    |> title_to_slugify()
  end

  def title_to_slugify(changeset) do
    case get_change(changeset, :title) do
      nil -> changeset
      title -> put_change(changeset, :slug, slugify(title))
    end
  end
  defp slugify(title) do
    title |> String.downcase() |> String.replace(~r/[^\w-]+/u, "-")
  end

  def parse_tags(changeset, params) do
    tags = (params["tagList"] || params[:tagList] || [])
    |> Enum.map( fn {_key, value} -> value end)
    put_change(changeset, :tags, tags)
  end

  # defp get_or_insert_tag(name) do
  #   Repo.get_by(Tag, name: name) ||
  #     Repo.insert!(%Tag{name: name})
  # end

  defp check_uuid(changeset) do
    if get_field(changeset, :uuid) == nil do
      force_change(changeset, :uuid, Ecto.UUID.generate())
    else
      changeset
    end
  end
end
