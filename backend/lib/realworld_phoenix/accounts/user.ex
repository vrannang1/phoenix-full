defmodule RealworldPhoenix.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :bio, :string
    field :email, :string
    field :image, :string
    field :username, :string
    field :password, :string

    field :following, :boolean, virtual: true

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :username, :bio, :image, :password])
    |> validate_required([:email, :username, :password])
    |> unique_constraint(:email, name: :users_email_index)
    |> put_pass_hash()
  end

  defp put_pass_hash(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    change(changeset, %{password: Bcrypt.hash_pwd_salt(password)})
  end

  defp put_pass_hash(changeset), do: changeset
end
