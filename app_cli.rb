#!/usr/bin/env ruby
# ==============================================================================
# UNUSED sample tool (GitHub device-flow login) — kept for reference only.
# NOTE: GitHub's device flow ALWAYS signs in a PERSONAL user account (whichever
# user the browser is logged in as) — there is no such thing as "logging in as
# an org"; org access comes from that user's membership. All real org tooling
# on this machine authenticates via `gh` (keyring), NOT this script.
# ==============================================================================

require "net/http"
require "json"
require "uri"
require "fileutils"

CLIENT_ID="Iv23linUnoTGeSfKfKrE"

# One fixed location in $HOME — the old "./.token" was relative to whatever
# directory the command ran from, so `login` scattered token files across the
# disk and `whoami` failed from any other cwd.
TOKEN_PATH = File.join(Dir.home, ".app_cli_token")

def help
  puts "usage: app_cli <login | whoami | help>"
end

def main
  case ARGV[0]
  when "help"
    help
  when "login"
    login
  when "whoami"
    whoami
  when nil
    help
  else
    puts "Unknown command #{ARGV[0]}"
    help
    exit 1
  end
end

def parse_response(response)
  case response
  when Net::HTTPOK, Net::HTTPCreated
    JSON.parse(response.body)
  when Net::HTTPUnauthorized
    puts "You are not authorized. Run the `login` command."
    exit 1
  else
    puts response
    puts response.body
    exit 1
  end
end

def request_device_code
  uri = URI("https://github.com/login/device/code")
  parameters = URI.encode_www_form("client_id" => CLIENT_ID)
  headers = {"Accept" => "application/json"}

  response = Net::HTTP.post(uri, parameters, headers)
  parse_response(response)
end

def request_token(device_code)
  uri = URI("https://github.com/login/oauth/access_token")
  parameters = URI.encode_www_form({
    "client_id" => CLIENT_ID,
    "device_code" => device_code,
    "grant_type" => "urn:ietf:params:oauth:grant-type:device_code"
  })
  headers = {"Accept" => "application/json"}
  response = Net::HTTP.post(uri, parameters, headers)
  parse_response(response)
end

def poll_for_token(device_code, interval)

  loop do
    response = request_token(device_code)
    error, access_token = response.values_at("error", "access_token")

    if error
      case error
      when "authorization_pending"
        # The user has not yet entered the code.
        # Wait, then poll again.
        sleep interval
        next
      when "slow_down"
        # The app polled too fast.
        # Wait for the interval plus 5 seconds, then poll again.
        sleep interval + 5
        next
      when "expired_token"
        # The `device_code` expired, and the process needs to restart.
        puts "The device code has expired. Please run `login` again."
        exit 1
      when "access_denied"
        # The user cancelled the process. Stop polling.
        puts "Login cancelled by user."
        exit 1
      else
        puts response
        exit 1
      end
    end

    # perm: applies at CREATION so the token is never world-readable, even
    # briefly (the old write-then-chmod left a 0644 window). chmod still runs
    # for the case where the file already existed with wider permissions.
    File.write(TOKEN_PATH, access_token, perm: 0o600)
    FileUtils.chmod(0o600, TOKEN_PATH)

    break
  end
end

def login
  verification_uri, user_code, device_code, interval = request_device_code.values_at("verification_uri", "user_code", "device_code", "interval")

  puts "Please visit: #{verification_uri}"
  puts "and enter code: #{user_code}"

  poll_for_token(device_code, interval)

  puts "Successfully authenticated!"
end

def whoami
  uri = URI("https://api.github.com/user")

  begin
    token = File.read(TOKEN_PATH).strip
  rescue Errno::ENOENT
    puts "You are not authorized. Run the `login` command."
    exit 1
  end

  # GET with the Authorization header ONLY — the old code also serialized the
  # token into a GET request body, exposing it a second time for no reason.
  response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
    headers = {"Accept" => "application/vnd.github+json", "Authorization" => "Bearer #{token}"}
    http.send_request("GET", uri.path, nil, headers)
  end

  parsed_response = parse_response(response)
  puts "You are #{parsed_response["login"]}"
end

main

