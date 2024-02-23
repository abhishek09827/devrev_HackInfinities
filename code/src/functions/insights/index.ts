import { processReviews } from '../on_work_creation/llm_utils';
import {fetchData, ticket, fetchReviews} from '../on_ticket_extracts/extractTicket';

export async function run(events: any[]) {
    let tags: string = "";
    for (const event of events) {
        let tags: string = event.payload.parameters.trim();
      }
    const token = "eyJhbGciOiJSUzI1NiIsImlzcyI6Imh0dHBzOi8vYXV0aC10b2tlbi5kZXZyZXYuYWkvIiwia2lkIjoic3RzX2tpZF9yc2EiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOlsiamFudXMiXSwiYXpwIjoiZG9uOmlkZW50aXR5OmR2cnYtdXMtMTpkZXZvLzFsMFRyYlpGdHQ6ZGV2dS8xIiwiZXhwIjoxODAyMTcwNzI0LCJodHRwOi8vZGV2cmV2LmFpL2F1dGgwX3VpZCI6ImRvbjppZGVudGl0eTpkdnJ2LXVzLTE6ZGV2by9zdXBlcjphdXRoMF91c2VyL2xpbmtlZGlufGU1ZXpxX3FVQ1IiLCJodHRwOi8vZGV2cmV2LmFpL2F1dGgwX3VzZXJfaWQiOiJsaW5rZWRpbnxlNWV6cV9xVUNSIiwiaHR0cDovL2RldnJldi5haS9kZXZvX2RvbiI6ImRvbjppZGVudGl0eTpkdnJ2LXVzLTE6ZGV2by8xbDBUcmJaRnR0IiwiaHR0cDovL2RldnJldi5haS9kZXZvaWQiOiJERVYtMWwwVHJiWkZ0dCIsImh0dHA6Ly9kZXZyZXYuYWkvZGV2dWlkIjoiREVWVS0xIiwiaHR0cDovL2RldnJldi5haS9kaXNwbGF5bmFtZSI6ImFiaGlzaGVrazA5ODI3IiwiaHR0cDovL2RldnJldi5haS9lbWFpbCI6ImFiaGlzaGVrazA5ODI3QGdtYWlsLmNvbSIsImh0dHA6Ly9kZXZyZXYuYWkvZnVsbG5hbWUiOiJBYmhpc2hlayBLYXVzaGlrIiwiaHR0cDovL2RldnJldi5haS9pc192ZXJpZmllZCI6dHJ1ZSwiaHR0cDovL2RldnJldi5haS90b2tlbnR5cGUiOiJ1cm46ZGV2cmV2OnBhcmFtczpvYXV0aDp0b2tlbi10eXBlOnBhdCIsImlhdCI6MTcwNzU2MjcyNCwiaXNzIjoiaHR0cHM6Ly9hdXRoLXRva2VuLmRldnJldi5haS8iLCJqdGkiOiJkb246aWRlbnRpdHk6ZHZydi11cy0xOmRldm8vMWwwVHJiWkZ0dDp0b2tlbi8xa0JOajB6OCIsIm9yZ19pZCI6Im9yZ19JTTBiYlFTdWJhVEcwZzFNIiwic3ViIjoiZG9uOmlkZW50aXR5OmR2cnYtdXMtMTpkZXZvLzFsMFRyYlpGdHQ6ZGV2dS8xIn0.RIN5euf91TsoKySuvUybS-sf0SXiRNje10LjxOqE3wL2mMCePhAlajwsfptg5MDVud4kTovqU7CIL2E92kzPDu7PaEqhe6YkjdJ2nm90vgOacH489E7gZmSUALSpMqaTHtxjRckfjAjt60PzyxGBFt3ya-Y-q9jxkpZtxlHiBmCc5DtwYbqqCYJ098YPbuGtUQ2oXW4fbh66DaiYkp_26WaQR5bvzeMoDK0JHKnu2kLuh8lpFiXUVHOd0e9BzKmYlwtSFRiGl_A5_QoYyyOTkWx9NWxPIP0pxS8TUvhcOFdRNgNhn6mN7JNIqhchHikqjUUeivQEfpRS0nhr7XzW6w";
    const snap_in_id= "don:integration:dvrv-us-1:devo/1l0TrbZFtt:snap_in/7d6bbcdd-8fca-4bf5-9ef2-abfdddb19bd5";
    console.log("Creating snap kit to render fetched gif");
    
    const url = "https://api.devrev.ai/timeline-entries.create";
    const review = await fetchReviews(tags)
    
    
    const llmResponse: any = await processReviews(review)
    console.log("LLMResponse",llmResponse.insights);
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
          body: "LLM Response",
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
                          text: llmResponse.insights,
                          type: "plain_text",
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

export default run;