import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    
    const {videoId} = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video ID")
    }

    const isVideo = await Video.findById(videoId)
    if(!isVideo){
        throw new ApiError(400,"Video not available")
    }

    const {page = 1, limit = 10} = req.query
    const comments = await Comment
    .find({video:videoId})
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

    if(!comments){
        throw new ApiError(500,"Something went wrong while fetching Comments")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comments,
            "Successfully fetched comments"
        )
    )

})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video ID")
    }

    const isVideo = await Video.findById(videoId)
    if(!isVideo){
        throw new ApiError(400,"Video not available")
    }

    const {content} = req.body;

    if(content.trim().length<1){
        throw new ApiError(400,"Content required")
    }

    const createdComment = await Comment.create({
        content,
        video:videoId,
        owner:req.user?._id
    })

    if(!createdComment){
        throw new ApiError(500,"Something went wrong while uploading comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createdComment,
            "Successfully created comment"
        )
    )
    

})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment ID")
    }

    const isComment = await Comment.findById(commentId)
    if(!isComment){
        throw new ApiError(400,"Comment not available")
    }

    const {content} = req.body;

    if(content.trim().length<1){
        throw new ApiError(400,"Content required")
    }

    const comment =await Comment.findByIdAndUpdate(commentId,{content})
    if(!comment){
        throw new ApiError(500,"Something went wrong while updating comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comment,
            "Comment updated Successfully"
        )
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment ID")
    }

    const isComment = await Comment.findById(commentId)
    if(!isComment){
        throw new ApiError(400,"Comment not available")
    }


    const comment =await Comment.findByIdAndDelete(commentId)
    if(!comment){
        throw new ApiError(500,"Something went wrong while deleting comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            comment,
            "Successfully deleted comment"
        )
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }