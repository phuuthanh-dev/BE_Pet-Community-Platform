const User = require("../models/user.model.js");
const { StatusCodes } = require('http-status-codes');
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/datauri.js");
const cloudinary = require("../utils/cloudinary.js");
const Post = require("../models/post.model.js");
const { USER_MESSAGE, COMMON_MESSAGE } = require("../constants/messages.js");
const catchAsync = require("../utils/catchAsync.js");
const authService = require("../services/auth.service.js");
const { OK } = require("../configs/response.config.js");
const { ErrorWithStatus } = require("../utils/errorWithStatus.js");
const { getReceiverSocketId, io } = require("../socket/socket.js");

class UserController {
    register = catchAsync(async (req, res) => {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: COMMON_MESSAGE.SOMETHING_IS_MISSING });
        }
        const result = await authService.register(req.body);
        return OK(res, USER_MESSAGE.USER_CREATED_SUCCESSFULLY, result);
    });

    login = catchAsync(async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ErrorWithStatus({ status: StatusCodes.BAD_REQUEST, message: COMMON_MESSAGE.SOMETHING_IS_MISSING });
        }
        const result = await authService.login(req.body);
        return OK(res, USER_MESSAGE.USER_LOGIN_SUCCESSFULLY, result);
    });


    logout = catchAsync(async (req, res) => {
        res.clearCookie('token');
        return OK(res, USER_MESSAGE.USER_LOGOUT_SUCCESSFULLY);
    });


    getProfile = async (req, res) => {
        try {
            const userId = req.params.id;
            let user = await User.findById(userId).populate({ path: 'posts', createdAt: -1 }).populate('bookmarks');
            return res.status(200).json({
                user,
                success: true
            });
        } catch (error) {
            console.log(error);
        }
    };

    editProfile = async (req, res) => {
        try {
            const userId = req.id;
            const { bio, gender } = req.body;
            const profilePicture = req.file;
            let cloudResponse;

            if (profilePicture) {
                const fileUri = getDataUri(profilePicture);
                cloudResponse = await cloudinary.uploader.upload(fileUri);
            }

            const user = await User.findById(userId).select('-password');
            if (!user) {
                return res.status(404).json({
                    message: 'User not found.',
                    success: false
                });
            };
            if (bio) user.bio = bio;
            if (gender) user.gender = gender;
            if (profilePicture) user.profilePicture = cloudResponse.secure_url;

            await user.save();

            return res.status(200).json({
                message: 'Profile updated.',
                success: true,
                user
            });

        } catch (error) {
            console.log(error);
        }
    };
    getSuggestedUsers = async (req, res) => {
        try {
            const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
            if (!suggestedUsers) {
                return res.status(400).json({
                    message: 'Currently do not have any users',
                })
            };
            return res.status(200).json({
                success: true,
                users: suggestedUsers
            })
        } catch (error) {
            console.log(error);
        }
    };
    followOrUnfollow = async (req, res) => {
        try {
            const followKrneWala = req.id; // patel
            const jiskoFollowKrunga = req.params.id; // shivani

            if (followKrneWala === jiskoFollowKrunga) {
                return res.status(400).json({
                    message: 'You cannot follow/unfollow yourself',
                    success: false
                });
            }

            const user = await User.findById(followKrneWala);
            const targetUser = await User.findById(jiskoFollowKrunga);

            if (!user || !targetUser) {
                return res.status(400).json({
                    message: 'User not found',
                    success: false
                });
            }
            // mai check krunga ki follow krna hai ya unfollow
            const isFollowing = user.following.includes(jiskoFollowKrunga);
            if (isFollowing) {
                // unfollow logic ayega
                await Promise.all([
                    User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                    User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
                ])
                const notification = {
                    type: 'follow',
                    userId: followKrneWala,
                    userDetails: user,
                    message: 'You are unfollowed'
                }
                const targetUserSocketId = getReceiverSocketId(jiskoFollowKrunga);
                io.to(targetUserSocketId).emit('notification', notification);
                return res.status(200).json({ message: 'Unfollowed successfully', success: true });
            } else {
                // follow logic ayega
                await Promise.all([
                    User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                    User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
                ])
                return res.status(200).json({ message: 'followed successfully', success: true });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new UserController();