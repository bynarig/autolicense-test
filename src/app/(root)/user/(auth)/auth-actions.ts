"use client"


export async function clientSignOut(callbackUrl: string = "/") {
    return await fetch("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify(callbackUrl),
        headers: {"Content-Type": "application/json"}
    })
}

export async function clientSignIn(data: { email: string; password: string }) {
    return await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    })
}

export async function clientRegister(data: { email: string; password: string }) {
    return await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    });
}
