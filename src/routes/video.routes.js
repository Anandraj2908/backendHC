import { Router } from "express";
import {
    publishAVideo,
    getVideoById,
    getAllVideos,
    updateVideo,
    updateVideoDetails,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/publishVideo").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {   
            name: "thumbnail",
            maxCount: 1,
        },
        
    ]),
publishAVideo);

router.route("/video-details/:videoId").get(
    getVideoById
);

router.route("/change-published-status/:videoId").patch(
    verifyJWT,
    togglePublishStatus
)

router.route("/delete-video/:videoId").delete(
    verifyJWT,
    deleteVideo
)

router.route("/update-video-details/:videoId").patch(
    verifyJWT,
    upload.single("thumbnail"),
    updateVideoDetails
)

router.route("/update-video/:videoId").patch(
    verifyJWT,
    upload.single("videoFile"),
    updateVideo
)

router.route("/get-videos")
    .get(
        getAllVideos
    )

export default router;