import { Router } from "express";

// controller
import {
  addVideoToUserHistory,
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getUserHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  removeVideoFromUserHistory,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller";

// middlewares
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

// secured Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getUserHistory);
router.post("/add-history", verifyJWT, addVideoToUserHistory);
router.delete("/remove-history", verifyJWT, removeVideoFromUserHistory);

export const userRouter = router;
