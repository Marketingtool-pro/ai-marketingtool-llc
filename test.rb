require 'facebookbusiness'

# Credentials come from the environment — never hardcode tokens in source.
#   export FB_ACCESS_TOKEN=...
#   export FB_APP_SECRET=...
#   export FB_AD_ACCOUNT_ID=925198393533156   # digits only, no "act_" prefix
# abort with the exact `export` to run instead of a raw KeyError backtrace
def env!(name)
  ENV.fetch(name) { abort "Missing credential: run  export #{name}=..." }
end

FacebookAds.configure do |config|
  config.access_token = env!('FB_ACCESS_TOKEN')
  config.app_secret   = env!('FB_APP_SECRET')
end

account_id = env!('FB_AD_ACCOUNT_ID')
ad_account = FacebookAds::AdAccount.get("act_#{account_id}", 'name')

ad_account.campaigns(fields: 'name').each do |campaign|
  puts campaign.name
end
