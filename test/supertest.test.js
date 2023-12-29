import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe('testing de proyecto', () => {

        let JWT

        it("la cookie JWt debe ser guardada dentro de la variable", async() => {

            const username = {
                username: "hagovero"
            }

            let result = await requester.post("/userDB/cookies/set_cookies").send(username);

            console.log(result.text);

            JWT = result.text;
            
        })

    describe("test de productos", () => {

        it("el endpoint POST productsDB/Post_dbproduct debe crear un producto", async() => {

            const productoMock = {
                title: "productoMock",
                description: "la descripcion del producto",
                price: 200,
                Thumbnail: "thumbnail de producto",
                code: "codigo unico",
                stock: 100,
                owner: "premium",
                status: true
            }

            const {
                statusCode,
                ok,
                _body
            } = await requester.post("/productsDB/Post_dbproduct").set("Cookie", [`JWT=${JWT}`]).send(productoMock);
            
            expect(_body).to.be.ok;
            
        })

        it("el endpoint GET productsDB/Get_dbproduct debe traerme todos los productos", async() => {

            let result = await requester.get("/productsDB/Get_dbproduct").set("Cookie", [`JWT=${JWT}`]);

            console.log(result.text);

        })
    })

    describe("test de carrito", () => {

        it("el endpoint GET cartsDB/Get_dbcarrito debera poder traernos todos los carritos", async() => {

            let result = await requester.get("/cartsDB/Get_dbcarrito");

            console.log(result.body);
        })

    })

})