import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body;

    if(content.trim().length<1){
        throw new ApiError(400,"Content required")
    }

    const createdTweet = await Tweet.create({
        content,
        owner:req.user?._id
    })

    if(!createTweet){
        throw new ApiError(500,"Something went wrong while tweeting ")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createdTweet,
            "Tweeted Successfully"
        )
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params;

    const tweets = await Tweet.find({owner:userId})
    if(!tweets){
        throw new ApiError(500,"Something went wrong while fetching tweets")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweets,
            "Tweets fetched successfully"
        )
    )

})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;

    const {content} =req.body;

    if(content.trim().length<1){
        throw new ApiError(400,"Content required")
    }

    const tweet = await Tweet.findByIdAndUpdate(tweetId,{content})

    if(!tweet){
        throw new ApiError(500,"Something went wrong while updating tweet or tweet not present")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweet,
            "Tweet updated Successfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Tweet not found")
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId)

    if(!tweet){
        throw new ApiError(500,"Something went wrong while deleting tweet or tweet not present")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweet,
            "Tweet deleted Successfully"
        )
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}