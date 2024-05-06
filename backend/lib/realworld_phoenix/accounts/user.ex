defmodule RealworldPhoenix.Accounts.User do
  use Ecto.Schema
  use Arc.Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :bio, :string
    field :email, :string
    field :image, RealworldPhoenix.ImageUploader.Type
    field :username, :string
    field :password, :string
    field :uuid, :string

    field :following, :boolean, virtual: true

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    attributes =
      case attrs[:photoUrl] do
        %Plug.Upload{} -> Map.merge(attrs, %{image: attrs[:photoUrl]})
        _ -> attrs
      end |> IO.inspect

    user
    |> cast(attributes, [:email, :username, :bio, :uuid, :image, :password])
    |> check_uuid
    |> cast_attachments(attributes, [:image])
    |> validate_required([:email, :username, :password])
    |> validate_format(:email, ~r/^^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/, message: "must have no spaces, @ sign and 2 or 3 characters after period(.)")
    |> validate_length(:email, max: 160, message: "cannot be more than 160 characters")
    |> unique_constraint(:email, name: :users_email_index)
    |> put_pass_hash()
    |> IO.inspect
  end

  defp put_pass_hash(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    change(changeset, %{password: Bcrypt.hash_pwd_salt(password)})
  end

  defp put_pass_hash(changeset), do: changeset

  defp check_uuid(changeset) do
    if get_field(changeset, :uuid) == nil do
      force_change(changeset, :uuid, Ecto.UUID.generate())
    else
      changeset
    end
  end

end
