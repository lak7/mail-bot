// /api/clerk/webhook

export const POST = async (req: Request) => {
  const { data } = await req.json();

  return new Response("Ok", { status: 200 });
};
