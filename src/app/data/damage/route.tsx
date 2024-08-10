export async function GET(request: Request) {
    return new Response(JSON.stringify(require("../damage.json")), {
        status: 200,
    });
}
