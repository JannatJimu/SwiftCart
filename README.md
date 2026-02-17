1) Difference between null and undefined:

null: মান intentionally খালি বা ফাঁকা হিসেবে assign করা।

undefined : মান declare করা হয়েছে কিন্তু assign করা হয়নি।

Example:
let a; // undefined
let b = null; // null

2) map() function and difference from forEach():

map() :  Array-এর প্রতিটি element modify করে নতুন array return করে।
forEach() : Array-এর element-এর উপর কাজ করে, কিন্তু কিছু return করে না।
Example:
let arr = [1,2,3];
let squared = arr.map(x => x*x); // [1,4,9]
arr.forEach(x => console.log(x)); // শুধু console log করবে 

3) Difference between == and ===:
== → Value check করে, type convert করতে পারে।
=== → Value + Type দুটোই check করে ।
Example:
5 == '5'  // true
5 === '5' // false

4) Significance of async/await in fetching API data:
async/await : asynchronous code কে synchronous-এর মতো readable করে।
API data fetch করার সময় promise resolve না হওয়া পর্যন্ত wait করতে পারে।
Example:
async function getData() {
    let response = await fetch('url');
    let data = await response.json();
    console.log(data);
}

5) Scope in JavaScript :
Global Scope : যেকোনো জায়গা থেকে access করা যায়।

Function Scope : শুধু সেই function এর ভিতরে access করা যায়।

Block Scope : শুধু { } এর ভিতরে access করা যায় ।

Example:
let x = 10; // global
function test() {
    let y = 20; // function scope
    if(true){
        let z = 30; // block scope
    }
}
