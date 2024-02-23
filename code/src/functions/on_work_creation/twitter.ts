import { TwitterClient  } from 'twitter-api-client';

// Initialize the Twitter API client
const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
  apiSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_API_TOKEN_SECRET,
});

// Function to fetch timeline
export async function fetchTimeline(): Promise<any> {
    try {
        // Fetch tweets using the Twitter API client
        const tweets = await twitterClient.tweets.statusesMentionsTimeline({})
        console.log(tweets);
        

        return tweets;
    } catch (error) {
        console.error('Error fetching timeline:', error);
        return null;
    }
}
fetchTimeline()