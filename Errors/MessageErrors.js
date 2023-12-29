
export const GeneratorUserError = (user) => {
    return `uno de los siguientes campos son invalidos o imcompletos:
        - UserName: ${user.username}
        - Password: ${user.password}
        - FirstName: ${user.name}
        - LastName: ${user.lastName}
        - Email: ${user.email}
        - Dni: ${user.dni}
        - Age: ${user.age}
        - Cart: ${user.cart}
        - TypeUser: ${user.typeUser}
    `
}