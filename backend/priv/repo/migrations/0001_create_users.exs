defmodule RealworldPhoenix.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :firstName, :string
      add :lastName, :string
      add :email, :string
      add :username, :string
      add :bio, :string
      add :url, :string
      add :location, :string
      add :education, :string
      add :work, :string
      add :image, :string
      add :hashed_password, :string
      add :uuid, :string

      timestamps()
    end
    create unique_index(:users, [:email])
    create unique_index(:users, [:username])

  end
end
