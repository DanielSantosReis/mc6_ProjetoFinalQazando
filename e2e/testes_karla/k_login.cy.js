describe("k_login", () => {
  it("Login com sucesso", () => {
    cy.env(["email", "password"]).then((env) => {
      cy.login(env.email, env.password);
    });
  });
});
