import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';

const registerUser = asyncHandler(
    async (req, res) => {
        // get user details from frontend
        //validation - not empty
        //check if user already exists: username, email
        //check for images,avatar
        //upload them to cloudinary
        //create user object - create entry in db
        //remove password and refresh token field from response
        //check for user creation
        // return response

        const {fullName, email, username, password} = req.body
        console.log(fullName, email, username, password);

        if([fullName, email, username, password].some((field) => field?.trim() === "")){
            throw new ApiError(400, "All fields are required")
        }

        const existedUser = User.findOne({
            $or:[{username}, {email}]
        })
        if(existedUser){
            throw new ApiError(409, "User with same username or email already exists")
        }


    }
)

export {registerUser}