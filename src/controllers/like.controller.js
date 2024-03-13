import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import {Tweet} from "../models/tweet.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoID")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400,"Video not found")
    }
    const {userId} = req.user?._id;

    let like;
    const likes =await Like.find({likedBy:userId,video:videoId})
    if(!likes){
        throw new ApiError(500,"Something went wrong while fetching lilked video")
    }

    if(likes.length<1){
        like =await Like.create({video:videoId,likedBy:userId})
        if(!like){
            throw new ApiError(500,"Something went wrong while registering like")
        }
    }
    else{
        like=await Like.findByIdAndDelete(likes[0]._id);
        if(!like){
            throw new ApiError(500,"Something went wrong while unregistering like")
        }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            like,
            "Successfully togelled Like"
        )
    )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid commentId")
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400,"comment not found")
    }
    const {userId} = req.user?._id;

    let like;
    const likes =await Like.find({likedBy:userId,comment:commentId})
    if(!likes){
        throw new ApiError(500,"Something went wrong while fetching lilked comment")
    }

    if(likes.length<1){
        like =await Like.create({comment:commentId,likedBy:userId})
        if(!like){
            throw new ApiError(500,"Something went wrong while registering like")
        }
    }
    else{
        like=await Like.findByIdAndDelete(likes[0]._id);
        if(!like){
            throw new ApiError(500,"Something went wrong while unregistering like")
        }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            like,
            "Successfully togelled Like"
        )
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweetId")
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(400,"tweet not found")
    }
    const {userId} = req.user?._id;

    let like;
    const likes =await Like.find({likedBy:userId,tweet:tweetId})
    if(!likes){
        throw new ApiError(500,"Something went wrong while fetching lilked tweet")
    }

    if(likes.length<1){
        like =await Like.create({tweet:tweetId,likedBy:userId})
        if(!like){
            throw new ApiError(500,"Something went wrong while registering like")
        }
    }
    else{
        like=await Like.findByIdAndDelete(likes[0]._id);
        if(!like){
            throw new ApiError(500,"Something went wrong while unregistering like")
        }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            like,
            "Successfully togelled Like"
        )
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const {userId} = req.user?._id;

    const videos = await Like.find({ likedBy: userId, "video": { $exists: true } })
    if(!videos){
        throw new ApiError(500,"Something went wrong while fetching lilked videos")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videos,
            "Successfully togelled Like"
        )
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}