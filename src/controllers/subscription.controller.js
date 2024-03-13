import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid ChannelId")
    }

    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiResponse(400,"Channel not found")
    }
    const currentUser = req.user;
    //check if user already subscribed
    //if subscribed delete that subscription object
    //else create a new subscription object

    let subscribed = await Subscription.find({subscriber:currentUser._id,channel:channelId})
    if(subscribed.length>=1){
        const unsubscribed = await Subscription.findByIdAndDelete(subscribed[0]._id);
        if(!unsubscribed){
            throw new ApiError(500,"Something went wrong while unsubscribing")
        }
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                unsubscribed,
                "unsubscribed successfully"
            )
        )

    }
    else{
        console.log("Not Subscribed")
        const subscription = await Subscription.create({
            subscriber:currentUser,
            channel
        })

        subscribed = await Subscription.findById(subscription._id);

        if(!subscribed){
            throw new ApiError(500,"Something went wrong while subscribing channel")
        }

    }

    

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribed,
            "subscribed successfully"
        )
    )


})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;

    
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid ChannelId")
    }

    const subscribers = await Subscription.find({channel:channelId});

    if(!subscribers){
        throw new ApiError(500,"Error while fetching subscribers")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribers,
            "Subscribers fetched successfully"
        )
    )

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid ChannelId")
    }

    const subscribers = await Subscription.find({subscriber:subscriberId});

    if(!subscribers){
        throw new ApiError(500,"Error while fetching subscribeed to")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscribers,
            "Subscribed channels fetched successfully"
        )
    )

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}