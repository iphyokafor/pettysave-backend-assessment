import chai from "chai";
import chaiHttp from "chai-http";
import server from "../../app";
import { user, user2, user3 } from "./user.test.data";
import {
    login,
    login2,
    login3,
    refreshToken,
    refreshToken2,
} from "./login.test.data";

chai.should();

chai.use(chaiHttp);

const url = "/api/v1";

describe("Authentication Endpoint", async() => {
    describe("it should register a user", () => {
        it("it should register a user successfully", (done) => {
            chai
                .request(server)
                .post(`${url}/register`)
                .set("Accept", "application/json")
                .send(user)
                .end((err, response) => {
                    response.body.should.be.a("object");
                    done();
                });
        });

        it("it should not register a user with incomplete details", (done) => {
            chai
                .request(server)
                .post(`${url}/register`)
                .set("Accept", "application/json")
                .send(user2)
                .end((err, response) => {
                    response.should.have.status(422);
                    done();
                });
        });
        it("it should not register a user with email already in use", (done) => {
            chai
                .request(server)
                .post(`${url}/register`)
                .set("Accept", "application/json")
                .send(user3)
                .end((err, response) => {
                    response.body.should.be.a("object");
                    done();
                });
        });
    });

    describe("it should login a user", () => {
        it("it should login a user successfully", (done) => {
            chai
                .request(server)
                .post(`${url}/login`)
                .set("Accept", "application/json")
                .send(login)
                .end((err, response) => {
                    response.body.should.be.a("object");
                    done();
                });
        });

        it("it should not login a user with incomplete details", (done) => {
            chai
                .request(server)
                .post(`${url}/login`)
                .set("Accept", "application/json")
                .send(login2)
                .end((err, response) => {
                    response.should.have.status(400);
                    done();
                });
        });
        it("it should not login a user without email and password", (done) => {
            chai
                .request(server)
                .post(`${url}/login`)
                .set("Accept", "application/json")
                .send(login3)
                .end((err, response) => {
                    response.should.have.status(400);
                    done();
                });
        });
    });

    describe("it should verify refreshToken", () => {
        it("it should create a refreshToken and accessToken", (done) => {
            chai
                .request(server)
                .post(`${url}/refresh-token`)
                .set("Accept", "application/json")
                .send(refreshToken)
                .end((err, response) => {
                    response.body.should.be.a("object");
                    done();
                });
        });

        it("no refresh token", (done) => {
            chai
                .request(server)
                .post(`${url}/refresh-token`)
                .set("Accept", "application/json")
                .send(refreshToken2)
                .end((err, response) => {
                    response.should.have.status(400);
                    done();
                });
        });
    });
});