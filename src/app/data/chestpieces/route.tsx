export async function GET(request: Request) {
    return new Response(JSON.stringify(require("../chestpieces.json")), {
        status: 200,
    });
}
