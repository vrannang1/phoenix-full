defmodule RealworldPhoenix.Repo.Migrations.CreateArticles do
  use Ecto.Migration

  def change do
    create table(:articles) do
      add :slug, :string
      add :title, :string
      add :description, :text
      add :body, :text
      add :tags, {:array, :string}
      add :favoritesCount, :integer
      add :author_id, references(:users)
      add :uuid, :string

      timestamps()
    end
  end
end
