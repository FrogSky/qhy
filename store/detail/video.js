import getCreateStore from '~/store/get-create-store';
import video from '~/store-modules/detail/video';
import teacher from '~/store-modules/detail/video/teacher';

export default getCreateStore({
  video,
  teacher
})