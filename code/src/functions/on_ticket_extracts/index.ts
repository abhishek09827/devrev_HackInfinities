import { fetchReviews, ticket } from './extractTicket';
import { ApiUtils, HTTPResponse } from '../on_work_creation/utils';
import { processReviews } from 'functions/on_work_creation/llm_utils';
export const run = async (events: any[]) => {
    for (const event of events) {
    const endpoint: string = event.execution_metadata.devrev_endpoint;
    const token: string = event.context.secrets.service_account_token;
    const apiUtil: ApiUtils = new ApiUtils(endpoint, token);
    const snapInId = event.context.snap_in_id;
    const tickets = await ticket("Instagram");
    let postResp: HTTPResponse = await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, "Extracting tickets", 1);
    console.log(postResp);
    if (!postResp.success) {
      console.error(`Error while creating timeline entry: ${postResp.message}`);
      continue;
 ;[] 
}


   const snap_in_id= "don:integration:dvrv-us-1:devo/1l0TrbZFtt:snap_in/7d6bbcdd-8fca-4bf5-9ef2-abfdddb19bd5";
    console.log("Creating snap kit to render fetched gif");
    
    const url = "https://api.devrev.ai/timeline-entries.create";
    const review = await fetchReviews("low")
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          authorization: token,
          "content-type": "application/json",
          accept: "application/json, text/plain, /",
        },
        body: JSON.stringify({
          object: "don:core:dvrv-us-1:devo/1l0TrbZFtt:ticket/3045",
          body: "Giphy",
          type: "timeline_comment",
          snap_kit_body: {
            snap_in_id: snap_in_id,
            snap_in_action_name: "giphy",
            body: {
              snaps: [
                {
                  type: "card",
                  title: {
                    text: "LLM Response!",
                    type: "plain_text",
                  },
                  elements: [
                    {
                      elements: [
                        {
                          text: tickets,
                          type: "rich_text",
                        },
                      ],
                      type: "content",
                    },
                    {
                      direction: "row",
                      justify: "center",
                      type: "actions",
                      elements: [
                        {
                          action_id: "send",
                          action_type: "remote",
                          style: "primary",
                          type: "button",
                          value: "send",
                          text: {
                            text: "Send",
                            type: "plain_text",
                          },
                        },
                        {
                          action_id: "shuffle",
                          action_type: "remote",
                          style: "primary",
                          type: "button",
                          value: "shuffle",
                          text: {
                            text: "Shuffle",
                            type: "plain_text",
                          },
                        },
                        {
                          action_id: "cancel",
                          action_type: "remote",
                          style: "danger",
                          type: "button",
                          value: "cancel",
                          text: {
                            text: "Cancel",
                            type: "plain_text",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        }),
      });
      console.log(resp);
      
  
      if (resp.ok) {
        console.log("Giphy snap kit created successfully");
      } else {
        let body = await resp.text();
        console.log("Error while posting to timeline: ", resp.status, body);
      }
    } catch (error) {
      console.log("Failed to post to timeline: ", error);
    }
}

 
}

export default run;