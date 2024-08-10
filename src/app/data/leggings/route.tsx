export async function GET(request: Request) {
    return new Response(JSON.stringify(require("../leggings.json")), {
        status: 200,
    });
}
