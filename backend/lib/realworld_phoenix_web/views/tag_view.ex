defmodule RealworldPhoenixWeb.TagView do
  use RealworldPhoenixWeb, :view
  alias RealworldPhoenixWeb.TagView

  def render("index.json", %{tags: tags}) do
    %{
      tags: render_many(tags, TagView, "tags.json")
    }
  end

  def render("tags.json", %{tag: tag}) do
    tag
  end

end
