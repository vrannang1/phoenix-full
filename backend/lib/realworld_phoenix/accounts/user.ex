defmodule RealworldPhoenix.Accounts.User do
  use Ecto.Schema
  use Arc.Ecto.Schema
  import Ecto.Changeset
  alias RealworldPhoenix.Accounts

  schema "users" do
    field :bio, :string
    field :email, :string
    field :image, RealworldPhoenix.ImageUploader.Type
    field :username, :string
    field :password, :string, virtual: true
    field :hashed_password, :string
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
      end

    user
    |> cast(attributes, [:email, :username, :bio, :uuid,  :password])
    |> check_uuid
    |> cast_attachments(attributes, [:image])
    |> validate_required([:email, :username, :password])
    |> validate_format(:email, ~r/^^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/, message: "must have no spaces, @ sign and 2 or 3 characters after period(.)")
    |> validate_length(:email, max: 160, message: "cannot be more than 160 characters")
    |> unique_constraint(:email, name: :users_email_index)
    |> put_pass_hash()
  end

  defp put_pass_hash(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    change(changeset, %{hashed_password: Bcrypt.hash_pwd_salt(password)})
  end

  defp put_pass_hash(changeset), do: changeset

  defp check_uuid(changeset) do
    if get_field(changeset, :uuid) == nil do
      force_change(changeset, :uuid, Ecto.UUID.generate())
    else
      changeset
    end
  end

    @doc """
  Verifies the password.

  If there is no user or the user doesn't have a password, we call
  `Bcrypt.no_user_verify/0` to avoid timing attacks.
  """
  def valid_password?(%Accounts.User{hashed_password: hashed_password}, password)
      when is_binary(hashed_password) and byte_size(password) > 0 do
    Bcrypt.verify_pass(password, hashed_password)
  end

  def valid_password?(_, _) do
    Bcrypt.no_user_verify()
    false
  end

  @doc """
  Validates the current password otherwise adds an error to the changeset.
  """
  def validate_current_password(changeset, password) do
    if valid_password?(changeset.data, password) do
      changeset
    else
      add_error(changeset, :current_password, "is not valid")
    end
  end

end
