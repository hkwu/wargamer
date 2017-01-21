# Modules
Wargamer clients have additional convenience methods which are made available through client modules. This page lists these modules and their functionality.

> #### Note
> Module convenience methods do not return a promise resolving to the same wrapped `APIResponse` as the regular `get()` or `post()` methods. Instead, they resolve directly to the resource requested (e.g. a `string` or `Object`).

## Usage
Modules are accessed by name through their respective client instances. For instance, the Accounts module on a World of Tanks client is available through `client.accounts`.

## List of Modules
### Common
These are modules that are not unique to a specific client.
- **[Authentication](?api=modules-common#Authentication)**
  - Provides methods for handling client access tokens.

### World of Tanks
These are modules tied to the [World of Tanks](?api#WorldOfTanks) client.

- **[Accounts](?api=modules-wot#Accounts)**
  - Provides methods for retrieving player account data.

- **[Tankopedia](?api=modules-wot#Tankopedia)**
  - Provides methods for retrieving vehicle data.
