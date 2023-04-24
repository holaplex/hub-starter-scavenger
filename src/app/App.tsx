"use client";

import { ApolloProvider } from "@apollo/client";
import api from "@/modules/api";

export default function App({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={api}>{children}</ApolloProvider>;
}
