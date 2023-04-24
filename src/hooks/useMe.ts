import { Collector } from "@/graphql.types";
import { GetMe } from "@/queries/me.graphql";
import { useQuery, QueryResult, OperationVariables } from "@apollo/client";

interface GetMeData {
  me: Collector | undefined;
}
export default function useMe(): QueryResult<GetMeData, OperationVariables> {
  return useQuery<GetMeData>(GetMe);
}
