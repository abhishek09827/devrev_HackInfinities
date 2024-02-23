// index.ts

import dotenv from "dotenv";
dotenv.config();

import {
  StringOutputParser,
  JsonOutputParser,
} from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  ChatPromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

import { ChatFireworks } from "@langchain/community/chat_models/fireworks";

const model = new ChatFireworks({
  modelName: "accounts/fireworks/models/mixtral-8x7b-instruct",
  temperature: 0.9,

  fireworksApiKey: process.env.FIREBASE_API_KEY,
});

const sentisysPrompt = `You are sentiment analysis expert who can assign sentiment tags to user reviews.Analyze the sentiment of the following review: "{{text}}". You have to label the review as positive, negative or neutral. The output should be a JSON with fields "category" and "reason". The "category" field should be one of "positive", "negative", "neutral". The "reason" field should be a string explaining the reason for the category. \n\nReview: {text}\n\nOutput:`;
const humanPrompt = ``;

const sentichatPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(sentisysPrompt),
  HumanMessagePromptTemplate.fromTemplate(humanPrompt),
]);

const sentimentAnalysisChain = RunnableSequence.from([
  sentichatPrompt,
  model,
  new StringOutputParser(),
]);

const entityTaggingPromptContent = `You are an expert at labelling a given Instagram Review as bug, feature_request, question or feedback. You are given a review provided by a user for the app ${"Instagram"}. You have to label the review as bug, feature_request, question or feedback. The output should be a JSON with fields "category" and "reason". The "category" field should be one of "bug", "feature_request", "question" or "feedback". The "reason" field should be a string explaining the reason for the category. \n\nReview: {text}\n\nOutput:`;

const entityTaggingChatPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(entityTaggingPromptContent),
  HumanMessagePromptTemplate.fromTemplate(""), // Assuming a similar one-way interaction
]);

const entityTaggingChain = RunnableSequence.from([
  entityTaggingChatPrompt,
  model,
  new StringOutputParser(),
]);

const intentClassificationPromptContent = `You are an intent classification expert. Classify the intent of the following text: "{text}" into urgent, low and medium category label. The output should be a JSON with fields "category" and "reason". The "category" field should include the intent. The "reason" field should be a string explaining the reason for the category. \n\nReview: {text}\n\nOutput`;

const intentClassificationChatPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(intentClassificationPromptContent),
  HumanMessagePromptTemplate.fromTemplate(""),
]);

const intentClassificationChain = RunnableSequence.from([
  intentClassificationChatPrompt,
  model,
  new StringOutputParser(),
]);

async function performAnalysis(text: string) {
  try {
    const [sentimentResult, entityTaggingResult, intentClassificationResult] =
      await Promise.all([
        sentimentAnalysisChain.invoke({ text: text }),
        entityTaggingChain.invoke({ text: text }),
        intentClassificationChain.invoke({ text: text }),
      ]);

    const combinedResult: any = {
      sentimentAnalysis: sentimentResult,
      entityTagging: entityTaggingResult,
      intentClassification: intentClassificationResult,
    };

    return combinedResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    return error;
  }
}

// Example
// performAnalysis("The Ui should be black. I dont like it");

// Array of reviews functions
async function processReviews(reviews: string[]) {
  try {
    // Step 1: Summarize Reviews
    const review = reviews.join(" ");

    // Step 3: Generate Insights
    const insightsPrompt = PromptTemplate.fromTemplate(
      `Based on the following user reviews: {review}, generate actionable insights in brief and avoid any duplication.`
    );
    const ichain = insightsPrompt.pipe(model);
    const insights = (await ichain.invoke({ review: review })).content;

    // JSON object
    const combinedResults = {
      insights: insights,
    };


    return combinedResults; // Return or further process the combined results as needed
  } catch (error) {
    console.error("Error processing reviews:", error);
    return error;
  }
}

async function trendsReview(reviews: string[]) {
  try {
    // Step 1: Summarize Reviews
    const review = reviews.join(" ");
    // Step 2: Analyze Trends
    const trendsPrompt = PromptTemplate.fromTemplate(
      `Analyze the following array of user reviews for trends: {review}. Please keep it brief and return your answer in a .md format`
    );
    const tchain = trendsPrompt.pipe(model);
    const trends = (await tchain.invoke({ review: review })).content;

    // JSON object
    const combinedResults = {
      trends: trends,
    };


    return combinedResults; // Return or further process the combined results as needed
  } catch (error) {
    console.error("Error processing reviews:", error);
    return error;
  }
}


async function summaryReview(reviews: string) {
  try {
    
    // Step 2: Analyze Trends
    const trendsPrompt = PromptTemplate.fromTemplate(
      `Summarize the following text: {reviews}. Please keep it brief and return your answer in a .md format (Markdown Format)`
    );
    const tchain = trendsPrompt.pipe(model);
    const summary = (await tchain.invoke({ reviews: reviews })).content;

    // JSON object
    const combinedResults = {
     summary,
    };


    return combinedResults; // Return or further process the combined results as needed
  } catch (error) {
    console.error("Error processing reviews:", error);
    return error;
  }
}

const reviews: string[] = [
  "I absolutely love the new update! The interface is much cleaner and more intuitive.",
  "Unfortunately, the app crashes frequently on my device since the last update. I hope this gets fixed soon.",
  "The customer service team was incredibly helpful and resolved my issue in no time. Highly recommend!",
  "I'm not a fan of the new layout. It feels cluttered and less efficient than before.",
  "Fantastic app! It has become an essential tool for my daily activities.",
  "The recent changes have made the app much slower. It's frustrating to use now.",
  "I appreciate the addition of new features, but it has become too complicated. Simplicity was your strength!",
  "Great job on the eco-friendly packaging for your products! It's great to see companies taking responsibility.",
  "The subscription model is not for me. I miss the one-time purchase option.",
  "Impressed by the battery life improvement in the latest device. It lasts all day with heavy use.",
  "The app's tutorial is very helpful for beginners. I felt guided through every step.",
  "Not happy with the price increase. I understand costs go up, but this is too much.",
  "The new camera feature is a game-changer. It takes amazing photos even in low light conditions.",
  "I've experienced several bugs while using the app. It disrupts the user experience.",
  "The community feature is a great addition. It's nice to connect with others who use the app.",
];
performAnalysis(reviews[0])
export {processReviews,performAnalysis, trendsReview, summaryReview}