import useUserData from '@app/hooks/useUserData';
import useFirestoreForceUpdate from '@app/hooks/useFirestoreForceUpdate';
import useStoreConfig from './useStoreConfig';
import useRemoteConfig from '@app/hooks/useRemoteConfig';
import {GET_CMS_BLOCK} from '@app/components/RenderHTML/services/schema';
import useCustomQuery from '@app/hooks/useCustomQuery';
import {GLOBAL} from '@root/swift.config';

const useAppInitialize = () => {
  /**
   * ---------------------------------------------------- *
   * @var {hooks}
   * ---------------------------------------------------- *
   */
  const {data: getDataCmsBlock} = useCustomQuery({
    schema: GET_CMS_BLOCK,
    useInitData: true,
    variables: {identifier: GLOBAL.APP_CMS_IDENTIFIER.FORCE_UPDATE},
    configErr: {
      isBypass: true,
    },
  });
  const {loading, updates} = useFirestoreForceUpdate();
  const {loading: loadingUser} = useUserData({useInitData: true});
  useStoreConfig({useInitData: true});
  useRemoteConfig({useInitData: true});

  return {
    updates,
    loading,
    loadingUser,
    content: getDataCmsBlock?.data?.cmsBlocks?.items[0]?.content,
  };
};
export default useAppInitialize;
