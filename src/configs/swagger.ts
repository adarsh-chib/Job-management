import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Job Management API",
            version: "1.0.0",
            description: "API documentation for Job Management System",
        },
        servers: [
            {
                url: "https://job-management-e4z4.onrender.com",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts"], // path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;