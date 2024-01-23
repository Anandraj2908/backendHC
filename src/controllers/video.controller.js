import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose, {isValidObjectId} from "mongoose";
import {User} from '../models/user.model.js'
import {Video} from '../models/video.model.js'


const publishAVideo = asyncHandler(async (req,res) => {
    //receive data from frontend
    const {title, description} = req.body;

    //validate data
    if([title,description].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    //receive thumbnail from req.files
    const videoFileLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(401, "video file is required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(401, "thumbnail file is required")
    }
    
    //upload video and thumbnail to cloudinary
    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if (!videoFile) {
        throw new ApiError(500, "error while uploading video file")
    }
    if (!thumbnail) {
        throw new ApiError(500, "error while uploading thumbnail file")
    }


   // create a video document 
   const video = await Video.create({
        title,
        description,
        videoFile: videoFile?.url || "",
        thumbnail: thumbnail?.url || "",
        duration: videoFile.duration,
        owner: req.user?._id,
        isPublished: true
    })

    const createdVideo = await Video.findById(video._id)

    if(!createdVideo){
        throw new ApiError(401, "Something wrong while Adding a video")
    }
    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            createdVideo,
            "Video uploaded successfully"
        )
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    const videoDetails = await Video.findById(videoId)

    if(!videoDetails){
        throw new ApiError("Video not available")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videoDetails,
            "Video fetched successfully"
        )
    )
})

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    
    if(userId){
        if(!isValidObjectId(userId)){
            throw new ApiError(400, "Invalid User ID")
        }
    }

    const baseQuery = userId ? { owner: userId } : {};

    if (query) {
        baseQuery.title = { $regex: new RegExp(query, 'i') };
        baseQuery.isPublished = true
    }

    const sort = sortBy ? { [sortBy]: sortType === 'desc' ? -1 : 1 } : {};

    const videos = await Video
        .find(baseQuery)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

    if(!videos){
        throw new ApiError(500, "Error while fetching videos")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videos,
            "Videos fetched successfully"
        )
    )
})

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    const {title,description} = req.body;

    if(!title || !description){
        throw new ApiError(400, "All fields are required")
    }

    const thumbnailLocalPath = req.file?.path
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail file is missing")
    }
    
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if(!thumbnail.url){
        throw new ApiError(500, "Error while updating thumbnail")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                thumbnail:thumbnail.url,
                title,
                description,

            }
        },
        {new:true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedVideo, "Video details updated successfully")
    )

})

const updateVideo =asyncHandler(async (req,res)=> {
    const { videoId } = req.params

    const videoFileLocalPath = req.file?.path
    if(!videoFileLocalPath){
        throw new ApiError(400, "Video file is missing")
    }
    
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);

    if(!videoFile.url){
        throw new ApiError(500, "Error while updating video file")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                videoFile:videoFile.url
            }
        },
        {new:true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    const video = await Video.findByIdAndDelete(
        videoId
    )

    if(!video){
        throw new ApiError(500," Error while deleting video")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "Video deleted successfully"
        )
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid videoId ID")
    }
    const videoDetails = await Video.findById(
        videoId
    )
    
    if(!videoDetails){
        throw new ApiError(400, "Video not found")
    }
    const publishedStatus = videoDetails.isPublished;
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{ isPublished :!publishedStatus }
        },
        {
            new:true
        }
        )

    

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "Video fetched successfully"
        )
    )
})

export {
    publishAVideo,
    getVideoById,
    getAllVideos,
    updateVideo,
    updateVideoDetails,
    deleteVideo,
    togglePublishStatus
}