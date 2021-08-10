# Easy Object Pool

an easy way to use object pool

## Install

`yarn add easy-object-pool`  
or  
`npm i easy-object-pool -S`

## Usage

```typescript
import {useObjectPool} from 'easy-object-pool'

class Cat {
}

const [getACat, recycleCat] = useObjectPool<Cat>(() => new Cat())

//create a Cat instance
const cat = getACat()

//recycle a Cat instance
recycleCat(cat)
```

## Api

### Declare
```typescript
function useObjectPool<T>(factoryMethod: (...params: any[]) => T, options?: {
	initializationMethod?: (instance: T, ...params: any[]) => void;
	disposeMethod?: (instance: T, ...params: any[]) => void;
	preInstantiationQuantity?: number;
	limit?: number;
}): [(...params: any[]) => T, (instance: T | T[]) => void, () => void];
```

### Options interface

| field | type | required | default | description |
| :--- | :--- | :---: | :---: | :--- |
| `factoryMethod` | see Declare | ✅ | | factory method to instantiate a instance |
| `initializationMethod` | see Declare |  | | initialize a instance when get a instance |
| `disposeMethod` | see Declare |  | | call if clean instances |
| `preInstantiationQuantity` | `number` |  | `0` | instantiate some instances at ahead |
| `limit` | `number` |  | `0` | set a limit quantity of pool |

### Returns

`[getAInstance, recycleInstance, cleanAllInstance]`

| field | type | description |
| :--- | :--- | :--- |
| `getAInstance` | see Declare | get a instance |
| `recycleInstance` | see Declare | recycle a instance or instances |
| `cleanAllInstance` | see Declare | clean all instances |
