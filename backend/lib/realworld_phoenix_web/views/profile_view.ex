defmodule RealworldPhoenixWeb.ProfileView do
  use RealworldPhoenixWeb, :view
  alias RealworldPhoenixWeb.ProfileView
  alias RealworldPhoenix.ImageUploader

  def render("show.json", %{profile: profile, following: following}) do
    %{profile: render_one(profile, ProfileView, "profile.json", %{following: following})}
  end

  def render("profile.json", %{profile: profile, following: following}) do
    %{
      username: profile.username,
      fullName: Enum.join([profile.firstName, " ", profile.lastName]),
      firstName: profile.firstName,
      lastName: profile.lastName,
      location: profile.location,
      education: profile.education,
      work: profile.work,
      url: profile.work,
      bio: profile.bio,
      image: ImageUploader.url({profile.image, profile}, String.to_atom("thumb")),
      following: following
    }
  end
end
