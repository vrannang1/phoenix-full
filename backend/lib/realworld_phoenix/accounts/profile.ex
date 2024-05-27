defmodule RealworldPhoenix.Accounts.Profile do
  use Ecto.Schema
  import Ecto.Changeset

  embedded_schema do
    field(:bio, :string)
    field(:url, :string)
    field(:location, :string)
    field(:work, :string)
    field(:education, :string)
  end

  def changeset(profile, attrs) do
    profile
    |> cast(attrs, [:bio, :url, :location, :work, :education])
    |> cast_embed(:profile)
  end

end
