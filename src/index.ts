import http2 from "http2";
import https from "https";
import fs from "fs";
import polka, { Request } from "polka";

interface Joke {
    id: number;
    link: string;
}

const jokes: Joke[] = [
    {
        id: 1,
        link: "https://jokesbapak2.herokuapp.com/id/1"
    },
    {
        id: 2,
        link: "https://jokesbapak2.herokuapp.com/id/2"
    },
    {
        id: 3,
        link: "https://jokesbapak2.herokuapp.com/id/3"
    },
    {
        id: 4,
        link: "https://jokesbapak2.herokuapp.com/id/4"
    },
    {
        id: 5,
        link: "https://jokesbapak2.herokuapp.com/id/5"
    }
]

interface ResponseObj {
    data?: Buffer;
    contentType?: string
}

function requestToAPI(link: string): Promise<ResponseObj> {
    return new Promise((resolve, reject) => {
        https.get(link, (res) => {
            const { statusCode } = res;
            if (statusCode && statusCode >= 400) {
                return reject("Request failed")
            }
            const contentType = res.headers["content-type"]
    
            const data: Buffer[] =  [];
            res.on("data", (chunk) => {
                data.push(chunk);
            });
            res.on("end", () => {
                return resolve({
                contentType,
                data: Buffer.concat(data),
            })});
            res.on("error", (err) => reject(err))
        })
    })
    
}

const app = polka<http2.Http2ServerRequest & Request>();

app.get("/", async (req, res) => {
    const rand = Math.floor(Math.random() * (jokes.length-1 - 1) + 1);
    const img = await requestToAPI(jokes[rand].link);
    res.writeHead(200, { "content-type": img.contentType }).end(img.data);
})

app.get("/:id", async (req, res) => {
    const {id} = req.params;
    const joke: Partial<Joke> = jokes.find(i => i.id === Number(id)) || {};
    if (Object.keys(joke).length === 0) {
        res.writeHead(404, { "content-type": "plain/text"}).end("This is not the image you're looking for");
        return;
    }
    const img = await requestToAPI(joke.link as string);
    res.writeHead(200, { "content-type": img.contentType }).end(img.data);
})

http2.createSecureServer({
    key: fs.readFileSync("ssl/server-key.pem"),
    cert: fs.readFileSync("ssl/server-cert.pem")
}, app.handler as any).listen(3000, () => console.log("Listening https://localhost:3000"))