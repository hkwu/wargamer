# Introduction
Wargamer provides a promise-based interface for making requests to the Wargaming.net API. There are multiple API client classes, each meant for making requests to specific APIs.

## Constructing the Client
You can import the `Wargamer` class from the library, which has static methods to construct each type of API client.

```js
import Wargamer from 'wargamer';

const wot = Wargamer.WoT({ realm: 'na', applicationId: 'id' });
```

Alternatively, you can import just the API client constructor that you need.

```js
import { WorldOfTanks } from 'wargamer';

const wot = new WorldOfTanks({ realm: 'na', applicationId: 'id' });
```

The client constructors take a [ClientOptions](?api#ClientOptions) object.
    
> #### Usage with `require()`
> Unfortunately, this is less elegant.
> ```js
> // preferred
> const { WorldOfTanks } = require('wargamer');
>
> // but if you must
> const Wargamer = require('wargamer').default;
> const WorldOfTanks = require('wargamer').WorldOfTanks;
> ```

## Making Requests
API clients currently support GET and POST requests through the [get()](?api#BaseClient#get) and [post()](?api#BaseClient#post) methods, respectively. The `method` parameter determines which API method the request will use. For instance, the following snippet will make a GET request to the `account/list` endpoint in the World of Tanks API.

```js
wot.get('account/list', { search: 'test' })
  .then(res => console.log(res.data))
  .catch(err => console.log(err.message));
```

The request methods have a promise interface, so you can chain `then()` and `catch()` calls to their return values. You can also use `async`/`await` if you want.

On a successful request, the return value will resolve to an [APIResponse](?api#APIResponse) object.

On error, the promise will reject. However, the value that the promise rejects with will differ depending on if there was an error with the request itself or if the Wargaming API rejected the request (although the request was correctly received).

- If the request did not reach the API correctly, the promise rejects with a [RequestError](?api#RequestError).
- If the request reached the API and was then rejected, the promise rejects with an [APIError](?api#APIError).

### Sending Parameters
The second parameter in the request methods is the parameter payload to send to the API method. Keys in the parameters object will be merged automatically with the client's application ID on each request, so you don't need to specify it each time. Similarly, the client's access token (if one was provided) will also be merged in.

> Note that user provided keys will still overwrite existing keys. You can, for instance, override the client's default application ID on a per-request basis by providing another `application_id` in the parameters object.

Some API method parameter values require special formatting. In order to make it more convenient to work with these parameters, Wargamer automatically converts the following values:

| Input | Output | Transformation |
| :---: | :---: | ----- |
| `Array` | `string` | Elements are joined into a comma-delimited string. |
| `Date` | `string` | Object is converted to an ISO 8601 string. |
