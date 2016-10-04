function sayHello(): string {
    const compiler = (document.getElementById('compiler') as HTMLInputElement).value;
    const framework = 'no framework';
    return `Hello from ${compiler} and ${framework}!`;
}