import {useQuery} from '@apollo/client';
import {query_current_user} from '../graphql/queries/user';

export const useAuth = (): [boolean, boolean] => {
  //https://itnext.io/animal-tribes-how-to-create-your-first-full-stack-typescript-graphql-application-pt-3-frontend-dc69f71e1d62
  const {loading, data} = useQuery(query_current_user);

  if (loading) return [false, loading];

  return [!!data?.current_user, loading];
};
