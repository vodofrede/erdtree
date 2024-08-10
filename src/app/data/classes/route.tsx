export async function GET(request: Request) {
    return new Response(JSON.stringify(require("../classes.json")), {
        status: 200,
    });
}
