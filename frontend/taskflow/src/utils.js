export function getErrorMessage(error) {
  const data = error.response?.data;
  if (data?.detail) {
    return data.detail;
  }
  if (data?.error) {
    return data.error;
  }
  if (data && typeof data === "object") {
    const messages = Object.values(data)
      .flat()
      .filter((value) => typeof value === "string");

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }
  if (!error.response && error.request) {
    return "unable to connect to the Server";
  }
  return "something Went Wrong";
}
