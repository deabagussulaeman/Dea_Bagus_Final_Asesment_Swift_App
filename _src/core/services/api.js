import {ApolloClient, createHttpLink, concat, HttpLink} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {RetryLink} from '@apollo/client/link/retry';
import {Storage} from '@app/helpers/Storage';
import {cache} from '@app/services/cache';
import {apolloConfig} from '@root/swift.config';
import 'cross-fetch/polyfill';
import {checkoutSession} from '@root/swift.config';
import Config from 'react-native-config';
/**
 * query
 * @param {*} schema
 * @param {*} data
 * @param {*} opts
 *
 * @return {promise}
 */
export const query = async (schema, data = null, opts = null) => {
  let configClient = {query: schema};
  if (data !== null) {
    configClient.variables = data;
  }
  if (opts !== null) {
    configClient = {...configClient, ...opts};
  }
  return client.query(configClient);
};

/**
 * mutate
 * @param {*} schema
 * @param {*} data
 * @param {*} opts
 *
 * @return {promise}
 */
export const mutate = async (schema, data = null, opts = null) => {
  let configClient = {mutation: schema};
  if (data !== null) {
    configClient.variables = data;
  }
  if (opts !== null) {
    configClient = {...configClient, ...opts};
  }
  return client.mutate(configClient);
};

/**
 * ---------------------------------------------------- *
 * this setup for calling graphql
 * ---------------------------------------------------- *
 */
const uri = apolloConfig.useJest.enable
  ? apolloConfig.useJest.api_url
  : Config.GRAPHQL_BASE_URL;
const httpLink = createHttpLink({
  uri,
  useGETForQueries: apolloConfig.method === 'GET',
});
const httpLinkPost = new HttpLink({
  uri,
});
const methodLink = new RetryLink().split(
  operation => operation.getContext().method === 'POST',
  httpLinkPost,
  httpLink,
);

const authMiddleware = setContext(async (_, {request, headers}) => {
  const getAuthData = await Storage.get(Storage.name.TOKEN);
  const getCheckoutSessionToken = await Storage.get(
    Storage.name.CHECKOUT_SESSION_TOKEN,
  );
  const isTokenNull = getAuthData === null;
  const isAuthOff = request === 'auth-off';
  const token = isTokenNull ? '' : getAuthData;
  let headersData = {...headers, 'Content-Type': 'application/json'};
  if (!isTokenNull && !isAuthOff) {
    headersData.Authorization = token ? `Bearer ${token}` : '';
  }
  if (checkoutSession.enable && getCheckoutSessionToken) {
    headersData = {...headersData, 'Checkout-Token': getCheckoutSessionToken};
  }
  if (apolloConfig.console) {
    console.log('headers', getAuthData);
  }
  return {headers: headersData};
});

/**
 * ---------------------------------------------------- *
 * @instance of apollo client
 * @summary all middleware, httplink, etc.
 * ---------------------------------------------------- *
 */
const client = new ApolloClient({
  cache,
  link: concat(authMiddleware, methodLink),
});

export default client;
