import {ContainerModule} from "inversify";
import {TagRepository} from "./tag.repository.js";
import {Tag_Types} from "../../utils/types/injection_types.js";
import {TagModel} from "./tag.model.js";
import {TagService} from "./tag.service.js";

export const tagContainer = new ContainerModule(bind=>{
    bind<TagRepository>(Tag_Types.TagRepository).toConstantValue(new TagRepository(TagModel));
    bind<TagService>(Tag_Types.TagService).to(TagService).inSingletonScope();



})