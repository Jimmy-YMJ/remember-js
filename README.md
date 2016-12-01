# remember-js

**remember-js** is used to remember some program operations and redo those if needed.

## Installing
Use via npm:
```bash
$ npm install remember-js
```
```javascript
const Remember = require('remember-js');

// Use es6 import
import Remember from 'remember-js';

```
Use in browser:

Scripts for browser is under [build](https://github.com/Jimmy-YMJ/remember-js/tree/master/build) directory, use `remember.js` for development environment(contains inline source maps), use `remember.min.js` for production.
The references in browser is `window.Remember`.

## Conventions

`Remember` is the main class of **remember-js** package and `remember` is an instance of `Remember`.
An **action type** is a unique string identifying a callback that doing some program operations.
An **action** is a call of an **action type**.


## A common problem
Suppose you have an app running in browser and it needs to send user produced information to server by ajax requests, you hope your app can work even when the network is off.
To solve this problem your app should remember the request that is failed because of network error, and resend it when the network is on or even when the user reload your app next time.
Using **remember-js** can solve this problem, and let's write an example:

First, we will create a Remember instance and register some remember action types, and the file name is `remember.js`.
```javascript
import Remember from 'remember-js';
import axios from 'axios'; // A promise based HTTP client, you can google and learn more about it.

const remember = new Remember({
    storage: window.localStorage,
    storageId: 'my-app-remember-id'
  });

export const SAVE_USERNAME = 'SAVE_USERNAME';

remember.registerAction(SAVE_USERNAME, function (remember, userId, username) {
  return axios({
    method: "patch",
    url: `/api/users/${userId}`,
    data: {action: 'update', path: 'username', value: username}
  }).catch(function(err){
    if(err.data === 'undefined'){
      // If this error is caused by a network error instead of a server side error, remember this action.
      // This is a special checking method for axios, for other HTTP client like jQuery.ajax please
      // look for a right way to identify that it's a network error.
      remember();
    }
  });
});

// Here, we simply run consume method every 5 seconds to redo remembered actions.
setInterval(function(){
  remember.consume();
}, 5000);

export default remember;

```

Second, use the registered remember action types.
The file name is `test.js` and it has the same directory with `remember.js`.
```javascript
import remember, { SAVE_USERNAME } from './remember.js';

remember.do(SAVE_USERNAME, 'userId', 'username');

```

## Examples
Using [MemoryStorage](https://github.com/Jimmy-YMJ/remember-js/blob/master/src/lib/MemoryStorage.js) (it's the default storage) to process actions sequentially.

```javascript

// Instantiate a Remember instance
import Remember from 'remember-js';

const remember = new Remember({
    inSequence: true, // Pay attention to this option, it's different from the 'A common problem' example.
    storageId: 'my-app-remember-id'
  });

// Register and export some action types
export const FIRST_ACTION = 'FIRST_ACTION';
export const SECOND_ACTION = 'SECOND_ACTION';

remember.registerAction(FIRST_ACTION, function(next, param1, param2){
  // Do something with params
  next();
});

remember.registerAction(SECOND_ACTION, function(next){
  // Do something
  next();
});

// Do actions: FIRST_ACTION and then SECOND_ACTION.
// If FIRST_ACTION call is failed(the next callback is not called for some reasons), the consuming will stop with FIRST_ACTION call and SECOND_ACTION call stored in storage.
// Under the hood, every time remember does an action it will store this action first and then consume.
remember.do(FIRST_ACTION, 'param1', 'param2');
remember.do(SECOND_ACTION);
```

## Constructor and methods

### Remember(options)

| **Option** | **Description** | **type** | **default** |
| --- | --- | --- | --- |
| inSequence | If it's `true`, the remember will make sure that all the actions is completed in the order they are called. | `Boolean` | `false` |
| storageId | The storage identity to use to store the action, you should provide your own if you are going to use more than one remembers. |`String` | `'#REMEMBER_JS_REMEMBER_QUEUE'` |
| storage | The storage used to store actions. It's required to provide two methods: `getItem(key)` and `setItem(key, value)`, you can use localStorage or sessionStorage directly in browser context. | `Object` | [MemoryStorage](https://github.com/Jimmy-YMJ/remember-js/blob/master/src/lib/MemoryStorage.js). |
| onConsumingComplete | If the `inSequence` parameter is `true` and the stored actions is not empty, this callback will be called when stored actions are all completed. | `Function`| `undefined` |

The `inSequence` option can define two different types of remember.
If it's `true`, the callback of `remember.registerAction` will be passed a `next` parameter which is used to tell remember that the current action is completed and do next action please.
If it's `false`, the callback of `remember.registerAction` will be passed a `remember` parameter which is used to tell remember that the current action is failed and store it please.


### remember.registerAction(name, callback)
| **Param** | **Description** | **type** | **default** |
| --- | --- | --- | --- |
| name | The name to identify an action type. | `String` | `undefined` |
| callback | The callback to do some operations when this action type is called. | `Function` | `undefined` |


### remember.do(name, a, b, c, d, e, f)
| **Param** | **Description** | **type** | **default** |
| --- | --- | --- | --- |
| name | The action type to use. | `String` | `undefined` |
| a, b, c, d, e, f | Parameters that will be passed to action type callback. | Any type | `undefined` |

### remember.set(options)
This method is used to set remember options, parameter `options` is the same with `Remember`'s.

### remember.consume()
This method is used to consume stored actions.

### remember.clear()
This method is used to remove all stored actions.


## License
MIT