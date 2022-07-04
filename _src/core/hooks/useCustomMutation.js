import {useEffect, useState, useRef} from 'react';
import {useApolloClient} from '@apollo/client';
import ErrorHandler from '@app/helpers/ErrorHandler';

const useCustomMutation = ({
  schema,
  useInitData = false,
  variables = null,
  opts = null,
  configErr = null,
}) => {
  /**
   * ---------------------------------------------------- *
   * @var {hooks}
   * ---------------------------------------------------- *
   */
  const client = useApolloClient();
  const mount = useRef();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * ---------------------------------------------------- *
   * @dependency []
   * @summary {lifecycle}
   * ---------------------------------------------------- *
   */
  useEffect(() => {
    mount.current = true;
    if (mount.current && useInitData) {
      onRefetchData();
    }
    return () => (mount.current = false);
  }, []);

  /**
   * ---------------------------------------------------- *
   * @function {onRefetchData}
   * @summary function use for get data
   * ---------------------------------------------------- *
   */
  const onRefetchData = async ({params = null, paramsOpt = null}) => {
    try {
      setLoading(true);
      let config = {mutation: schema};
      if (variables !== null) {
        config.variables = variables;
      }
      if (params !== null) {
        config.variables = params;
      }
      if (opts !== null) {
        config = {...config, ...opts};
      }
      const res = await client.mutate(config);
      setLoading(false);
      if (mount.current) {
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
          source: 'useCustomMutation',
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
  };

  /**
   * ---------------------------------------------------- *
   * @returns {object}
   * @summary hooks returning needed object
   * ---------------------------------------------------- *
   */
  return {loading, data, error, onRefetchData};
};

export default useCustomMutation;
