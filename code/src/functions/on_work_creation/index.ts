import { fetchData } from './insta'; // Import fetchData if it's defined in another file
import {client, publicSDK } from '@devrev/typescript-sdk';
import { ApiUtils, HTTPResponse } from './utils';
import { performAnalysis } from './llm_utils';

import axios, { AxiosRequestConfig } from 'axios';
import { fn } from './twitter2';
// import { fetchTimeline } from './twitter';

console.log('1');


export const run = async (events: any[]) => {
  for (const event of events) {
    const endpoint: string = event.execution_metadata.devrev_endpoint;
    const token: string = event.context.secrets.service_account_token;
    const snapInId = event.context.snap_in_id;
    const devrevPAT = event.context.secrets.service_account_token;
    const baseURL = event.execution_metadata.devrev_endpoint;
    const inputs = event.input_data.global_values;
    let tweet_id: string = event.payload.parameters.trim();
    const fireWorksApiKey: string = event.input_data.keyrings.fireworks_api_key;
    
    const tags = event.input_data.resources.tags;
    const apiUtil: ApiUtils = new ApiUtils(endpoint, token);
    let commentID: string | undefined;
    let numReviews = 10;

    // if (parameters === 'help') {
    //   // Send a help message in CLI help format.
    //   const helpMessage = `playstore_reviews_process - Fetch reviews from Google Play Store and create tickets in DevRev.\n\nUsage: /playstore_reviews_process <number_of_reviews_to_fetch>\n\n\`number_of_reviews_to_fetch\`: Number of reviews to fetch from Google Playstore. Should be a number between 1 and 100. If not specified, it defaults to 10.`;
    //   let postResp = await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, helpMessage, 1);
    //   if (!postResp.success) {
    //     console.error(`Error while creating timeline entry: ${postResp.message}`);
    //     continue;
    //   }
    //   continue;
    // }

    let postResp: HTTPResponse = await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, 'Fetching data from Twitter', 1);
    if (!postResp.success) {
      console.error(`Error while creating timeline entry: ${postResp.message}`);
      continue;
    }

    // if (!parameters) {
    //   parameters = '10';
    // }

    try {
      // numReviews = parseInt(parameters);

      if (!Number.isInteger(10)) {
        throw new Error('Not a valid number');
      }
    } catch (err) {
      postResp = await apiUtil.postTextMessage(snapInId, 'Please enter a valid number', commentID);
      if (!postResp.success) {
        console.error(`Error while creating timeline entry: ${postResp.message}`);
        continue;
      }
      commentID = postResp.data.timeline_entry.id;
    }

    if (numReviews > 100) {
      postResp = await apiUtil.postTextMessage(snapInId, 'Please enter a number less than 100', commentID);
      if (!postResp.success) {
        console.error(`Error while creating timeline entry: ${postResp.message}`);
        continue;
      }
      commentID = postResp.data.timeline_entry.id;
    }

    // Call Instagram API to fetch the requested number of reviews.
    
      // const response= await fetchData(); // Assuming fetchData is a function that fetches Instagram data
      // const reviews = response.data.comments;
      // console.log(response);
      
      // const reviews: string[] = [
      //   "I absolutely love the new update! The interface is much cleaner and more intuitive."
      // ];

      const reviews = await fn("1758192964222988506");
      

      
      let count = 0; 
       // Assuming response contains review data from Instagram
      // Proceed with processing the reviews...
      // For each review, create a ticket in DevRev.
      for (const review of reviews.replies) {
        if(count >= 10) break;
        
        // Post a progress message saying creating ticket for review with review URL posted.
        postResp = await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, `Creating ticket for review: ${review.text}`, 1);
        console.log(postResp);
        
        if (!postResp.success) {
          console.error(`Error while creating timeline entry: ${postResp.message}`);
          continue;
        }
        const reviewText = `Ticket created from Twitter review ${review.tweet_id}\n\n${review.expanded_url}`;
        const reviewTitle = `Ticket created from Twitter review ${review.tweet_id}`;
        const reviewID = "review.pk";

    
    const llmResponse = await performAnalysis(review.text)
  console.log("LLMResponse",llmResponse);
  const sentimentReason = JSON.parse(llmResponse.sentimentAnalysis).reason;
const entityReason = JSON.parse(llmResponse.entityTagging).reason;
const intentReason = JSON.parse(llmResponse.intentClassification).reason;
const ticketDescription: string = `
📌 Ticket Summary: \n
➡️ Twitter ID: ${review.tweet_id}
🔗 Link Text: ${review.expanded_url}

${review.text}

📝 Sentiment Analysis:${sentimentReason}

📋 Category Tagging: ${entityReason} \n
🧠 Intent Classification: ${intentReason}

🔍 Further investigation and follow-up may be needed to address the user's needs and improve user experience.

`;
  
  const parsedData = JSON.parse(llmResponse.entityTagging);

// Get category
const category = parsedData.category;
  const entityTaggingCategories = category;
  console.log("Tag",entityTaggingCategories);
  
  // const entityTaggingCategories = llmResponse.entityTagging.entities.reduce((categories: Categories, entity: any) => {
  //   categories[entity.category.entity] = entity.category.type;
  //   return categories;
  // }, {});
  const categories: string[] = [];

for (const key in llmResponse) {
  if (Object.prototype.hasOwnProperty.call(llmResponse, key)) {
    const categoryJson = JSON.parse(llmResponse[key]);
    categories.push(categoryJson.category);
  }
}

console.log(categories);
let tagsToApply = [];
for (const tagObject of tags) {
  for (const key in tagObject) {
    if (tagObject.hasOwnProperty(key) && categories.includes(key)) {
      const id = tagObject[key];
      tagsToApply.push(id);
    }
  }
}



  


  

  const config: AxiosRequestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.devrev.ai/works.create',
    headers: { 
      'Authorization': 'eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHBzOi8vYXV0aC10b2tlbi5kZXZyZXYuYWkvIiwia2lkIjoic3RzX2tpZF9yc2EiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsiamFudXMiXSwiYXpwIjoiZG9uOmlkZW50aXR5OmR2cnYtdXMtMTpkZXZvLzFsMFRyYlpGdHQ6ZGV2dS8xIiwiZXhwIjoxODAyMTcwNzI0LCJodHRwOi8vZGV2cmV2LmFpL2F1dGgwX3VpZCI6ImRvbjppZGVudGl0eTpkdnJ2LXVzLTE6ZGV2by9zdXBlcjphdXRoMF91c2VyL2xpbmtlZGlufGU1ZXpxX3FVQ1IiLCJodHRwOi8vZGV2cmV2LmFpL2F1dGgwX3VzZXJfaWQiOiJsaW5rZWRpbnxlNWV6cV9xVUNSIiwiaHR0cDovL2RldnJldi5haS9kZXZvX2RvbiI6ImRvbjppZGVudGl0eTpkdnJ2LXVzLTE6ZGV2by8xbDBUcmJaRnR0IiwiaHR0cDovL2RldnJldi5haS9kZXZvaWQiOiJERVYtMWwwVHJiWkZ0dCIsImh0dHA6Ly9kZXZyZXYuYWkvZGV2dWlkIjoiREVWVS0xIiwiaHR0cDovL2RldnJldi5haS9kaXNwbGF5bmFtZSI6ImFiaGlzaGVrazA5ODI3IiwiaHR0cDovL2RldnJldi5haS9lbWFpbCI6ImFiaGlzaGVrazA5ODI3QGdtYWlsLmNvbSIsImh0dHA6Ly9kZXZyZXYuYWkvZnVsbG5hbWUiOiJBYmhpc2hlayBLYXVzaGlrIiwiaHR0cDovL2RldnJldi5haS9pc192ZXJpZmllZCI6dHJ1ZSwiaHR0cDovL2RldnJldi5haS90b2tlbnR5cGUiOiJ1cm46ZGV2cmV2OnBhcmFtczpvYXV0aDp0b2tlbi10eXBlOnBhdCIsImlhdCI6MTcwNzU2MjcyNCwiaXNzIjoiaHR0cHM6Ly9hdXRoLXRva2VuLmRldnJldi5haS8iLCJqdGkiOiJkb246aWRlbnRpdHk6ZHZydi11cy0xOmRldm8vMWwwVHJiWkZ0dDp0b2tlbi8xa0JOajB6OCIsIm9yZ19pZCI6Im9yZ19JTTBiYlFTdWJhVEcwZzFNIiwic3ViIjoiZG9uOmlkZW50aXR5OmR2cnYtdXMtMTpkZXZvLzFsMFRyYlpGdHQ6ZGV2dS8xIn0.RIN5euf91TsoKySuvUybS-sf0SXiRNje10LjxOqE3wL2mMCePhAlajwsfptg5MDVud4kTovqU7CIL2E92kzPDu7PaEqhe6YkjdJ2nm90vgOacH489E7gZmSUALSpMqaTHtxjRckfjAjt60PzyxGBFt3ya-Y-q9jxkpZtxlHiBmCc5DtwYbqqCYJ098YPbuGtUQ2oXW4fbh66DaiYkp_26WaQR5bvzeMoDK0JHKnu2kLuh8lpFiXUVHOd0e9BzKmYlwtSFRiGl_A5_QoYyyOTkWx9NWxPIP0pxS8TUvhcOFdRNgNhn6mN7JNIqhchHikqjUUeivQEfpRS0nhr7XzW6w'
    },
    data: {
      "body": ticketDescription,
      "title": reviewTitle,
      "type": "ticket",
      "applies_to_part": "ENH-1",
      "owned_by": [
          "DEVU-1"
      ],
      "severity": "high",
      "tags": tagsToApply
  }
  };
  
  async function fetchData() {
    try {
      const response = await axios(config);
      console.log(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  }
  const createTicketResp = await fetchData()
  


    // Create a ticket with title as review title and description as review text.
    // const createTicketResp = await apiUtil.createTicket({
    //   title: reviewTitle,
    //   body: review,
    //   tags: entityTaggingCategories,
    //   type: publicSDK.WorkType.Ticket,
    //   owned_by: ["DEVU-5"],
    //   applies_to_part: "ENH-9",
    // });
    // console.log("response",createTicketResp);
    
    
    // if (!createTicketResp.success) {
    //   console.error(`Error while creating ticket: ${createTicketResp.message}`);
    //   continue;
    // }
  
    // Post a message with ticket ID.
    // const ticketID = createTicketResp.data;
    const ticketCreatedMessage = `Created ticket and it is categorized as ${entityTaggingCategories}`;
    const postTicketResp: HTTPResponse  = await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, ticketCreatedMessage, 1);
    console.log(2);
    
    if (!postTicketResp.success) {
      console.error(`Error while creating timeline entry: ${postTicketResp.message}`);
      continue;
    }
    count++ ;
        // Proceed with creating tickets and other operations...
      }
    }
  
 
};

export default run;