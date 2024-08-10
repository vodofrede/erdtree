export async function GET(request: Request) {
    return new Response(JSON.stringify(require("../gauntlets.json")), {
        status: 200,
    });
}
