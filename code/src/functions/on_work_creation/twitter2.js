const axios = require('axios');


export async function fn(tweet_id){
  const options = {
    method: 'GET',
    url: 'https://twitter154.p.rapidapi.com/tweet/replies/continuation',
    params: {
      tweet_id: tweet_id,
      continuation_token: 'QAAAAPEVHBlmhMCxoZOeibklgsCs4ZScibklgMCxzeOaibkljMC5xdSgGwDwCLul45iJuSWEwKyxwJuJuSUlAhIVBAAA'
    },
  headers: {
    'X-RapidAPI-Key': 'a925a293d2mshcec469a951384d9p1b9521jsne214938a5b1b',
    'X-RapidAPI-Host': 'twitter154.p.rapidapi.com'
  }
};
try {
	const response = await axios.request(options);
	return response.data;
} catch (error) {
	console.error(error);
}}
