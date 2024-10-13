export async function login() {
  const data = await fetch("https://jsonplaceholder.typicode.com/todos/1");

  return data.json();
}
