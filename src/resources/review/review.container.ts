import {ContainerModule} from "inversify";
import {ReviewService} from "./review.service.js";
import {ReviewRepository} from "./review.repository.js";
import  "./review.controller.js";
import {ReviewModel} from "./review.model.js";
import {Notification_TYPES, Review_TYPES as TYPES, Tag_Types, User_TYPES} from "../../utils/types/injection_types.js";

const reviewContainer = new ContainerModule(bind => {
    bind<ReviewRepository>(TYPES.ReviewRepository).toConstantValue(new ReviewRepository(ReviewModel));
    bind<ReviewService>(TYPES.ReviewService).to(ReviewService).inSingletonScope()
})
export {reviewContainer}
