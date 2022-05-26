export const handler = async (): Promise<any> => {
  try {
    const data = {
      message: "This is an apple!",
    };
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};