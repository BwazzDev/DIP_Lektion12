// put.js
async function put(url, objekt) {
    const respons = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(objekt),
        headers: { 'Content-Type': 'application/json' }
    });
    if (respons.status !== 200) // OK
        throw new Error(respons.status);
    return await respons.json();
}