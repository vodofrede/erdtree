export async function GET(request: Request) {
    return new Response(JSON.stringify(require("../helmets.json")), {
        status: 200,
    });
}
