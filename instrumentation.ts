export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NODE_ENV === "development"
  ) {
    const { server } = await import("./src/mocks/node");
    server.listen({ onUnhandledRequest: "bypass" });
  }
}
