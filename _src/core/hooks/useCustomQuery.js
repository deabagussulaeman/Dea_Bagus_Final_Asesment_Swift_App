import {useEffect, useState, useRef} from 'react';
import {useApolloClient} from '@apollo/client';
import ErrorHandler from '@app/helpers/ErrorHandler';

const useCustomQuery = ({
  schema,
  isDynamicQuery = false,
  isDynamicVariables = false,
  useInitData = false,
  variables = null,
  opts = null,
  configErr = null,
}) => {
  /**
   * ---------------------------------------------------- *
   * @var {hooks}
   * @params {loading} if not use init data default: false
   * if use init data default: true
   * ---------------------------------------------------- *
   */
  const client = useApolloClient();
  const mount = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(useInitData);
  const [error, setError] = useState(null);
  const [dynamicSchemas, setDynamicSchemas] = useState(null);
  const [dynamicVariables, setDynamicVariables] = useState(null);

  /**
   * ---------------------------------------------------- *
   * @dependency []
   * @summary {lifecycle}
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    mount.current = true;
    if (mount.current && useInitData) {
      onRefetchData({params: variables});
    }
    return () => (mount.current = false);
  }, []);

  useEffect(() => {
    if (mount.current && isDynamicQuery) {
      if (dynamicSchemas !== null) {
        isDynamicVariables && dynamicVariables
          ? onRefetchData({params: dynamicVariables})
          : onRefetchData({params: null});
      }
    }
  }, [dynamicSchemas, dynamicVariables]);

  /**
   * ---------------------------------------------------- *
   * @function {onRefetchData}
   * @summary function use for get data
   * ---------------------------------------------------- *
   */
  const onRefetchData = async ({
    params = null,
    paramsOpt = null,
    otherOpt = null,
  }) => {
    if (dynamicSchemas || schema) {
      try {
        setLoading(true);
        let config = {query: isDynamicQuery ? dynamicSchemas : schema};
        if (params !== null) {
          config.variables = params;
        }
        if (opts !== null) {
          config = {...config, ...opts};
        }
        if (otherOpt !== null) {
          config = {...config, ...otherOpt};
        }
        const res = await client.query(config);
        if (mount.current) {
          setLoading(false);
          if (!paramsOpt?.isReturn) {
            setData(res);
          } else {
            return res;
          }
        }
      } catch (err) {
        if (mount.current) {
          const ERROR = new ErrorHandler({
            err,
            configErr,
            source: 'useCustomQuery',
          });
          ERROR.initHandleError();
          setLoading(false);
          if (!paramsOpt?.isReturn) {
            setError(err);
          } else {
            return err;
          }
        }
      }
    }
  };

  /**
   * ---------------------------------------------------- *
   * @returns {object}
   * @summary hooks returning needed object
   * ---------------------------------------------------- *
   */
  return {
    loading,
    data,
    error,
    dynamicVariables,
    onRefetchData,
    setDynamicSchemas,
    setDynamicVariables,
  };
};

export default useCustomQuery;
