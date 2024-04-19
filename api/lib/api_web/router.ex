defmodule ApiWeb.Router do
  use ApiWeb, :router

  import ApiWeb.UsersAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {ApiWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_users
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ApiWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  # Other scopes may use custom stacks.
  # scope "/api", ApiWeb do
  #   pipe_through :api
  # end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:api, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: ApiWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  ## Authentication routes

  scope "/", ApiWeb do
    pipe_through [:browser, :redirect_if_users_is_authenticated]

    get "/user/register", UsersRegistrationController, :new
    post "/user/register", UsersRegistrationController, :create
    get "/user/log_in", UsersSessionController, :new
    post "/user/log_in", UsersSessionController, :create
    get "/user/reset_password", UsersResetPasswordController, :new
    post "/user/reset_password", UsersResetPasswordController, :create
    get "/user/reset_password/:token", UsersResetPasswordController, :edit
    put "/user/reset_password/:token", UsersResetPasswordController, :update
  end

  scope "/", ApiWeb do
    pipe_through [:browser, :require_authenticated_users]

    get "/user/settings", UsersSettingsController, :edit
    put "/user/settings", UsersSettingsController, :update
    get "/user/settings/confirm_email/:token", UsersSettingsController, :confirm_email
  end

  scope "/", ApiWeb do
    pipe_through [:browser]

    delete "/user/log_out", UsersSessionController, :delete
    get "/user/confirm", UsersConfirmationController, :new
    post "/user/confirm", UsersConfirmationController, :create
    get "/user/confirm/:token", UsersConfirmationController, :edit
    post "/user/confirm/:token", UsersConfirmationController, :update
  end
end
