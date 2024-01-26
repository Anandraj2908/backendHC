import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    
    if([name,description].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const existedPlaylist = await Playlist.findOne({name})
    if(existedPlaylist){
        throw new ApiError(409, "Playlist with same name already exists");
    }

    const createdPlaylist =await Playlist.create({
        name,
        description,
        owner:req.user?._id
    });

    if(!createdPlaylist){
        throw new ApiError(500,"Something went wrong while creating playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createdPlaylist,
            "Playlist created successfully"
        )
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    
    if(!isValidObjectId(userId)){
        throw new ApiError(400," User does not exists")
    }

    const playlists = await Playlist.find({owner:userId})

    if(!playlists){
        throw new ApiError(500,"Error while fetching playlists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlists,
            "Playlists fetched successfully"
        )
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400," Playlist does not exists")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(500,"Error while fetching playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlist,
            "Playlists fetched successfully"
        )
    )

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId) ){
        throw new ApiError(400," Invalid Playlist")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video")
    }

    const playlist = await Playlist.findOne({_id:playlistId})
    if(!playlist){
        throw new ApiError(400,"Playlist not found")
    }
    const videoIndex = playlist.videos.indexOf(videoId);
    let updatedPlaylist;
    if(videoIndex == -1){
        updatedPlaylist = await Playlist.updateOne({_id:playlistId},{$push: {videos:videoId}});
        if(!updatedPlaylist){
            throw new ApiError(500,"Error while adding video to the playlist")
        }
    }
    else{
        throw new ApiError(400,"Video already present in the playlist")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Video added succesfully"
        )
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    if(!isValidObjectId(playlistId) ){
        throw new ApiError(400," Invalid Playlist")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video")
    }

    const playlist = await Playlist.findOne({_id:playlistId})
    if(!playlist){
        throw new ApiError(400,"Playlist not found")
    }
    const videoIndex = playlist.videos.indexOf(videoId);
    let updatedPlaylist;
    if(videoIndex == -1){
        throw new ApiError(400,"Video not present in the playlist")
    }
    else{
        updatedPlaylist = await Playlist.updateOne({_id:playlistId},{$pull: {videos:videoId}});
        if(!updatedPlaylist){
            throw new ApiError(500,"Error while adding video to the playlist")
        }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Video removed succesfully"
        )
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400," Playlist does not exists")
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if(!playlist){
        throw new ApiError(500,"Error while deleting playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlist,
            "Playlists deleted successfully"
        )
    )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist")
    }

    if([name,description].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
        name,
        description
    })

    if(!updatedPlaylist){
        throw new ApiError(500,"Something went wrong while updating playlist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Playlist updated Successfully"
        )
    )

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}