import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider value={defaultSystem}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}
