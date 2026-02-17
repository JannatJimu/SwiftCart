## 1. Difference between null and undefined:

null: মান intentionally খালি বা ফাঁকা হিসেবে assign করা।

undefined : মান declare করা হয়েছে কিন্তু assign করা হয়নি।

Example:<br>
let a; // undefined<br>
let b = null; // null <br>

## 2. map() function and difference from forEach():

map() :  Array-এর প্রতিটি element modify করে নতুন array return করে।<br>
forEach() : Array-এর element-এর উপর কাজ করে, কিন্তু কিছু return করে না।<br>
Example:<br>
let arr = [1,2,3];<br>
let squared = arr.map(x => x*x); // [1,4,9]<br>
arr.forEach(x => console.log(x)); // শুধু console log করবে <br>

## 3. Difference between == and ===:
== → Value check করে, type convert করতে পারে।<br>
=== → Value + Type দুটোই check করে ।<br>
Example:<br>
5 == '5'  // true <br>
5 === '5' // false <br>

## 4.Significance of async/await in fetching API data:
async/await : asynchronous code কে synchronous-এর মতো readable করে।<br>
API data fetch করার সময় promise resolve না হওয়া পর্যন্ত wait করতে পারে।<br>
Example:<br>
async function getData() { <br>
    let response = await fetch('url'); <br>
    let data = await response.json(); <br>
    console.log(data); <br>
}

## 5. Scope in JavaScript : 
Global Scope : যেকোনো জায়গা থেকে access করা যায়।  <br>

Function Scope : শুধু সেই function এর ভিতরে access করা যায়। <br>

Block Scope : শুধু { } এর ভিতরে access করা যায় । <br>

Example: <br>
let x = 10; // global <br>
function test() { <br>
    let y = 20; // function scope <br>
    if(true){ <br>
        let z = 30; // block scope <br>
    } <br>
} <br>
